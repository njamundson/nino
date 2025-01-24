import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BrandManager {
  id: string;
  brand_id: string;
  role: string;
  invitation_status: string;
  brands: {
    company_name: string;
  };
}

const InvitationAcceptance = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<BrandManager | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        const { data: inviteData, error: inviteError } = await supabase
          .from("brand_managers")
          .select("*, brands(company_name)")
          .eq("invitation_token", token)
          .single();

        if (inviteError || !inviteData) {
          setError("Invalid or expired invitation");
          return;
        }

        if (inviteData.invitation_status !== "pending") {
          setError("This invitation has already been used");
          return;
        }

        setInvitation(inviteData);
      } catch (err) {
        console.error("Error verifying invitation:", err);
        setError("Failed to verify invitation");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyInvitation();
    }
  }, [token]);

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        localStorage.setItem("pendingInvitation", token!);
        navigate("/");
        return;
      }

      const { error: updateError } = await supabase
        .from("brand_managers")
        .update({
          invitation_status: "accepted",
          updated_at: new Date().toISOString(),
        })
        .eq("invitation_token", token);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success!",
        description: "You have successfully accepted the invitation.",
      });

      navigate("/brand/dashboard");
    } catch (err) {
      console.error("Error accepting invitation:", err);
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full space-y-4">
          <h1 className="text-xl font-semibold text-center text-red-600">
            {error}
          </h1>
          <Button
            className="w-full"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-6 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Team Invitation</h1>
          <p className="text-nino-gray">
            You've been invited to join {invitation?.brands?.company_name} as a {invitation?.role}
          </p>
        </div>

        <Button
          className="w-full bg-nino-primary hover:bg-nino-primary/90"
          onClick={handleAcceptInvitation}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Accept Invitation
        </Button>
      </Card>
    </div>
  );
};

export default InvitationAcceptance;