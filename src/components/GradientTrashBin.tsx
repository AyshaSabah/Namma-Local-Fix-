import React from 'react';

interface GradientTrashBinProps {
  className?: string;
  size?: number | string;
  id?: string;
}

export const GradientTrashBin: React.FC<GradientTrashBinProps> = ({
  className = 'w-4 h-4',
  size,
  id = 'Bin-Clean--Streamline-Core-Gradient',
}) => {
  const gradientId = `paint0_linear_bin_${Math.random().toString(36).substring(2, 9)}`;

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
      <desc>Clean Bin / Recycle Streamline Gradient Icon</desc>
      <g id="Free Gradient/Interface Essential/bin-clean">
        <path
          id="Union"
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M4.5 1.5C4.5.947715 4.94772.5 5.5.5h3c.55228 0 1 .447715 1 1V2h2.25c.4142 0 .75.33579.75.75s-.3358.75-.75.75H12v8c0 1.1046-.8954 2-2 2H4c-1.10457 0-2-.8954-2-2V3.5h-.25C1.33579 3.5 1 3.16421 1 2.75S1.33579 2 1.75 2H4v-.5Zm1 1h3V1.5h-3V2.5ZM10.5 5.5c.2761 0 .5.22386.5.5v5c0 .2761-.2239.5-.5.5s-.5-.2239-.5-.5V6c0-.27614.2239-.5.5-.5Zm-3.5 0c.27614 0 .5.22386.5.5v5c0 .2761-.22386.5-.5.5s-.5-.2239-.5-.5V6c0-.27614.22386-.5.5-.5Zm-3.5 0c.27614 0 .5.22386.5.5v5c0 .2761-.22386.5-.5.5s-.5-.2239-.5-.5V6c0-.27614.22386-.5.5-.5Z"
          clipRule="evenodd"
        />
        {/* Speed / Sparkle dashes on the right side matching image reference */}
        <rect x="11.5" y="5.5" width="2" height="1" rx="0.5" fill={`url(#${gradientId})`} />
        <rect x="11.5" y="8" width="2" height="1" rx="0.5" fill={`url(#${gradientId})`} />
        <circle cx="12.5" cy="11" r="0.6" fill={`url(#${gradientId})`} />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="1"
          x2="13"
          y1="2"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffd600" />
          <stop offset="100%" stopColor="#00d078" />
        </linearGradient>
      </defs>
    </svg>
  );
};
