import React from 'react';

interface GradientCameraProps {
  className?: string;
  size?: number | string;
  id?: string;
}

export const GradientCamera: React.FC<GradientCameraProps> = ({
  className = 'w-7 h-7',
  size,
  id = 'Camera-1--Streamline-Core-Gradient',
}) => {
  const gradientId = `paint0_linear_camera1_${Math.random().toString(36).substring(2, 9)}`;

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
      <desc>Camera 1 Streamline Icon: https://streamlinehq.com</desc>
      <g id="Free Gradient/Images Photography/camera-1--photos-picture-camera-photography-photo-pictures">
        <path
          id="Subtract"
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M4.32125 1.24275C4.41162 1.09215 4.57437 1 4.75 1h4.5c.17563 0 .33838.09215.42875.24275L11.0331 3.5H12.5c.3978 0 .7794.15804 1.0607.43934S14 4.60217 14 5v6.5c0 .3978-.158.7794-.4393 1.0607S12.8978 13 12.5 13h-11c-.39783 0-.779356-.158-1.06066-.4393C.158035 12.2794 0 11.8978 0 11.5V5c0-.39782.158035-.77936.43934-1.06066C.720644 3.65804 1.10217 3.5 1.5 3.5h1.4669l1.35435-2.25725ZM4.25 7.78125c0-1.51878 1.23122-2.75 2.75-2.75s2.75 1.23122 2.75 2.75S8.51878 10.5312 7 10.5312 4.25 9.30003 4.25 7.78125Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="1.5"
          x2="13.5"
          y1="2"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#007df0" />
          <stop offset="100%" stopColor="#00d078" />
        </linearGradient>
      </defs>
    </svg>
  );
};
