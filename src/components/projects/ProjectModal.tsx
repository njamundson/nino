import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectDetails from "./modal/ProjectDetails";
import BrandInfo from "./modal/BrandInfo";
import ApplicationForm from "./modal/ApplicationForm";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    perks: string[] | null;
    requirements: string[] | null;
    payment_details: string | null;
    compensation_details: string | null;
    deliverables: string[] | null;
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
      description: string;
      website: string;
      instagram: string;
    };
  };
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="brand">About the Brand</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <ProjectDetails opportunity={opportunity} />
          </TabsContent>
          <TabsContent value="brand">
            <BrandInfo brand={opportunity.brand} />
          </TabsContent>
          <TabsContent value="apply">
            <ApplicationForm opportunityId={opportunity.id} onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;