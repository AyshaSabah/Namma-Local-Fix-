import React from 'react';

interface GradientUserProps {
  className?: string;
  size?: number | string;
  id?: string;
}

export const GradientUser: React.FC<GradientUserProps> = ({
  className = 'w-5 h-5',
  size,
  id = 'Single-Neutral--Streamline-Core-Gradient',
}) => {
  const gradientId = `paint0_linear_user_${Math.random().toString(36).substring(2, 9)}`;

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
      <desc>Single Neutral Streamline Icon: https://streamlinehq.com</desc>
      <g id="Free Gradient/Users/single-neutral--actions-human-man-people-person-single-user-women">
        <path
          id="Union"
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M7 1c1.65685 0 3 1.34315 3 3s-1.34315 3-3 3-3-1.34315-3-3 1.34315-3 3-3Zm-4.75 8C1.00736 9 0 10.0074 0 11.25V12c0 .5523.447715 1 1 1h12c.5523 0 1-.4477 1-1v-.75C14 10.0074 12.9926 9 11.75 9H2.25Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="1.5"
          x2="12.5"
          y1="1"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00e0ff" />
          <stop offset="100%" stopColor="#6a2ff2" />
        </linearGradient>
      </defs>
    </svg>
  );
};
