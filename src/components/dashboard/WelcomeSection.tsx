import { Card } from "@/components/ui/card";
import { Activity, FileText, Briefcase } from "lucide-react";

const metrics = [
  {
    label: "Active Projects",
    value: "3",
    icon: Activity,
    color: "text-green-500",
  },
  {
    label: "Pending Proposals",
    value: "5",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    label: "New Opportunities",
    value: "12",
    icon: Briefcase,
    color: "text-purple-500",
  },
];

export function WelcomeSection() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-nino-text">Welcome Back, Sarah</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-nino-gray">{metric.label}</p>
                <p className="text-2xl font-semibold mt-1 text-nino-text">
                  {metric.value}
                </p>
              </div>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}