import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
    };
  };
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current creator's profile
  const { data: creator, isLoading: isLoadingCreator } = useQuery({
    queryKey: ["creator"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleApply = async () => {
    if (!creator) {
      toast({
        title: "Creator profile required",
        description: "Please complete your creator profile to apply for projects.",
        variant: "destructive",
      });
      navigate("/onboarding");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("applications")
        .insert({
          opportunity_id: opportunity.id,
          creator_id: creator.id,
          cover_letter: coverLetter,
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the brand.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCreator) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {opportunity.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Brand Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-nino-primary">
              {opportunity.brand.company_name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-nino-gray">
              {opportunity.location && (
                <span className="flex items-center gap-1">
                  📍 {opportunity.location}
                </span>
              )}
              {opportunity.brand.brand_type && (
                <Badge variant="secondary">
                  {opportunity.brand.brand_type}
                </Badge>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{opportunity.description}</p>
            </div>

            {/* Dates */}
            {(opportunity.start_date || opportunity.end_date) && (
              <div className="space-y-2">
                <h4 className="font-medium">Project Timeline</h4>
                <div className="flex gap-4 text-sm">
                  {opportunity.start_date && (
                    <div>
                      <span className="text-nino-gray">Start Date:</span>{" "}
                      {formatDate(opportunity.start_date)}
                    </div>
                  )}
                  {opportunity.end_date && (
                    <div>
                      <span className="text-nino-gray">End Date:</span>{" "}
                      {formatDate(opportunity.end_date)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {opportunity.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {opportunity.perks && opportunity.perks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Perks</h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.perks.map((perk, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
                    >
                      {perk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Application Form */}
            {isApplying ? (
              <div className="space-y-4 pt-4">
                <h4 className="font-medium">Your Application</h4>
                <Textarea
                  placeholder="Write a cover letter explaining why you're a great fit for this opportunity..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsApplying(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!coverLetter.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4">
                <Button
                  className="w-full"
                  onClick={() => setIsApplying(true)}
                >
                  Apply for this Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;