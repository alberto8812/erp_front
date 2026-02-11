# Lot Management UI Implementation

## Overview
This document describes the implementation of lot management functionality in the OneERP frontend, including enhanced purchase receipt forms and FIFO/FEFO automatic lot selection for shipments.

## Changes Summary

### TASK 1: Purchase Receipt - Lot Fields Enhancement

#### Files Modified:
1. **`src/app/dashboard/purchasing/receipts/domain/entities/receipt.entity.ts`**
   - Added `manufacture_date?: string` field to `ReceiptLine` interface

2. **`src/app/dashboard/purchasing/receipts/presentation/components/ReceiptFormPage.tsx`**
   - Added `manufacture_date` to line item interface
   - Extended product interface to include `is_lot_tracked` and `is_serial_tracked` flags
   - Added `handleManufactureDateChange` callback handler
   - Added `Boxes` icon import for visual indicators
   - Updated table to include:
     - Manufacture date column header
     - Manufacture date input field for each line
     - Visual indicator badge showing "Lote" or "Serie" when product requires tracking
   - Enhanced lot_number and serial_number inputs with:
     - Conditional placeholder text showing "(requerido)" when tracking is enabled
     - Warning border color when required field is empty
   - Updated colspan for empty state to accommodate new column

#### Features:
- **Visual Indicators**: Products with lot/serial tracking show a badge with icon
- **Required Field Validation**: Visual feedback with warning borders for required lot/serial fields
- **Manufacture Date**: New optional date field for recording manufacturing date
- **Expiration Date**: Existing field maintained for tracking product expiration

---

### TASK 2: Shipment - FIFO/FEFO Lot Selection

#### Files Modified:

1. **`src/app/dashboard/inventory/lots/application/use-cases/lot.actions.ts`**
   - Added `AvailableLot` interface with fields:
     - `lot_id`, `lot_number`, `serial_number`
     - `quantity_available`
     - `expiration_date`, `manufacture_date`
     - `location_id`, `location_name`
     - `warehouse_id`, `warehouse_name`
     - `priority_score` (for strategy ordering)
   - Added `GetAvailableLotsRequest` interface
   - Added `getAvailableLots()` server action that calls `POST /onerp/inventory/lots/available`

2. **`src/app/dashboard/sales/shipments/presentation/components/LotSerialPickerModal.tsx`**
   - Added `Zap` and `Calendar` icons for FIFO/FEFO buttons
   - Updated `InventoryLot` interface to include `manufacture_date` and `priority_score`
   - Added `onAutoSelect` callback prop to modal interface
   - Added `isAutoSelecting` state for loading indication
   - Added `handleAutoSelect` callback to trigger strategy-based selection
   - Enhanced UI with:
     - Auto-selection buttons section (FIFO and FEFO)
     - Loading states during auto-selection
     - Buttons only shown for lot tracking (not serial)

3. **`src/app/dashboard/sales/shipments/presentation/components/ShipmentFormPage.tsx`**
   - Updated `fetchAvailableLots` prop to accept optional `strategy` parameter
   - Added `handleAutoSelectLots` callback that:
     - Fetches lots using the selected strategy (FIFO or FEFO)
     - Automatically selects lots to fulfill the required quantity
     - Updates the line with selected lots
   - Connected `onAutoSelect` prop to `LotSerialPickerModal`

4. **`src/app/dashboard/sales/shipments/new/page.tsx`**
   - Imported `getAvailableLots` action
   - Updated `fetchAvailableLots` function to:
     - Accept optional `strategy` parameter (defaults to "FIFO")
     - Call the backend API via `getAvailableLots` action
     - Handle errors gracefully

#### Features:
- **Auto FIFO Button**: Automatically selects lots in First-In-First-Out order
- **Auto FEFO Button**: Automatically selects lots in First-Expired-First-Out order
- **Smart Selection**: Algorithm fulfills required quantity using optimal lot selection
- **Visual Feedback**: Loading states during auto-selection process
- **Error Handling**: Graceful error handling with console logging

---

## API Integration

### Expected Backend Endpoint

**POST** `/onerp/inventory/lots/available`

**Request Body:**
```typescript
{
  product_id: string;
  warehouse_id: string;
  strategy: "FIFO" | "FEFO";
  quantity_needed?: number;
}
```

**Response:**
```typescript
[
  {
    lot_id: string;
    lot_number: string;
    serial_number?: string;
    quantity_available: number;
    expiration_date?: string;
    manufacture_date?: string;
    location_id: string;
    location_name: string;
    warehouse_id: string;
    warehouse_name: string;
    priority_score?: number;
  }
]
```

