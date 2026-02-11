import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const SidebarHeaderChatBot = () => {
  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          ChatBot
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button className="w-full justify-start bg-sidebar-primary hover:bg-sidebar-primary/80 text-sidebar-primary-foreground">
        <Plus className="h-4 w-4 mr-2" />
        Nuevo chat
      </Button>
    </div>
  );
};
