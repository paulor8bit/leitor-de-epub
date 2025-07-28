
import React from 'react';

const AutoPlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21.5 12a9.5 9.5 0 1 1-7.9-9.14"></path>
    <path d="M22 4v6h-6"></path>
    <path d="m10 8 5 4-5 4V8z"></path>
  </svg>
);

export default AutoPlayIcon;
