import { F } from '../tokens';

interface Props {
  title: string;
  sub: string;
  color?: string;
}

export function SectionHeader({ title, sub, color }: Props) {
  return (
    <div style={{ marginBottom: 'clamp(32px, 8vw, 48px)', color: color ?? '#fafafa', borderLeft: `8px solid ${color ?? '#fafafa'}`, paddingLeft: 24 }}>
      <div style={{ fontFamily: F.mono, fontSize: 11, opacity: 0.8, letterSpacing: 3, marginBottom: 8, textTransform: 'uppercase' }}>{sub}</div>
      <h2 style={{ fontFamily: F.display, fontSize: 'clamp(44px, 12vw, 72px)', margin: 0, lineHeight: 0.9, letterSpacing: -3 }}>
        {title}
      </h2>
    </div>
  );
}
