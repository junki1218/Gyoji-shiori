import React from 'react';

export default function AnalogClock({ time, size = 100 }) {
  // Parse time string "HH:MM"
  const [hours, minutes] = (time || "00:00").split(':').map(Number);
  
  // Calculate angles
  const minuteAngle = (minutes / 60) * 360;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const center = size / 2;
  const radius = size * 0.45;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>
      {/* Clock Face */}
      <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--text-main)" strokeWidth="3" />
      
      {/* Hour Marks */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const x1 = center + radius * 0.85 * Math.sin(angle);
        const y1 = center - radius * 0.85 * Math.cos(angle);
        const x2 = center + radius * 0.95 * Math.sin(angle);
        const y2 = center - radius * 0.95 * Math.cos(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-main)" strokeWidth="2" />;
      })}

      {/* Hour Hand */}
      <line 
        x1={center} y1={center} 
        x2={center + radius * 0.5 * Math.sin(hourAngle * (Math.PI / 180))} 
        y2={center - radius * 0.5 * Math.cos(hourAngle * (Math.PI / 180))} 
        stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" 
      />

      {/* Minute Hand */}
      <line 
        x1={center} y1={center} 
        x2={center + radius * 0.8 * Math.sin(minuteAngle * (Math.PI / 180))} 
        y2={center - radius * 0.8 * Math.cos(minuteAngle * (Math.PI / 180))} 
        stroke="var(--text-main)" strokeWidth="3" strokeLinecap="round" 
      />

      {/* Center Dot */}
      <circle cx={center} cy={center} r="3" fill="var(--primary)" />
    </svg>
  );
}
