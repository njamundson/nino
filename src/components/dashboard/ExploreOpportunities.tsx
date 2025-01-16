import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Video, User, Sparkles } from "lucide-react";

const opportunities = [
  {
    id: 1,
    type: "Photography",
    icon: Camera,
    client: "Sunset Beach Resort",
    budget: "$1,000 - $1,500",
    location: "Maldives",
  },
  {
    id: 2,
    type: "Videography",
    icon: Video,
    client: "Mountain Lodge",
    budget: "$2,000 - $2,500",
    location: "Switzerland",
  },
  {
    id: 3,
    type: "UGC",
    icon: Sparkles,
    client: "City Boutique Hotel",
    budget: "$800 - $1,200",
    location: "New York",
  },
  {
    id: 4,
    type: "Modeling",
    icon: User,
    client: "Coastal Resort",
    budget: "$1,500 - $2,000",
    location: "Bali",
  },
];

export function ExploreOpportunities() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Explore Opportunities</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="px-2 py-1">
                    <opportunity.icon className="h-3 w-3 mr-1" />
                    {opportunity.type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">{opportunity.client}</h3>
                  <p className="text-sm text-nino-gray">{opportunity.budget}</p>
                  <p className="text-xs text-nino-gray">{opportunity.location}</p>
                </div>
                <Button className="w-full" variant="outline" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}