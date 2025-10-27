'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
}

export function LazyImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  fallbackSrc = '/placeholder-image.png',
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return; // Skip observer if priority loading

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView ? (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          onError={() => setHasError(true)}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />
      ) : (
        <div
          className="w-full bg-gray-200 animate-pulse"
          style={{ paddingBottom: `${(height / width) * 100}%` }}
        />
      )}
    </div>
  );
}
