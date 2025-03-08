interface HeroSectionProps {
  children?: React.ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return <div className='h-64 overflow-hidden'>{children}</div>;
}
