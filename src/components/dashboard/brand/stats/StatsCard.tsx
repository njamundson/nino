import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  onClick?: () => void;
}

const StatsCard = ({ icon: Icon, title, value, onClick }: StatsCardProps) => {
  const cardClasses = "bg-white shadow-sm rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]";

  return (
    <Card className={cardClasses} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-nino-primary" />
          </div>
          <div>
            <h3 className="text-lg text-nino-text font-medium mb-1">
              {title}
            </h3>
            <p className="text-4xl font-semibold text-nino-text">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;