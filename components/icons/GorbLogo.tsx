import React from 'react';

export const GorbLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer star points */}
        <path
          d="M50 5 L60 35 L90 35 L68 55 L78 85 L50 65 L22 85 L32 55 L10 35 L40 35 Z"
          fill="url(#starGradient)"
          stroke="#000"
          strokeWidth="2"
        />
        
        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="25"
          fill="url(#circleGradient)"
          stroke="url(#glowGradient)"
          strokeWidth="2"
        />
        
        {/* Gorb face */}
        <ellipse cx="50" cy="45" rx="20" ry="18" fill="url(#faceGradient)" />
        
        {/* Eyes */}
        <circle cx="43" cy="42" r="3" fill="#000" />
        <circle cx="57" cy="42" r="3" fill="#000" />
        <circle cx="43.5" cy="41.5" r="1" fill="#fff" />
        <circle cx="57.5" cy="41.5" r="1" fill="#fff" />
        
        {/* Mouth */}
        <path d="M42 50 Q50 55 58 50" stroke="#000" strokeWidth="1.5" fill="none" />
        
        {/* Fur texture */}
        <path d="M35 35 Q40 30 45 35" stroke="#1a8f3a" strokeWidth="1" fill="none" />
        <path d="M55 35 Q60 30 65 35" stroke="#1a8f3a" strokeWidth="1" fill="none" />
        <path d="M40 55 Q45 60 50 55" stroke="#1a8f3a" strokeWidth="1" fill="none" />
        <path d="M50 55 Q55 60 60 55" stroke="#1a8f3a" strokeWidth="1" fill="none" />
        
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7A3EE4" />
            <stop offset="100%" stopColor="#1CF1DD" />
          </linearGradient>
          
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1CF1DD" />
            <stop offset="100%" stopColor="#24D973" />
          </linearGradient>
          
          <linearGradient id="faceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#24D973" />
            <stop offset="50%" stopColor="#2ee066" />
            <stop offset="100%" stopColor="#1a8f3a" />
          </linearGradient>
          
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1CF1DD" />
            <stop offset="100%" stopColor="#24D973" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};