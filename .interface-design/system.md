# ERP Design System

## Direction

Corporate-executive. Serious, reliable, dense but organized. Like modern SAP or banking software — not playful, not tech-startup. Users are manufacturing operators and administrators who live in this tool all day.

## Color System

**Palette:** Cool blue-tinted neutrals (OKLCH hue 255). Every surface carries a subtle cold undertone — never pure gray.

| Token | Light | Purpose |
|---|---|---|
| `--background` | `oklch(0.985 0.002 255)` | Page background |
| `--card` | `oklch(0.995 0.001 255)` | Card/panel surface |
| `--muted` | `oklch(0.955 0.005 255)` | Secondary backgrounds |
| `--border` | `oklch(0.91 0.005 255)` | All borders |
| `--primary` | `oklch(0.45 0.15 255)` | Executive blue — single brand accent |
| `--success` | `oklch(0.55 0.15 155)` | Positive status |
| `--warning` | `oklch(0.70 0.15 75)` | Warning status |
| `--destructive` | `oklch(0.55 0.22 25)` | Error/critical status |

**Rule:** One accent color (primary blue). Semantic colors only for status. No decorative color.

## Depth Strategy

**Subtle shadows.** No borders-only, no dramatic shadows.

- Cards: `shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]` — barely visible lift
- Dialogs: `shadow-lg` (inherited from Radix)
- No mixed strategies — never combine `shadow-sm` with thick borders

## Spacing

**Base unit:** 4px (Tailwind default). Use multiples: 4, 8, 12, 16, 20, 24, 32.

- Page padding: `p-6` (24px)
- Card content: `p-5` (20px) for metric cards, `p-6` for content cards
- Gap between cards: `gap-4` (16px) for grids, `gap-6` (24px) for sections
- Vertical page sections: `space-y-6`

## Border Radius

**Base:** `0.5rem` (8px). Slightly angular = corporate.

- Cards, dialogs: `rounded-lg` (8px)
- Buttons, inputs: `rounded-md` (6px)
- Badges, pills: `rounded-full`
- Inner elements (icon containers): `rounded-lg` or `rounded-md`

## Typography

**Font:** Geist (sans) + Geist Mono.

| Element | Class | Example |
|---|---|---|
| Page title | `text-2xl font-semibold tracking-tight` | "Inventario" |
| Card section title | `text-base font-semibold` | "Stock por Categoria" |
| Metric label | `text-sm text-muted-foreground` | "Total de Productos" |
| Metric value | `text-2xl font-semibold tracking-tight tabular-nums` | "$125,430.89" |
| Table header | `text-xs font-medium uppercase tracking-wide` | "NOMBRE COMERCIAL" |
| Table cell | `text-sm` (default) | Regular data |
| Table cell (primary) | `text-sm font-medium` | Name/identifier column |
| Table cell (secondary) | `text-sm text-muted-foreground` | Email, dates |
| Table cell (numeric) | `text-sm tabular-nums` | Prices, quantities |
| Small label | `text-xs text-muted-foreground` | Pagination, hints |
| Section label | `text-[11px] font-medium uppercase tracking-wide` | "VISTA PREVIA" |

**Rules:**
- Always use `tabular-nums` for numbers in tables and metrics
- Always use `tracking-tight` on large type (2xl+)
- Currency uses `font-mono` via Intl.NumberFormat
- ID columns: `font-mono text-xs text-muted-foreground`

## Signature Element: Status Rail

A 2px vertical bar on the left edge of cards and active nav items. Communicates state at a glance.

```tsx
<Card className="relative overflow-hidden">
  <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
  {/* content */}
</Card>
```

Colors: `bg-primary` (default), `bg-success` (positive), `bg-destructive` (critical), `bg-warning` (attention).

## Page Layout Pattern

Every data page follows this structure:

```
1. Page header: h1 + subtitle + actions (right-aligned)
2. Toolbar: filters left, primary action right
3. Content: table or card grid
```

