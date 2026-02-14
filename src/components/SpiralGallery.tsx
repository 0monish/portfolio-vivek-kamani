'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import * as THREE from 'three';

export type SpiralGalleryConfig = {
  totalImages: number;
  tilesPerRevolution: number;
  revolutions: number;
  startRadius: number;
  endRadius: number;
  tileHeightRatio: number;
  tileSegments: number;
  spiralGap: number;
  tileOverlap: number;
  cameraZ: number;
  cameraSmoothing: number;
  baseRotationSpeed: number;
  scrollRotationMultiplier: number;
  rotationDecay: number;
  scrollMultiplier: number;
  cameraYMultiplier: number;
  parallaxStrength: number;
};

export const DEFAULT_SPIRAL_GALLERY_CONFIG: SpiralGalleryConfig = {
  totalImages: 12,
  tilesPerRevolution: 15,
  revolutions: 5,
  startRadius: 5,
  endRadius: 3.5,
  tileHeightRatio: 1.1,
  tileSegments: 24,
  spiralGap: 0.35,
  tileOverlap: 0.005,
  cameraZ: 12,
  cameraSmoothing: 0.075,
  baseRotationSpeed: 0.001,
  scrollRotationMultiplier: 0.0035,
  rotationDecay: 0.9,
  scrollMultiplier: 1.25,
  cameraYMultiplier: 0.2,
  parallaxStrength: 0.1,
};

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform vec3 uCameraPosition;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    float facing = max(dot(-normalize(vWorldNormal), viewDir), 0.0);
    float falloff = smoothstep(-0.2, 0.5, facing) * 0.45 + 0.42;
    vec3 color = mix(vec3(1.0), tex.rgb * falloff, 0.975) * 1.25;
    gl_FragColor = vec4(color, tex.a);
  }
