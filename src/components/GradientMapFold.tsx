import React from 'react';

interface GradientMapFoldProps {
  className?: string;
  size?: number | string;
  id?: string;
}

export const GradientMapFold: React.FC<GradientMapFoldProps> = ({
  className = 'w-5 h-5',
  size,
  id = 'Map-Fold--Streamline-Core-Gradient',
}) => {
  const gradientId = `paint0_linear_mapfold_${Math.random().toString(36).substring(2, 9)}`;

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
      <desc>Map Fold Streamline Icon: https://streamlinehq.com</desc>
      <g id="Free Gradient/Map Travel/map-fold--navigation-map-maps-gps-travel-fold">
        <path
          id="Subtract"
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M8.75 1.42212L5.25 0.547119V12.5779L8.75 13.4529V1.42212ZM10.25 13.2029L12.3638 12.6744C13.0316 12.5075 13.5 11.9075 13.5 11.2192V2.28078C13.5 1.30493 12.5829 0.58889 11.6362 0.82557L10.25 1.17212V13.2029ZM1.6362 1.32557L3.75 0.797119V12.8279L2.3638 13.1744C1.41708 13.4111 0.5 12.6951 0.5 11.7192V2.78078C0.5 2.09248 0.968446 1.49251 1.6362 1.32557Z"
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
          <stop stopColor="#ffd600" />
          <stop offset="100%" stopColor="#00d078" />
        </linearGradient>
      </defs>
    </svg>
  );
};
