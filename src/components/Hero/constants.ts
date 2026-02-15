export const SCREEN_INSET_STYLE = {
  top: '1.5%',
  right: '2.8%',
  bottom: '1.5%',
  left: '2.8%',
  borderRadius: '1.9rem',
} as const;

export const parsePercent = (value: string) => Number.parseFloat(value) / 100;
