
import React from 'react';

const SpeakerOffIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M11 5 6 9H2v6h4l5 4V5z"></path>
    <path d="M17.61 17.61a6.94 6.94 0 0 0-2.06-2.06M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1-1.55 12.8M22 2l-20 20"></path>
  </svg>
);

export default SpeakerOffIcon;
