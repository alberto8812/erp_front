"use server";

import { apiImport } from "@/lib/api-upload";

export interface FieldInfo {
  name: string;
  key: string;
  type: string;
  required: boolean;
  enumValues?: string[];
  maxLength?: number;
  example?: string;
}

export interface ImportFieldsConfig {
  moduleKey: string;
  displayName: string;
  fields: FieldInfo[];
}

export async function getImportFields(
  moduleKey: string,
  rute = "api/import",
): Promise<ImportFieldsConfig> {
  return apiImport<ImportFieldsConfig>(`/${rute}/${moduleKey}/fields`);
}