**Notes:**
- Backend should return lots ordered by the strategy
- FIFO: Order by `receipt_date` ASC (oldest first)
- FEFO: Order by `expiration_date` ASC (soonest expiration first)
- `priority_score` can be used for UI visualization

---

## User Flow

### Purchase Receipt Flow:
1. User selects a purchase order
2. Order lines load with product information
3. For products with lot/serial tracking:
   - Badge indicator shows tracking type
   - Lot/Serial fields show "(requerido)" placeholder
   - Empty required fields have warning border
4. User enters lot information:
   - Lot number (required if lot-tracked)
   - Serial number (required if serial-tracked)
   - Expiration date (optional)
   - Manufacture date (optional)
5. User saves receipt

### Shipment Lot Selection Flow:
1. User creates a new shipment
2. User selects sales order and warehouse
3. Order lines load
4. For lot-tracked products, user clicks "Lotes" button
5. Lot picker modal opens showing available inventory
6. User can either:
   - **Manual Selection**: Check boxes to select specific lots
   - **Auto FIFO**: Click button to auto-select oldest lots first
   - **Auto FEFO**: Click button to auto-select lots expiring soonest
7. Selected lots auto-populate quantities
8. User confirms selection
9. Line updates with lot information

---

## Testing Checklist

### Purchase Receipts:
- [ ] Create receipt with lot-tracked product
- [ ] Verify badge shows "Lote" for lot-tracked products
- [ ] Verify badge shows "Serie" for serial-tracked products
- [ ] Verify warning border on empty required lot field
- [ ] Verify warning border on empty required serial field
- [ ] Enter lot number and verify warning border disappears
- [ ] Enter manufacture date
- [ ] Enter expiration date
- [ ] Save receipt with complete lot information

### Shipment Lot Selection:
- [ ] Create shipment with lot-tracked product
- [ ] Open lot picker modal
- [ ] Verify available lots display correctly
- [ ] Click "Auto FIFO" and verify oldest lots selected
- [ ] Clear selection
- [ ] Click "Auto FEFO" and verify lots expiring soonest selected
- [ ] Verify quantities auto-filled to match required quantity
- [ ] Manually adjust quantities
- [ ] Confirm selection and verify line updates
- [ ] Save shipment

---

## Technical Notes

### Patterns Followed:
- Server Actions pattern for API calls ("use server")
- React Hook Form + Zod for form validation
- TanStack React Query for data fetching
- shadcn/ui components (Radix UI primitives)
- TailwindCSS for styling
- useCallback for memoized handlers
- Proper TypeScript typing throughout

### Component Structure:
- Presentation layer: React components
- Application layer: Server actions (API calls)
- Domain layer: Entity interfaces
- Clean separation of concerns

### Error Handling:
- Try-catch blocks in async functions
- Console error logging
- Graceful fallbacks (empty arrays on error)
- Toast notifications for user feedback (in parent components)

---

## Future Enhancements

1. **Validation**: Add Zod schema validation for required lot/serial fields
2. **Tooltips**: Add tooltips explaining FIFO vs FEFO strategies
3. **Lot Details**: Show more lot information (cost, quality status, etc.)
4. **Batch Operations**: Multi-line lot selection
5. **Lot History**: Show lot movement history
6. **Expiration Warnings**: Visual warnings for lots near expiration
7. **Reserve Lots**: Reserve lots during order processing
8. **Lot Splitting**: Allow splitting quantities across multiple lots

---

## Files Modified Summary

```
src/app/dashboard/purchasing/receipts/
  ├── domain/entities/receipt.entity.ts (modified)
  └── presentation/components/ReceiptFormPage.tsx (modified)

src/app/dashboard/sales/shipments/
  ├── new/page.tsx (modified)
  └── presentation/components/
      ├── LotSerialPickerModal.tsx (modified)
      └── ShipmentFormPage.tsx (modified)

src/app/dashboard/inventory/lots/
  └── application/use-cases/lot.actions.ts (modified)
```

---

## Deployment Notes

1. Ensure backend endpoint `/onerp/inventory/lots/available` is implemented
2. Test lot tracking flags on products are correctly set
3. Verify inventory lots have proper dates (receipt_date, expiration_date)
4. Check warehouse locations are correctly configured
5. Test with both lot-tracked and serial-tracked products
6. Verify permission checks for lot/serial entry

---

## Screenshots

*(Add screenshots here after testing)*

1. Purchase receipt with lot indicator badge
2. Purchase receipt with manufacture date field
3. Lot picker modal with FIFO/FEFO buttons
4. Auto-selected lots in modal

