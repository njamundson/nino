import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const BrandSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      <div className={cn(
        "fixed inset-0 z-40 bg-black/50 md:hidden",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsOpen(false)} />
      
      <Sidebar className={cn(
        "fixed top-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </Sidebar>
    </>
  );
};

export default BrandSidebar;