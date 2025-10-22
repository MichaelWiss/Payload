import type { Badge as BadgeData } from '@/lib/constants';

interface BadgeProps {
  badge: BadgeData;
  index: number;
}

export function Badge({ badge, index }: BadgeProps) {
  return (
    <div className="badge-round" data-rotate={badge.rotate}>
      <div className="in">{badge.label}</div>
      <svg viewBox="0 0 100 100" aria-hidden>
        <defs>
          <path
            id={`badge-circle-${index}`}
            d="M50 50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          />
        </defs>
        <text fontSize="8" fontWeight="900">
          <textPath href={`#badge-circle-${index}`}>{badge.copy}</textPath>
        </text>
      </svg>
    </div>
  );
}
