import LazyImage from "@/components/LazyImage";
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface NavigationLinkProps {
  destination: string;
  icon: string;
  label: string;
  className?: string;
}

const NavigationLink = ({ destination, icon, label, className }: NavigationLinkProps) => {
  const isExternal = destination.startsWith('http');
  const baseClasses = "flex items-center text-foreground text-base h-[60px]";
  
  const linkContent = (
    <>
      <div className="w-10 h-10 flex items-center justify-center">
        <LazyImage 
          src={icon} 
          alt={label} 
          className="max-h-10 w-auto object-contain transform scale-100 transition-transform duration-500 hover:scale-105" 
        />
      </div>
      <span className="hidden sm:inline ml-2">{label}</span>
    </>
  );

  return isExternal ? (
    <a href={destination} className={twMerge(baseClasses, className)}>
      {linkContent}
    </a>
  ) : (
    <NavLink to={destination} className={twMerge(baseClasses, className)}>
      {linkContent}
    </NavLink>
  );
};

export default NavigationLink;