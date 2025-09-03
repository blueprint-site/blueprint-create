import React, { useEffect, useRef, useState } from 'react';
/**
 * BlueprintCard component renders a card with a blueprint-style background,
 * grid lines, and cross highlights. It supports different sizes (small, medium, large)
 * and allows for custom content to be placed inside.
 *
 * @param {Object} props - Component properties
 * @param {string} [props.size='small'] - Size of the card ('small', 'medium', 'large')
 * @param {string} [props.className] - Additional class names for styling
 * @param {React.ReactNode} [props.children] - Content to be displayed inside the card
 * @returns {JSX.Element} Rendered BlueprintCard component
 */

interface BlueprintCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large'; // Size of the card
  className?: string; // Additional class names for styling
  children?: React.ReactNode; // Content to be displayed inside the card
}

const BlueprintCard = React.forwardRef<HTMLDivElement, BlueprintCardProps>(
  ({ size = 'small', className, children, ...props }, _ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [currentWidth, setCurrentWidth] = useState(128);

    useEffect(() => {
      const element = cardRef.current;
      if (!element) return;
      const observer = new ResizeObserver((entries) => {
        if (entries[0] && entries[0].contentRect.width > 0) {
          setCurrentWidth(entries[0].contentRect.width);
        }
      });
      observer.observe(element);
      if (element.offsetWidth > 0) {
        setCurrentWidth(element.offsetWidth);
      }
      return () => observer.disconnect();
    }, []);

    const gridStroke = 'rgba(200, 215, 245, 0.2)'; // Default grid line stroke color
    const crossStroke = 'rgba(220, 235, 255, 0.5)'; // Default cross stroke color

    const sizeConfig = {
      small: {
        baseScaleDivisor: 16,
        cols: 1,
        svgCrossArmLengthFactor: '0',
      },
      medium: {
        baseScaleDivisor: 32,
        cols: 2,
        svgCrossArmLengthFactor: '7.2',
      },
      large: {
        baseScaleDivisor: 48,
        cols: 3,
        svgCrossArmLengthFactor: '4.5',
      },
    };

    const currentSizeConfig = sizeConfig[size];
    const colCount = currentSizeConfig.cols;
    const dynamicGridUnitPx =
      currentWidth > 0 ? currentWidth / currentSizeConfig.baseScaleDivisor : 128 / 16;

    const checkerBlueLight = '%237c9dfb';
    const checkerBlueDark = '%237594f0';
    const checkerPatternSvg = `data:image/svg+xml,%3Csvg width='2' height='2' xmlns='http://www.w3.org/2000/svg' shape-rendering='crispEdges'%3E%3Crect x='0' y='0' width='1' height='1' fill='${checkerBlueLight}'/%3E%3Crect x='1' y='0' width='1' height='1' fill='${checkerBlueDark}'/%3E%3Crect x='0' y='1' width='1' height='1' fill='${checkerBlueDark}'/%3E%3Crect x='1' y='1' width='1' height='1' fill='${checkerBlueLight}'/%3E%3C/svg%3E`;

    const dynamicCheckeredBgStyle = {
      backgroundImage: `url("${checkerPatternSvg}")`,
      backgroundSize: `${dynamicGridUnitPx * 2}px ${dynamicGridUnitPx * 2}px`,
      imageRendering: 'pixelated' as const,
    };

    return (
      <div
        ref={cardRef}
        className={`relative aspect-square bg-[#94b3ff] ${className}`}
        style={{
          padding: `${dynamicGridUnitPx}px`,
        }}
        {...props}
      >
        <div
          className='h-full border border-[#eafdff] opacity-90'
          style={{
            borderWidth: `${dynamicGridUnitPx}px`,
          }}
        >
          <div
            className='edge-highlight absolute right-0 bottom-0 left-0 z-10 bg-[#7092f2]'
            style={{ height: `${dynamicGridUnitPx}px` }}
          />
          <div
            className='edge-highlight absolute top-0 right-0 bottom-0 z-10 bg-[#7092f2]'
            style={{ width: `${dynamicGridUnitPx}px` }}
          />
          <div
            className='blueprint-inner-content relative h-full w-full'
            style={dynamicCheckeredBgStyle} // Checkered pattern only here now
          >
            {/* SVG Overlay for Grid Lines and '+' Highlights */}
            {(size === 'medium' || size === 'large') && currentWidth > 0 && (
              <svg
                width='100%'
                height='100%'
                xmlns='http://www.w3.org/2000/svg'
                className='pointer-events-none absolute inset-0 z-[5]' // zIndex relative to blueprint-inner-content
              >
                {Array.from({ length: colCount - 1 }).map((_, i) => {
                  const posPercent = `${((i + 1) / colCount) * 100}%`;
                  return (
                    <React.Fragment key={`gridline-set-${i}`}>
                      <line
                        x1={posPercent}
                        y1='0'
                        x2={posPercent}
                        y2='100%'
                        stroke={gridStroke}
                        strokeWidth={dynamicGridUnitPx / 2}
                      />
                      <line
                        y1={posPercent}
                        x1='0'
                        y2={posPercent}
                        x2='100%'
                        stroke={gridStroke}
                        strokeWidth={dynamicGridUnitPx / 2}
                      />
                    </React.Fragment>
                  );
                })}
                {Array.from({ length: colCount - 1 }).flatMap((_, r) =>
                  Array.from({ length: colCount - 1 }).map((_, c) => {
                    const centerXPercent = ((c + 1) / colCount) * 100;
                    const centerYPercent = ((r + 1) / colCount) * 100;
                    return (
                      <g key={`cross-${r}-${c}`}>
                        <line
                          x1={`${centerXPercent - dynamicGridUnitPx / 2}%`}
                          y1={`${centerYPercent}%`}
                          x2={`${centerXPercent + dynamicGridUnitPx / 2}%`}
                          y2={`${centerYPercent}%`}
                          stroke={crossStroke}
                          strokeWidth={dynamicGridUnitPx / 2}
                        />
                        <line
                          x1={`${centerXPercent}%`}
                          y1={`${centerYPercent - dynamicGridUnitPx / 2}%`}
                          x2={`${centerXPercent}%`}
                          y2={`${centerYPercent + dynamicGridUnitPx / 2}%`}
                          stroke={crossStroke}
                          strokeWidth={dynamicGridUnitPx / 2}
                        />
                      </g>
                    );
                  })
                )}
              </svg>
            )}
            {/* Content Slot */}
            <div className='z-10 p-2'>{children}</div>
          </div>
        </div>
      </div>
    );
  }
);
BlueprintCard.displayName = 'BlueprintCard';

export default BlueprintCard;
