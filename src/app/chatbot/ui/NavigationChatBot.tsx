import { Button } from "@/components/ui/button";
import { Library, MessageCircle, Search, Sparkles } from "lucide-react";
import React from "react";

export const NavigationChatBot = () => {
  return (
    <div className="p-4 space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <Search className="h-4 w-4 mr-2" />
        Documentacion
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <Library className="h-4 w-4 mr-2" />
        Base de datos
      </Button>
    </div>
  );
};
