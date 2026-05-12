interface Props {
  color: string;
  flip?: boolean;
}

export function TornDivider({ color, flip = false }: Props) {
  return (
    <div style={{ height: 24, width: '100%', overflow: 'hidden', transform: flip ? 'scaleY(-1)' : undefined }}>
      <svg viewBox="0 0 100 6" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <polygon
          points="0,0 0,6 4,2 8,6 12,2 16,6 20,2 24,6 28,2 32,6 36,2 40,6 44,2 48,6 52,2 56,6 60,2 64,6 68,2 72,6 76,2 80,6 84,2 88,6 92,2 96,6 100,2 100,0"
          fill={color}
        />
      </svg>
    </div>
  );
}
