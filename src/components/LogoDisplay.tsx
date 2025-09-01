"use client";

import Image from "next/image";

interface LogoDisplayProps {
  size?: number;
  showBoth?: boolean;
  className?: string;
}

export default function LogoDisplay({ size = 70, showBoth = true, className = "" }: LogoDisplayProps) {
  if (showBoth) {
    return (
      <div className={`flex justify-between items-center ${className}`}>
        <div className="relative animate-float">
          <Image
            src="/cartons.png"
            alt="Cartons d'arbitre"
            width={size}
            height={size}
            className="drop-shadow-lg"
            priority
          />
        </div>
        <div className="relative animate-float" style={{animationDelay: '0.5s'}}>
          <Image
            src="/ftf-logo.png"
            alt="Fédération Tunisienne de Football"
            width={size}
            height={size}
            className="drop-shadow-lg"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative animate-float ${className}`}>
      <Image
        src="/ftf-logo.png"
        alt="Fédération Tunisienne de Football"
        width={size}
        height={size}
        className="drop-shadow-lg"
        priority
      />
    </div>
  );
}












