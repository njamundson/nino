import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const LoadingSpinner = ({ className, size = "md" }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin text-nino-primary ${sizeClasses[size]} ${className}`} />
    </div>
  );
};