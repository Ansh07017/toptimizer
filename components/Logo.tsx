import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoThemeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7117EA" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="47" stroke="url(#logoThemeGrad)" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" stroke="url(#logoThemeGrad)" strokeWidth="1" strokeOpacity="0.5" />
      
      {/* Graduate Cap (Mortarboard) */}
      <path 
        d="M50 22L24 33L50 44L76 33L50 22Z" 
        fill="url(#logoThemeGrad)" 
      />
      <path 
        d="M32 36V45C32 45 40 48 50 48C60 48 68 45 68 45V36" 
        stroke="url(#logoThemeGrad)" 
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Tassel on the right */}
      <path 
        d="M76 33V44M76 44C76 44 74 46 74 48M76 44C76 44 78 46 78 48" 
        stroke="url(#logoThemeGrad)" 
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Face/Head Silhouette */}
      <circle cx="50" cy="49" r="13" fill="url(#logoThemeGrad)" />
      
      {/* Gown / Body */}
      <path 
        d="M26 82C26 70 34 62 50 62C66 62 74 70 74 82V88H26V82Z" 
        fill="url(#logoThemeGrad)" 
      />
      
      {/* Collar detail ("V" neck and tie) */}
      <path 
        d="M42 62L50 74L58 62" 
        fill="#020617" 
      />
      <path 
        d="M50 74V82" 
        stroke="url(#logoThemeGrad)" 
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* The two sparkles/stars from the image */}
      <path d="M22 47L24.5 44L22 41L19.5 44L22 47Z" fill="url(#logoThemeGrad)" />
      <path d="M78 47L80.5 44L78 41L75.5 44L78 47Z" fill="url(#logoThemeGrad)" />
    </svg>
  );
};

export default Logo;