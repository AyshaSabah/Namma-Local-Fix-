import React from 'react';

interface GradientHomeProps {
  className?: string;
  size?: number | string;
  id?: string;
}

export const GradientHome: React.FC<GradientHomeProps> = ({
  className = 'w-5 h-5',
  size,
  id = 'House-1--Streamline-Core-Gradient',
}) => {
  const gradientId = `paint0_linear_home_${Math.random().toString(36).substring(2, 9)}`;

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
      <desc>House 1 Streamline Icon: https://streamlinehq.com</desc>
      <g id="Free Gradient/Interface Essential/house-1--home-house-building-stay-architecture">
        <path
          id="Union"
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M6.35355.646447c.39053-.390525 1.02369-.390525 1.41422 0l5.5 5.5c.3905.39052.3905 1.02369 0 1.41421-.3906.39053-1.0237.39053-1.4143 0L12 7.41421V12c0 .5523-.4477 1-1 1H8.5c-.55228 0-1-.4477-1-1V9.5c0-.27614-.22386-.5-.5-.5s-.5.22386-.5.5V12c0 .5523-.44772 1-1 1H3c-.55228 0-1-.4477-1-1V7.41421l-.14645.14644c-.39052.39053-1.02369.39053-1.41421 0-.390525-.39052-.390525-1.02369 0-1.41421l5.5-5.5Z"
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
