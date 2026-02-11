"use client";

import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type {
  FormConfig,
  FormFieldConfig,
} from "../../types/form-config.types";
import { buildZodSchema } from "../../validators/build-zod-schema";
import { Autocomplete } from "../autocomplete/Autocomplete";

interface DynamicFormBuilderProps {
  config: FormConfig;
  defaultValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
  formId?: string;
}

function FieldRenderer({
  fieldConfig,
  control,
  isLoading,
  defaultValues,
}: {
  fieldConfig: FormFieldConfig;
  control: Control<FieldValues>;
  isLoading?: boolean;
  defaultValues?: Record<string, unknown>;
}) {
  // Calculate initialDisplayValue for autocomplete fields
  const getInitialDisplayValue = () => {
    if (
      fieldConfig.type !== "autocomplete" ||
      !fieldConfig.autocompleteConfig
    ) {
      return undefined;
    }
    // Use explicit initialDisplayValue if provided
    if (fieldConfig.autocompleteConfig.initialDisplayValue) {
      return fieldConfig.autocompleteConfig.initialDisplayValue;
    }
    // Use initialDisplayValueField to get value from defaultValues
    if (
      fieldConfig.autocompleteConfig.initialDisplayValueField &&
      defaultValues
    ) {
      const fieldValue =
        defaultValues[fieldConfig.autocompleteConfig.initialDisplayValueField];
      return typeof fieldValue === "string" ? fieldValue : undefined;
    }
    return undefined;
  };

  return (
    <FormField
      key={fieldConfig.name}
      control={control}
      name={fieldConfig.name}
      render={({ field }) => (
        <FormItem
          className={
            fieldConfig.gridCols === 2
              ? "col-span-2"
              : "col-span-2 sm:col-span-1"
          }
        >
          {fieldConfig.type !== "boolean" && (
            <FormLabel>{fieldConfig.label}</FormLabel>
          )}
          <FormControl>
            {fieldConfig.type === "text" ||
            fieldConfig.type === "date" ||
            fieldConfig.type === "uuid" ? (
              <Input
                placeholder={fieldConfig.placeholder ?? ""}
                type={fieldConfig.type === "date" ? "date" : "text"}
                disabled={isLoading}
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "number" ? (
              <Input
                type="number"
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                value={(field.value as number) ?? ""}
              />
            ) : fieldConfig.type === "textarea" ? (
              <Textarea
                placeholder={fieldConfig.placeholder ?? ""}
                disabled={isLoading}
                {...field}
                value={(field.value as string) ?? ""}
              />
            ) : fieldConfig.type === "select" ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      fieldConfig.placeholder ??
                      `Seleccione ${fieldConfig.label.toLowerCase()}`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {fieldConfig.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : fieldConfig.type === "autocomplete" &&
              fieldConfig.autocompleteConfig ? (
              <Autocomplete
                searchAction={fieldConfig.autocompleteConfig.searchAction}
                returnMode={fieldConfig.autocompleteConfig.returnMode}
                value={field.value as string}
                onChange={field.onChange}
                onSelect={fieldConfig.autocompleteConfig.onSelect}
                placeholder={
                  fieldConfig.autocompleteConfig.placeholder ??
                  fieldConfig.placeholder
                }
                disabled={isLoading}
                minChars={fieldConfig.autocompleteConfig.minChars}
                debounceMs={fieldConfig.autocompleteConfig.debounceMs}
                initialDisplayValue={getInitialDisplayValue()}
                queryKeyPrefix={fieldConfig.name}
              />
            ) : fieldConfig.type === "boolean" ? (
              <div className="flex items-center gap-2 pt-0.5">
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  {fieldConfig.label}
                </span>
              </div>
            ) : (
              <Input
                disabled={isLoading}
                {...field}
                value={(field.value as string) ?? ""}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BooleanFieldRenderer({
  fieldConfig,
  control,
  isLoading,
}: {
  fieldConfig: FormFieldConfig;
  control: Control<FieldValues>;
  isLoading?: boolean;
}) {
  return (
    <FormField
      key={fieldConfig.name}
      control={control}
      name={fieldConfig.name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2.5 space-y-0">
          <FormControl>
            <Switch
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">
            {fieldConfig.label}
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Helper to clean empty strings from form data
function cleanFormData(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    // Skip empty strings - they become undefined (not sent)
    if (value === "" || value === null) {
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

export function DynamicFormBuilder({
  config,
  defaultValues,
  onSubmit,
  isLoading,
  formId = "crud-form",
}: DynamicFormBuilderProps) {
  const allFields = config.sections
    ? config.sections.flatMap((s) => s.fields)
    : config.fields;

  const schema = buildZodSchema(allFields);

  const computedDefaults: Record<string, unknown> = {};
  for (const field of allFields) {
    computedDefaults[field.name] =
      defaultValues?.[field.name] ??
      field.defaultValue ??
      (field.type === "boolean" ? false : "");
  }

  const { watch, ...form } = useForm({
    resolver: zodResolver(schema),
    defaultValues: computedDefaults,
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    onSubmit(cleanFormData(data));
  };

  // Sectioned layout
  if (config.sections) {
    return (
      <Form {...form} watch={watch}>
        <form
          id={formId}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-0"
        >
          {config.sections.map((section, sIdx) => {
            const regularFields = section.fields.filter(
              (f) => !f.hidden && f.type !== "boolean",
            );
            const booleanFields = section.fields.filter(
              (f) => !f.hidden && f.type === "boolean",
            );

            return (
              <div key={section.title}>
                {sIdx > 0 && <div className="border-t" />}
                <div className="px-6 py-5">
                  <div className="mb-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {section.title}
                    </p>
                    {section.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground/70">
                        {section.description}
                      </p>
                    )}
                  </div>
                  {regularFields.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {regularFields.map((fieldConfig) => (
                        <FieldRenderer
                          key={fieldConfig.name}
                          fieldConfig={fieldConfig}
                          control={form.control}
                          isLoading={isLoading}
                          defaultValues={defaultValues}
                        />
                      ))}
                    </div>
                  )}
                  {booleanFields.length > 0 && (
                    <div
                      className={`flex flex-wrap items-center gap-5 ${regularFields.length > 0 ? "mt-4 pt-4 border-t border-dashed" : ""}`}
                    >
                      {booleanFields.map((fieldConfig) => (
                        <BooleanFieldRenderer
                          key={fieldConfig.name}
                          fieldConfig={fieldConfig}
                          control={form.control}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </form>
      </Form>
    );
  }

  // Flat layout — separate booleans to a clean row at the bottom
  const visibleFields = config.fields.filter((f) => !f.hidden);
  const regularFields = visibleFields.filter((f) => f.type !== "boolean");
  const booleanFields = visibleFields.filter((f) => f.type === "boolean");

  return (
    <Form {...form} watch={watch}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="px-6 py-5"
      >
        {regularFields.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {regularFields.map((fieldConfig) => (
              <FieldRenderer
                key={fieldConfig.name}
                fieldConfig={fieldConfig}
                control={form.control}
                isLoading={isLoading}
                defaultValues={defaultValues}
              />
            ))}
          </div>
        )}
        {booleanFields.length > 0 && (
          <div
            className={`flex flex-wrap items-center gap-5 ${regularFields.length > 0 ? "mt-4 pt-4 border-t border-dashed" : ""}`}
          >
            {booleanFields.map((fieldConfig) => (
              <BooleanFieldRenderer
                key={fieldConfig.name}
                fieldConfig={fieldConfig}
                control={form.control}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </form>
    </Form>
  );
}
