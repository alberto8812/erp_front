import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";

export const UserProfileChatBot = () => {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
            CV
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-sidebar-foreground">
          Carlos Velasco Saavedra
        </span>
      </div>
      <p className="text-xs text-sidebar-foreground/60 mt-1">Gratis</p>
    </div>
  );
};
