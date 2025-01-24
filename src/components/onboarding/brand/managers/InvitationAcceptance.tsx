import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Define explicit interfaces to prevent deep type recursion
interface Brand {
  id: string;
  company_name: string;
  user_id: string;
}

interface BrandManager {
  id: string;
  brand_id: string;
  user_id: string;
  role: string;
  invitation_status: string;
  name: string | null;
  email: string | null;
}

interface BrandInvitation {
  brand: Brand;
  manager: BrandManager;
}

const InvitationAcceptance = () => {
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<BrandInvitation | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/signin");
          return;
        }

        const { data: managerData, error: managerError } = await supabase
          .from("brand_managers")
          .select(`
            id,
            brand_id,
            user_id,
            role,
            invitation_status,
            name,
            email,
            brands:brand_id (
              id,
              company_name,
              user_id
            )
          `)
          .eq("user_id", user.id)
          .eq("invitation_status", "pending")
          .single();

        if (managerError) {
          console.error("Error loading invitation:", managerError);
          toast({
            title: "Error",
            description: "Failed to load invitation details",
            variant: "destructive",
          });
          return;
        }

        if (managerData) {
          setInvitation({
            brand: managerData.brands,
            manager: {
              id: managerData.id,
              brand_id: managerData.brand_id,
              user_id: managerData.user_id,
              role: managerData.role,
              invitation_status: managerData.invitation_status,
              name: managerData.name,
              email: managerData.email,
            }
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [navigate, toast]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("brand_managers")
        .update({ invitation_status: "accepted" })
        .eq("id", invitation.manager.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation accepted successfully",
      });
      navigate("/brand/dashboard");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">No Pending Invitation</h2>
          <p className="text-nino-gray mb-4">
            There are no pending invitations for your account.
          </p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Brand Invitation</h2>
        <p className="mb-6">
          You have been invited to join{" "}
          <span className="font-semibold">{invitation.brand.company_name}</span> as
          a brand manager.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleAcceptInvitation}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept Invitation"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            disabled={loading}
            className="w-full"
          >
            Decline
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InvitationAcceptance;