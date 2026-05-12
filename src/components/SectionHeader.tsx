import { F } from '../tokens';

interface Props {
  title: string;
  sub: string;
  color?: string;
}

export function SectionHeader({ title, sub, color }: Props) {
  return (
    <div style={{ marginBottom: 24, color: color ?? '#fafafa' }}>
      <div style={{ fontFamily: F.mono, fontSize: 11, opacity: 0.65, letterSpacing: 1.5, marginBottom: 6 }}>{sub}</div>
      <h2 style={{ fontFamily: F.display, fontSize: 'clamp(36px, 10vw, 56px)', margin: 0, lineHeight: 0.95, letterSpacing: -1 }}>
        {title}
      </h2>
    </div>
  );
}
