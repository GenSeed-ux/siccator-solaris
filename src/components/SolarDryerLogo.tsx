import React from 'react';

interface SolarDryerLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'full' | 'icon';
  className?: string;
}

export const SolarDryerLogo: React.FC<SolarDryerLogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizes = {
    sm: 40,
    md: 80,
    lg: 120,
    xl: 160,
  };
  
  const actualSize = typeof size === 'string' ? sizes[size] : size;

  return (
    <svg
      width={actualSize}
      height={actualSize}
      viewBox="0 0 200 200"
      className={`transition-transform hover:scale-105 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Siccator Solaris - Smart Solar Dryer Logo"
    >
      <defs>
        {/* Golden gradient for sun and rings */}
        <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        
        {/* Green gradient for dryer structure */}
        <linearGradient id="dryerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        
        {/* Blue gradient for solar panel */}
        <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      
      {variant === 'full' ? (
        <>
          {/* Outer circle rings */}
          <circle cx="100" cy="100" r="95" stroke="url(#sunGradient)" strokeWidth="3" fill="none" />
          <circle cx="100" cy="100" r="88" stroke="url(#sunGradient)" strokeWidth="2" fill="none" />
          <circle cx="100" cy="100" r="82" stroke="url(#sunGradient)" strokeWidth="1.5" fill="none" />
          
          {/* Sun rays (12 rays) */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = 100 + Math.cos(angle) * 60;
            const y1 = 100 + Math.sin(angle) * 60;
            const x2 = 100 + Math.cos(angle) * 75;
            const y2 = 100 + Math.sin(angle) * 75;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#sunGradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Central sun circle */}
          <circle cx="100" cy="65" r="20" fill="url(#sunGradient)" />
          
          {/* Solar dryer structure base */}
          <rect x="70" y="95" width="60" height="35" fill="url(#dryerGradient)" stroke="url(#sunGradient)" strokeWidth="2" />
          
          {/* Solar panel on top */}
          <path
            d="M 75 95 L 65 85 L 135 85 L 125 95 Z"
            fill="url(#panelGradient)"
            stroke="url(#sunGradient)"
            strokeWidth="2"
          />
          
          {/* Solar panel grid lines */}
          <line x1="100" y1="85" x2="100" y2="95" stroke="#1E40AF" strokeWidth="1" />
          <line x1="85" y1="88" x2="115" y2="88" stroke="#1E40AF" strokeWidth="1" />
          <line x1="85" y1="92" x2="115" y2="92" stroke="#1E40AF" strokeWidth="1" />
          
          {/* Wheat stalks - Left */}
          <g>
            <line x1="40" y1="130" x2="40" y2="100" stroke="url(#sunGradient)" strokeWidth="2" />
            <ellipse cx="38" cy="95" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="42" cy="95" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="38" cy="100" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="42" cy="100" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="38" cy="105" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="42" cy="105" rx="2" ry="4" fill="url(#sunGradient)" />
          </g>
          
          {/* Wheat stalks - Right */}
          <g>
            <line x1="160" y1="130" x2="160" y2="100" stroke="url(#sunGradient)" strokeWidth="2" />
            <ellipse cx="158" cy="95" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="162" cy="95" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="158" cy="100" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="162" cy="100" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="158" cy="105" rx="2" ry="4" fill="url(#sunGradient)" />
            <ellipse cx="162" cy="105" rx="2" ry="4" fill="url(#sunGradient)" />
          </g>
          
          {/* Circuit board pattern at bottom */}
          <g stroke="url(#sunGradient)" strokeWidth="2" fill="none">
            {/* Main circuit lines */}
            <line x1="45" y1="135" x2="155" y2="135" />
            <line x1="45" y1="145" x2="155" y2="145" />
            <line x1="45" y1="155" x2="155" y2="155" />
            
            {/* Circuit nodes */}
            <circle cx="55" cy="135" r="3" fill="url(#sunGradient)" />
            <circle cx="80" cy="135" r="3" fill="url(#sunGradient)" />
            <circle cx="100" cy="135" r="3" fill="url(#sunGradient)" />
            <circle cx="120" cy="135" r="3" fill="url(#sunGradient)" />
            <circle cx="145" cy="135" r="3" fill="url(#sunGradient)" />
            
            <circle cx="65" cy="145" r="3" fill="url(#sunGradient)" />
            <circle cx="90" cy="145" r="3" fill="url(#sunGradient)" />
            <circle cx="110" cy="145" r="3" fill="url(#sunGradient)" />
            <circle cx="135" cy="145" r="3" fill="url(#sunGradient)" />
            
            <circle cx="75" cy="155" r="3" fill="url(#sunGradient)" />
            <circle cx="100" cy="155" r="3" fill="url(#sunGradient)" />
            <circle cx="125" cy="155" r="3" fill="url(#sunGradient)" />
            
            {/* Vertical connections */}
            <line x1="80" y1="135" x2="75" y2="155" />
            <line x1="100" y1="135" x2="100" y2="155" />
            <line x1="120" y1="135" x2="125" y2="155" />
            <line x1="65" y1="145" x2="75" y2="155" />
            <line x1="110" y1="145" x2="100" y2="155" />
          </g>
        </>
      ) : (
        <>
          {/* Icon variant - Simplified */}
          {/* Outer circle */}
          <circle cx="100" cy="100" r="95" stroke="url(#sunGradient)" strokeWidth="4" fill="none" />
          
          {/* Simplified sun rays (8 rays) */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            const x1 = 100 + Math.cos(angle) * 65;
            const y1 = 100 + Math.sin(angle) * 65;
            const x2 = 100 + Math.cos(angle) * 85;
            const y2 = 100 + Math.sin(angle) * 85;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#sunGradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Central sun */}
          <circle cx="100" cy="70" r="25" fill="url(#sunGradient)" />
          
          {/* Simplified dryer */}
          <rect x="75" y="105" width="50" height="30" fill="url(#dryerGradient)" stroke="url(#sunGradient)" strokeWidth="2" />
          
          {/* Simplified solar panel */}
          <path
            d="M 80 105 L 70 95 L 130 95 L 120 105 Z"
            fill="url(#panelGradient)"
            stroke="url(#sunGradient)"
            strokeWidth="2"
          />
          
          {/* Simple circuit pattern */}
          <g stroke="url(#sunGradient)" strokeWidth="2">
            <line x1="60" y1="145" x2="140" y2="145" />
            <circle cx="80" cy="145" r="3" fill="url(#sunGradient)" />
            <circle cx="100" cy="145" r="3" fill="url(#sunGradient)" />
            <circle cx="120" cy="145" r="3" fill="url(#sunGradient)" />
            <line x1="80" y1="145" x2="80" y2="155" />
            <line x1="100" y1="145" x2="100" y2="155" />
            <line x1="120" y1="145" x2="120" y2="155" />
          </g>
        </>
      )}
    </svg>
  );
};

export default SolarDryerLogo;
