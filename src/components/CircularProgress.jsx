import React from 'react';

const CircularProgress = ({ value, size = 80, strokeWidth = 5, color = '#5b5fc7', label, sublabel }) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (val) => {
    if (val >= 90) return 'var(--accent-red)';
    if (val >= 75) return 'var(--accent-orange)';
    if (val >= 60) return 'var(--accent-yellow)';
    return color;
  };

  const c = getColor(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div className="circular-progress" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Track */}
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress */}
          <circle
            stroke={c}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease',
              filter: `drop-shadow(0 0 6px ${c}80)`,
            }}
          />
        </svg>
        <div
          className="circular-progress-value"
          style={{
            fontSize: size / 5,
            color: c,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 300,
            letterSpacing: '-0.03em',
          }}
        >
          {value}%
        </div>
      </div>
      {label && (
        <div style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 500,
        }}>
          {label}
        </div>
      )}
      {sublabel && (
        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{sublabel}</div>
      )}
    </div>
  );
};

export default CircularProgress;
