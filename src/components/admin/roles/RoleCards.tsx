
import React from "react";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { USER_ROLES, ROLE_DESCRIPTIONS, UserRole } from "../RoleTypes";

const RoleCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {Object.entries(USER_ROLES).map(([role, label]) => (
        <Card key={role}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Badge 
                variant={
                  role === "owner" ? "destructive" : 
                  role === "admin" ? "default" : 
                  role === "moderator" ? "secondary" : 
                  "outline"
                }
                className="px-2 py-1"
              >
                {label}
              </Badge>
              <Shield className={`h-5 w-5 ${
                role === "owner" ? "text-destructive" : 
                role === "admin" ? "text-primary" : 
                role === "moderator" ? "text-secondary" : 
                "text-muted-foreground"
              }`} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {ROLE_DESCRIPTIONS[role as UserRole]}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoleCards;
