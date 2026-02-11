// Types for the Document Detail components

export interface DocumentAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  onClick: (input?: string) => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  confirmationInputLabel?: string;
  confirmationInputPlaceholder?: string;
  requiresInput?: boolean;
}

export interface DocumentStatusStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending" | "error";
  date?: string;
  user?: string;
  note?: string;
}

export interface DocumentTimelineEvent {
  id: string;
  type: "status_change" | "action" | "note" | "creation";
  title: string;
  description?: string;
  date: string;
  user?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: "default" | "primary" | "success" | "warning" | "destructive";
}

// Helper type for creating timeline events with optional date
export type PartialTimelineEvent = Omit<DocumentTimelineEvent, "date"> & {
  date?: string;
};

export interface DocumentInfoSection {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  fields: DocumentInfoField[];
}

export interface BadgeValue {
  label: string;
  color: string;
}

export interface LinkValue {
  label: string;
  href: string;
}

export type DocumentFieldValue =
  | string
  | number
  | null
  | undefined
  | BadgeValue
  | LinkValue
  | React.ReactNode;

export interface DocumentInfoField {
  label: string;
  value: DocumentFieldValue;
  type?: "text" | "currency" | "date" | "badge" | "link" | "custom" | "number";
  colSpan?: 1 | 2;
  emptyText?: string;
}

export interface DocumentLineColumn<T extends object> {
  key: keyof T | string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DocumentDetailConfig {
  title: string;
  subtitle?: string;
  backUrl: string;
  documentNumber?: string;
  status?: {
    label: string;
    color: string;
  };
}
