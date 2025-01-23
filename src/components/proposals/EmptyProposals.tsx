import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

const EmptyProposals = () => {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="rounded-full bg-nino-primary/10 p-4">
          <FileText className="h-8 w-8 text-nino-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">No proposals yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            When you apply to opportunities, your proposals will appear here. Start exploring available projects to find your next collaboration!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EmptyProposals;