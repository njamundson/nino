import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    id: 1,
    client: "Luxury Resort & Spa",
    deadline: "Mar 25, 2024",
    status: "In Progress",
  },
  {
    id: 2,
    client: "Boutique Hotel Chain",
    deadline: "Mar 30, 2024",
    status: "Review",
  },
  {
    id: 3,
    client: "Beach Resort",
    deadline: "Apr 5, 2024",
    status: "Starting Soon",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "bg-blue-500/10 text-blue-500";
    case "Review":
      return "bg-yellow-500/10 text-yellow-500";
    case "Starting Soon":
      return "bg-green-500/10 text-green-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

export function ActiveProjects() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-nino-bg transition-colors"
          >
            <div className="space-y-1">
              <p className="font-medium text-sm">{project.client}</p>
              <p className="text-xs text-nino-gray">Due {project.deadline}</p>
            </div>
            <Badge className={`${getStatusColor(project.status)}`} variant="outline">
              {project.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}