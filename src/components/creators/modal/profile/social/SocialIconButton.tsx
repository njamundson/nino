import { ReactNode } from "react";

interface SocialIconButtonProps {
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  label: string;
  target?: string;
  rel?: string;
}

const SocialIconButton = ({ 
  icon, 
  href, 
  onClick,
  label,
  target,
  rel
}: SocialIconButtonProps) => {
  const buttonClasses = "p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200";

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        target={target}
        rel={rel}
        aria-label={label}
      >
        {icon}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default SocialIconButton;