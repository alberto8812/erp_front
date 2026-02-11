import { Filter, Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";

interface Action {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface PageHeaderProps {
  pageHeader: {
    filters?: Action[];
    import?: Action[];
  };
}
export const PageHeader = ({ pageHeader }: PageHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {pageHeader.filters?.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              size="sm"
              onClick={action.onClick}
            >
              {action.icon}
              {action.title}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {pageHeader.import?.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              size="sm"
              onClick={action.onClick}
            >
              {action.icon}
              {action.title}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};
