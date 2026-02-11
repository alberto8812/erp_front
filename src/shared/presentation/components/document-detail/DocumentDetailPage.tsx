"use client";

import { DocumentActionBar } from "./DocumentActionBar";
import { DocumentInfoPanel } from "./DocumentInfoPanel";
import { DocumentTimeline } from "./DocumentTimeline";
import { DocumentLinesTable } from "./DocumentLinesTable";
import { DocumentSummaryCard } from "./DocumentSummaryCard";
import type {
  DocumentAction,
  DocumentStatusStep,
  DocumentTimelineEvent,
  DocumentInfoSection,
  DocumentLineColumn,
} from "./types";

interface DocumentDetailPageProps<T extends object> {
  // Header
  title: string;
  subtitle?: string;
  documentNumber?: string;
  backUrl: string;
  status?: {
    label: string;
    color: string;
  };

  // Actions
  primaryActions?: DocumentAction[];
  secondaryActions?: DocumentAction[];
  editUrl?: string;
  canEdit?: boolean;

  // Info sections
  infoSections: DocumentInfoSection[];

  // Timeline
  statusSteps?: DocumentStatusStep[];
  timelineEvents?: DocumentTimelineEvent[];
  showTimeline?: boolean;

  // Lines table
  lines?: T[];
  lineColumns?: DocumentLineColumn<T>[];
  linesTitle?: string;
  showLines?: boolean;

  // Summary
  summaryItems?: {
    label: string;
    value: number;
    type?: "currency" | "number" | "percent";
    highlight?: boolean;
    negative?: boolean;
  }[];
  totalLabel?: string;
  totalValue?: number;
  currency?: string;
  summaryFooter?: string;
  showSummary?: boolean;

  // Additional content
  children?: React.ReactNode;
}

export function DocumentDetailPage<T extends object>({
  title,
  subtitle,
  documentNumber,
  backUrl,
  status,
  primaryActions,
  secondaryActions,
  editUrl,
  canEdit,
  infoSections,
  statusSteps,
  timelineEvents,
  showTimeline = true,
  lines,
  lineColumns,
  linesTitle,
  showLines = true,
  summaryItems,
  totalLabel,
  totalValue,
  currency = "COP",
  summaryFooter,
  showSummary = true,
  children,
}: DocumentDetailPageProps<T>) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Action Bar */}
      <DocumentActionBar
        title={title}
        subtitle={subtitle}
        documentNumber={documentNumber}
        backUrl={backUrl}
        status={status}
        primaryActions={primaryActions}
        secondaryActions={secondaryActions}
        editUrl={editUrl}
        canEdit={canEdit}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Info Sections */}
            <div className="lg:col-span-8 space-y-4">
              <DocumentInfoPanel sections={infoSections} />
            </div>

            {/* Right Column: Summary + Timeline */}
            <div className="lg:col-span-4 space-y-4">
              {/* Summary Card */}
              {showSummary && summaryItems && summaryItems.length > 0 && (
                <div className="sticky top-24">
                  <DocumentSummaryCard
                    items={summaryItems}
                    totalLabel={totalLabel}
                    totalValue={totalValue}
                    currency={currency}
                    footerText={summaryFooter}
                  />
                </div>
              )}

              {/* Timeline */}
              {showTimeline && (statusSteps || timelineEvents) && (
                <DocumentTimeline
                  steps={statusSteps}
                  events={timelineEvents}
                />
              )}
            </div>
          </div>

          {/* Lines Table */}
          {showLines && lines && lineColumns && (
            <DocumentLinesTable
              lines={lines}
              columns={lineColumns}
              title={linesTitle}
            />
          )}

          {/* Additional Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
