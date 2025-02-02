import { Card } from "@/components/ui/card";
import { Creator } from "@/types/creator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, RefreshCw, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export interface BookingCardProps {
  creator?: Creator;
  onCancel?: () => void;
  onDelete?: () => void;
  status?: string;
  booking?: any;
  onMessageClick?: () => void;
  onViewCreator?: () => void;
  onRefresh?: () => void;
}

export const BookingCard = ({
  creator,
  onCancel,
  onDelete,
  status = "pending",
  booking,
  onMessageClick,
  onViewCreator,
  onRefresh
}: BookingCardProps) => {
  const { toast } = useToast();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      toast({
        title: "Booking cancelled",
        description: "The brand has been notified of this cancellation.",
      });
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }}
    >
      <Card className="p-6 bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-gray-200 transition-all duration-200">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {creator?.profileImage ? (
                <motion.img
                  src={creator.profileImage}
                  alt={creator?.display_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              ) : (
                <motion.div 
                  className="w-12 h-12 rounded-full bg-nino-primary/10 flex items-center justify-center ring-2 ring-white"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-lg font-medium text-nino-primary">
                    {creator?.display_name?.[0]?.toUpperCase() || 'C'}
                  </span>
                </motion.div>
              )}
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">
                  {creator?.display_name || "Unknown Creator"}
                </h3>
                <Badge 
                  variant="secondary" 
                  className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
                >
                  {status}
                </Badge>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {onRefresh && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRefresh}
                    className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
              {onMessageClick && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMessageClick}
                    className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
              {onViewCreator && (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onViewCreator}
                    className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
              {onCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this booking? This action cannot be undone and the brand will be notified.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Yes, cancel booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </motion.div>
          </div>

          {booking?.details && (
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p>{booking.details}</p>
            </motion.div>
          )}

          {onDelete && (
            <motion.div 
              className="flex justify-end gap-2 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                onClick={onDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default BookingCard;