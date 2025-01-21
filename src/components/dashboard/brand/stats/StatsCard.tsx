import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  className?: string;
}

const StatsCard = ({ icon: Icon, title, value, className }: StatsCardProps) => {
  return (
    <Card className={cn(
      "bg-white shadow-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
      className
    )}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-nino-primary" />
          </div>
          <div>
            <h3 className="text-base md:text-lg text-nino-text font-medium mb-0.5 md:mb-1">
              {title}
            </h3>
            <p className="text-2xl md:text-4xl font-semibold text-nino-text">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;