`;

export type SpiralGalleryProps = {
  title?: string;
  config?: Partial<SpiralGalleryConfig>;
  imageUrls?: string[];
  imageHeightPreset?: 'md' | 'lg' | 'xl';
  className?: string;
  titleClassName?: string;
  titleAs?: 'h1' | 'h2' | 'h3';
  cameraZMobile?: number;
  enableMouseParallax?: boolean;
  baseRotationSpeed?: number;
  overlayContentZIndex?: number;
  onSceneReady?: (params: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    spiral: THREE.Group;
  }) => void;
  ariaLabel?: string;
  pauseWhenOffscreen?: boolean;
  children?: ReactNode;
};

const DEFAULT_SECTION_CLASSNAME =
  'relative h-[150svh] w-full overflow-hidden bg-black p-8 text-justify text-[#d2d2d2] max-[1000px]:h-[125svh]';

const DEFAULT_TITLE_CLASSNAME =
  'relative text-[clamp(3.5rem,10vw,15rem)] font-bold uppercase leading-[0.8] tracking-[-0.1rem] text-white';

const IMAGE_HEIGHT_PRESET_MULTIPLIER: Record<'md' | 'lg' | 'xl', number> = {
  md: 1,
  lg: 1.2,
  xl: 1.4,
};

export function SpiralGallery({
  title,
  config,
  imageUrls,
  imageHeightPreset = 'md',
  className,
  titleClassName,
  titleAs = 'h2',
  cameraZMobile = 15,
  enableMouseParallax = true,
  baseRotationSpeed,
  overlayContentZIndex = 0,
  onSceneReady,
  ariaLabel = 'Spiral image gallery',
  pauseWhenOffscreen = false,
  children,
}: SpiralGalleryProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const mergedConfig: SpiralGalleryConfig = {
      ...DEFAULT_SPIRAL_GALLERY_CONFIG,
      ...config,
    };
    const effectiveBaseRotationSpeed =
      baseRotationSpeed ?? mergedConfig.baseRotationSpeed;
    const effectiveTileHeightRatio =
      mergedConfig.tileHeightRatio *
      IMAGE_HEIGHT_PRESET_MULTIPLIER[imageHeightPreset];

    const totalTiles = Math.floor(
      mergedConfig.tilesPerRevolution * mergedConfig.revolutions
    );
    const angleStep = (Math.PI * 2) / mergedConfig.tilesPerRevolution;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = mergedConfig.cameraZ;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.className = 'absolute inset-0 h-full w-full';
    container.appendChild(renderer.domElement);

    const textureUrls =
      imageUrls && imageUrls.length > 0
        ? imageUrls
        : Array.from(
            { length: mergedConfig.totalImages },
            (_, index) => `/gallery/img${index + 1}.jpg`
          );

    const textureCount = textureUrls.length;
    const textureLoader = new THREE.TextureLoader();
    const textures = textureUrls.map((url) =>
      textureLoader.load(url, (texture) => {
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      })
    );

    const cameraPositionUniform = {
      value: new THREE.Vector3(0, 0, mergedConfig.cameraZ),
    };

    const tileEdgesY = [0];
    for (let i = 0; i < totalTiles; i += 1) {
      const progress = i / totalTiles;
      const radius =
        mergedConfig.startRadius +
        (mergedConfig.endRadius - mergedConfig.startRadius) * progress;
      const arcWidth = (2 * Math.PI * radius) / mergedConfig.tilesPerRevolution;
      const tileHeight = arcWidth * effectiveTileHeightRatio;

      tileEdgesY.push(
        tileEdgesY[i] -
          (tileHeight + mergedConfig.spiralGap) /
            mergedConfig.tilesPerRevolution
      );
    }

    const spiral = new THREE.Group();
    scene.add(spiral);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.ShaderMaterial[] = [];

    for (let i = 0; i < totalTiles; i += 1) {
      const progress = i / totalTiles;
      const radius =
        mergedConfig.startRadius +
        (mergedConfig.endRadius - mergedConfig.startRadius) * progress;
      const arcWidth = (2 * Math.PI * radius) / mergedConfig.tilesPerRevolution;
      const tileHeight = arcWidth * effectiveTileHeightRatio;
      const tileAngle = arcWidth / radius + mergedConfig.tileOverlap;

      const centerY = (tileEdgesY[i] + tileEdgesY[i + 1]) / 2;
      const slope = tileEdgesY[i + 1] - tileEdgesY[i];
      const positions: number[] = [];
      const uvCoords: number[] = [];
      const indices: number[] = [];

      for (let row = 0; row <= 1; row += 1) {
        for (let col = 0; col <= mergedConfig.tileSegments; col += 1) {
          const angle = (col / mergedConfig.tileSegments - 0.5) * tileAngle;
          positions.push(
            Math.sin(angle) * radius,
            (row - 0.5) * tileHeight +
              (col / mergedConfig.tileSegments - 0.5) * slope,
            Math.cos(angle) * radius
          );
          uvCoords.push(col / mergedConfig.tileSegments, row);
        }
      }

      for (let col = 0; col < mergedConfig.tileSegments; col += 1) {
        const current = col;
        const below = current + mergedConfig.tileSegments + 1;
        indices.push(
          current,
          below,
          current + 1,
          below,
          below + 1,
          current + 1
        );
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        'uv',
        new THREE.Float32BufferAttribute(uvCoords, 2)
      );
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      geometries.push(geometry);

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMap: { value: textures[i % textureCount] },
          uCameraPosition: cameraPositionUniform,
        },
        side: THREE.DoubleSide,
      });
      materials.push(material);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = centerY;

      const tile = new THREE.Group();
      tile.rotation.y = i * angleStep;
      tile.add(mesh);
      spiral.add(tile);
    }

    onSceneReady?.({ scene, camera, renderer, spiral });

    const spiralHeight = Math.abs(tileEdgesY[totalTiles]);
    const lenis = new Lenis({ autoRaf: true });

    let scrollY = 0;
    let spinVelocity = 0;
    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let isMobile = window.innerWidth < 1000;
    let isVisible = true;
    let animationFrameId = 0;
    let visibilityObserver: IntersectionObserver | null = null;

    if (pauseWhenOffscreen) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.01 }
      );
      visibilityObserver.observe(container);
    }

    lenis.on('scroll', (event: { velocity: number }) => {
      scrollY = window.pageYOffset;
      spinVelocity = event.velocity * mergedConfig.scrollRotationMultiplier;
    });

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      isMobile = window.innerWidth < 1000;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.z = isMobile ? cameraZMobile : mergedConfig.cameraZ;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);

      const progress = Math.min(
        scrollY / (window.innerHeight * mergedConfig.scrollMultiplier),
        1
      );

      if (pauseWhenOffscreen && !isVisible) {
        return;
      }

      camera.position.y +=
        (-(progress * spiralHeight * mergedConfig.cameraYMultiplier) -
          camera.position.y) *
        mergedConfig.cameraSmoothing;

      if (!isMobile && enableMouseParallax) {
        smoothX += (mouseX - smoothX) * 0.02;
        smoothY += (mouseY - smoothY) * 0.02;
        spiral.rotation.x = smoothY * mergedConfig.parallaxStrength;
        spiral.rotation.z = -smoothX * mergedConfig.parallaxStrength * 0.3;
      } else {
        spiral.rotation.x = 0;
        spiral.rotation.z = 0;
      }

      cameraPositionUniform.value.copy(camera.position);
      spiral.rotation.y += effectiveBaseRotationSpeed + spinVelocity;
      spinVelocity *= mergedConfig.rotationDecay;

      renderer.render(scene, camera);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      visibilityObserver?.disconnect();
      lenis.destroy();

      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    ariaLabel,
    baseRotationSpeed,
    cameraZMobile,
    config,
    enableMouseParallax,
    imageHeightPreset,
    imageUrls,
    onSceneReady,
    pauseWhenOffscreen,
  ]);

  const HeadingTag = titleAs;

  return (
    <section
      ref={containerRef}
      aria-label={ariaLabel}
      className={
        className
          ? `${DEFAULT_SECTION_CLASSNAME} ${className}`
          : DEFAULT_SECTION_CLASSNAME
      }
    >
      <div className="relative" style={{ zIndex: overlayContentZIndex }}>
        {title ? (
          <HeadingTag
            className={
              titleClassName
                ? `${DEFAULT_TITLE_CLASSNAME} ${titleClassName}`
                : DEFAULT_TITLE_CLASSNAME
            }
          >
            {title}
          </HeadingTag>
        ) : null}
        {children}
      </div>
    </section>
  );
}