```tsx
<div className="space-y-6 p-6">
  {/* Header */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Title</h1>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
    <div className="flex items-center gap-2">
      {/* Action buttons */}
    </div>
  </div>

  {/* Toolbar */}
  <div className="flex items-center justify-between gap-3">
    {/* Filters left, actions right */}
  </div>

  {/* Content */}
</div>
```

**No wrapping Card** for the entire page. Tables and grids stand on their own.

## Metric Card Pattern

```tsx
<Card className="relative overflow-hidden">
  <div className="absolute inset-y-0 left-0 w-0.5 bg-success" />
  <CardContent className="p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Label</p>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">Value</p>
      </div>
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1 text-xs">
      {/* Trend or description */}
    </div>
  </CardContent>
</Card>
```

## Table Pattern

```tsx
<div className="overflow-hidden rounded-lg border">
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/40 hover:bg-muted/40">
        <TableHead>Column</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {/* Rows or empty state */}
    </TableBody>
  </Table>

  {/* Pagination footer */}
  <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
    {/* Page size left, count + nav buttons right */}
  </div>
</div>
```

**Header row:** `bg-muted/40` background, no hover change. Text: `text-xs font-medium uppercase tracking-wide`.

**Empty state:** Icon in muted circle + title + subtitle. Centered. Never use filler rows.

**Pagination:** `bg-muted/20` footer. Lucide icons for nav. Theme-token `<select>`. Spanish labels.

## Button Patterns

| Context | Variant | Size |
|---|---|---|
| Page primary action | `default` | `sm` |
| Page secondary action | `outline` | `sm` |
| Toolbar filter | `outline` | `sm` |
| Dialog confirm | `default` | `sm` |
| Dialog cancel/back | `ghost` or `outline` | `sm` |
| Table row action | `ghost` | `icon` (h-7 w-7) |

Always include icon before label: `<Icon className="mr-1.5 h-3.5 w-3.5" />`

## Dialog Pattern

- Content: `gap-0 p-0 overflow-hidden` — manual section control
- Header section: `px-6 pt-6 pb-4`
- Divider: `<div className="border-t" />`
- Content section: `px-6 py-5`
- Footer: `border-t bg-muted/30 px-6 py-4`
- Overlay: `bg-black/50 backdrop-blur-[2px]`

## Chart Styling

**Bar charts:**
- Grid: `vertical={false}` + `stroke="oklch(0.91 0.005 255)"`
- Bars: `fill="oklch(0.45 0.15 255)"` (primary) + `radius={[4,4,0,0]}` + `maxBarSize={48}`
- Axes: `axisLine={false} tickLine={false}` + 12px font

**Pie charts:**
- Always donut: `innerRadius={50} outerRadius={80}`
- `paddingAngle={2}` + `strokeWidth={0}`
- Custom legend below (grid layout with dot + label + value)
- Never use Recharts default Legend

**Tooltip:** `borderRadius: 8px`, theme border color, subtle shadow.

## Sidebar

- Width: `w-56` (224px)
- Active item: `bg-primary/10 text-primary font-medium` + 2px status rail left
- Inactive: `text-sidebar-foreground/65 hover:bg-sidebar-accent`
- User avatar: initials in `bg-primary/10` circle

## Header

- Height: `h-14`
- Background: `bg-card/80 backdrop-blur-sm`
- Search: `max-w-sm`, muted bg, transparent border
- Icon buttons: `h-9 w-9 text-muted-foreground hover:text-foreground`

## Avoid

- Hardcoded colors (`bg-gray-50`, `text-red-700`) — always use tokens
- `CardPagesComponent` wrapping — pages use flat layout, not card-in-card
- Native `<input type="file">` — use custom drop zones
- English in UI (`Rows per page`) — all Spanish
- Empty filler rows in tables — use proper empty state
- Inline SVGs — use lucide-react icons
- `console.log` in production components
- `text-2xl` on CardTitle — let consumers set size
- `shadow-sm` default on cards — use custom subtle shadow
- `bg-black/80` on overlays — use `bg-black/50 backdrop-blur-[2px]`
