import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  className?: string;
}

const StatsCard = ({ icon: Icon, title, value, className }: StatsCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)]",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-base text-nino-gray font-medium mb-1">
                {title}
              </h3>
              <p className="text-3xl font-semibold text-nino-text">
                {value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;