import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";

interface Props {
  cardTitle: string;
  CardSubtitle: string;
  children: React.ReactNode;
}
export const CardPagesComponent = ({
  cardTitle,
  CardSubtitle,
  children,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{CardSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 justify-end w-full">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
        <div className="mt-2 rounded-md border">{children}</div>
      </CardContent>
    </Card>
  );
};
