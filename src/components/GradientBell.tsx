import React from 'react';

interface GradientBellProps {
  className?: string;
  size?: number | string;
  id?: string;
}

export const GradientBell: React.FC<GradientBellProps> = ({
  className = 'w-5 h-5',
  size,
  id = 'Notification-Bell--Streamline-Core-Gradient',
}) => {
  const gradientId = `paint0_linear_bell_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      id={id}
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 ${className}`}
    >
      <desc>Notification Bell Streamline Icon</desc>
      <g id="Free Gradient/Interface Essential/notification-bell">
        <path
          id="Subtract"
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M7 1c.41421 0 .75.33579.75.75v.30821c1.9429.3512 3.25 1.95669 3.25 4.04179v2.5761l.9268 1.5447c.1895.3158.2045.7061.0392 1.0363-.1652.3303-.4973.5429-.866.5429H2.9c-.36872 0-.70077-.2126-.86602-.5429-.16526-.3302-.1503-.7205.03922-1.0363L3 8.6761V6.1c0-2.0851 1.3071-3.69059 3.25-4.04179V1.75c0-.41421.33579-.75.75-.75Zm0 12.5c.82843 0 1.5-.6716 1.5-1.5h-3c0 .8284.67157 1.5 1.5 1.5Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="2.625"
          x2="13.089"
          y1="3.029"
          y2="8.869"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffd600" />
          <stop offset="1" stopColor="#00d078" />
        </linearGradient>
      </defs>
    </svg>
  );
};
