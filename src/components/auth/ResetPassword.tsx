import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPassword = ({ isOpen, onClose }: ResetPasswordProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - will be replaced with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Reset link sent!",
      description: "Please check your email for password reset instructions.",
    });
    
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-nino-text">Reset password</DialogTitle>
          <DialogDescription className="text-nino-gray text-sm">
            Enter your email address and we'll send you instructions to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Email address"
            className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 transition-all duration-300"
            required
          />
          <Button
            type="submit"
            className="w-full bg-nino-primary hover:opacity-90 text-white transition-all duration-300 rounded-xl h-12 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </motion.div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;