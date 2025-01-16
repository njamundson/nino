import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export function EarningsOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Earnings Overview</CardTitle>
        <Button variant="outline" size="sm">
          View History
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-nino-primary/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-nino-primary" />
          </div>
          <div>
            <p className="text-sm text-nino-gray">Total Earnings This Month</p>
            <p className="text-2xl font-semibold text-nino-text">$4,550.00</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}