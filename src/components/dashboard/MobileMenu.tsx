import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Sidebar from "./BrandSidebar";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuProps) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isMobileMenuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.3
            }}
            className="fixed inset-y-0 left-0 z-40 w-[280px] p-4"
          >
            <Sidebar />
          </motion.div>
        </>
      )}
    </>
  );
};

export default MobileMenu;