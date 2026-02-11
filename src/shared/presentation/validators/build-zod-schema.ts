import { z } from "zod";
import type { FormFieldConfig } from "../types/form-config.types";

export function buildZodSchema(fields: FormFieldConfig[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea': {
        let s = z.string();
        if (field.required) {
          s = s.min(1, `${field.label} es requerido`);
        }
        if (field.maxLength) {
          s = s.max(field.maxLength, `${field.label} no puede exceder ${field.maxLength} caracteres`);
        }
        if (field.pattern) {
          s = s.regex(new RegExp(field.pattern.regex), field.pattern.message);
        }
        schema = field.required ? s : s.optional().or(z.literal(''));
        break;
      }
      case 'number': {
        let n = z.coerce.number();
        if (field.min !== undefined) {
          n = n.min(field.min, `${field.label} debe ser al menos ${field.min}`);
        }
        if (field.max !== undefined) {
          n = n.max(field.max, `${field.label} no puede exceder ${field.max}`);
        }
        schema = field.required ? n : n.optional();
        break;
      }
      case 'select': {
        if (field.options && field.options.length > 0) {
          const values = field.options.map(o => o.value) as [string, ...string[]];
          schema = field.required
            ? z.enum(values, { errorMap: () => ({ message: `Seleccione ${field.label.toLowerCase()}` }) })
            : z.enum(values).optional().or(z.literal(''));
        } else {
          schema = field.required
            ? z.string().min(1, `Seleccione ${field.label.toLowerCase()}`)
            : z.string().optional().or(z.literal(''));
        }
        break;
      }
      case 'boolean': {
        schema = z.boolean().default(field.defaultValue as boolean ?? false);
        break;
      }
      case 'date': {
        schema = field.required
          ? z.string().min(1, `${field.label} es requerido`)
          : z.string().optional().or(z.literal(''));
        break;
      }
      case 'uuid': {
        schema = field.required
          ? z.string().uuid(`${field.label} debe ser un UUID válido`)
          : z.string().uuid().optional().or(z.literal(''));
        break;
      }
      case 'autocomplete': {
        let s = z.string();
        if (field.required) {
          s = s.min(1, `${field.label} es requerido`);
        }
        schema = field.required ? s : s.optional().or(z.literal(''));
        break;
      }
      default:
        schema = z.string().optional();
    }

    shape[field.name] = schema;
  }

  return z.object(shape);
}
