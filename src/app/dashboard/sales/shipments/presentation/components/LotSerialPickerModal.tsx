"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Package, Check, X, AlertTriangle, Zap, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export interface InventoryLot {
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

export interface SelectedLot {
  lot_id: string;
  lot_number: string;
  serial_number?: string;
  quantity_to_ship: number;
  location_id: string;
  location_name: string;
}

interface LotSerialPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  productSku?: string;
  warehouseId: string;
  quantityRequired: number;
  trackingType: "lot" | "serial" | "none";
  availableLots: InventoryLot[];
  selectedLots: SelectedLot[];
  onConfirm: (selected: SelectedLot[]) => void;
  onAutoSelect?: (strategy: "FIFO" | "FEFO") => Promise<void>;
  isLoading?: boolean;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export function LotSerialPickerModal({
  open,
  onOpenChange,
  productId,
  productName,
  productSku,
  warehouseId,
  quantityRequired,
  trackingType,
  availableLots,
  selectedLots: initialSelected,
  onConfirm,
  onAutoSelect,
  isLoading,
}: LotSerialPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Map<string, SelectedLot>>(new Map());
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);

  // Initialize selected from props
  useEffect(() => {
    const initial = new Map<string, SelectedLot>();
    initialSelected.forEach(lot => {
      initial.set(lot.lot_id, lot);
    });
    setSelected(initial);
  }, [initialSelected, open]);

  const filteredLots = availableLots.filter(lot => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      lot.lot_number.toLowerCase().includes(searchLower) ||
      lot.serial_number?.toLowerCase().includes(searchLower) ||
      lot.location_name.toLowerCase().includes(searchLower)
    );
  });

  const totalSelected = Array.from(selected.values()).reduce(
    (sum, lot) => sum + lot.quantity_to_ship,
    0
  );

  const isComplete = totalSelected >= quantityRequired;
  const isOverPicked = totalSelected > quantityRequired;

  const handleToggleLot = useCallback((lot: InventoryLot) => {
    setSelected(prev => {
      const newSelected = new Map(prev);
      if (newSelected.has(lot.lot_id)) {
        newSelected.delete(lot.lot_id);
      } else {
        // For serial tracking, quantity is always 1
        const qty = trackingType === "serial" ? 1 : Math.min(
          lot.quantity_available,
          quantityRequired - totalSelected
        );
        newSelected.set(lot.lot_id, {
          lot_id: lot.lot_id,
          lot_number: lot.lot_number,
          serial_number: lot.serial_number,
          quantity_to_ship: qty,
          location_id: lot.location_id,
          location_name: lot.location_name,
        });
      }
      return newSelected;
    });
  }, [trackingType, quantityRequired, totalSelected]);

  const handleQuantityChange = useCallback((lotId: string, quantity: number) => {
    setSelected(prev => {
      const newSelected = new Map(prev);
      const existing = newSelected.get(lotId);
      if (existing) {
        newSelected.set(lotId, { ...existing, quantity_to_ship: quantity });
      }
      return newSelected;
    });
  }, []);

  const handleAutoSelect = useCallback(async (strategy: "FIFO" | "FEFO") => {
    if (!onAutoSelect) return;

    setIsAutoSelecting(true);
    try {
      await onAutoSelect(strategy);
    } catch (error) {
      console.error("Error auto-selecting lots:", error);
    } finally {
      setIsAutoSelecting(false);
    }
  }, [onAutoSelect]);

  const handleConfirm = useCallback(() => {
    onConfirm(Array.from(selected.values()));
    onOpenChange(false);
  }, [selected, onConfirm, onOpenChange]);

  const isExpiringSoon = (date?: string) => {
    if (!date) return false;
    const expDate = new Date(date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expDate <= thirtyDaysFromNow;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-base font-semibold">
                {trackingType === "serial" ? "Seleccionar Seriales" : "Seleccionar Lotes"}
              </div>
              <div className="text-sm font-normal text-muted-foreground">
                {productSku && <span className="font-mono">{productSku}</span>}
                {productSku && " - "}
                {productName}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="border-t" />

        {/* Status Bar */}
        <div className="px-6 py-3 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Requerido:</span>{" "}
              <span className="font-semibold tabular-nums">{quantityRequired}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Seleccionado:</span>{" "}
              <span className={`font-semibold tabular-nums ${isOverPicked ? "text-destructive" : isComplete ? "text-success" : ""}`}>
                {totalSelected}
              </span>
            </div>
          </div>
          {isComplete && !isOverPicked && (
            <Badge variant="outline" className="bg-success/15 text-success border-0">
              <Check className="mr-1 h-3 w-3" />
              Cantidad completa
            </Badge>
          )}
          {isOverPicked && (
            <Badge variant="outline" className="bg-destructive/15 text-destructive border-0">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Excede cantidad requerida
            </Badge>
          )}
        </div>

        {/* Search and Auto-Select */}
        <div className="px-6 py-3 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={trackingType === "serial" ? "Buscar por serial o ubicación..." : "Buscar por lote o ubicación..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          {trackingType === "lot" && onAutoSelect && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Selección automática:</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAutoSelect("FIFO")}
                disabled={isLoading || isAutoSelecting}
                className="h-7 text-xs"
              >
                <Zap className="mr-1.5 h-3 w-3" />
                Auto FIFO
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAutoSelect("FEFO")}
                disabled={isLoading || isAutoSelecting}
                className="h-7 text-xs"
              >
                <Calendar className="mr-1.5 h-3 w-3" />
                Auto FEFO
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-12" />
                <TableHead className="text-xs font-medium uppercase tracking-wide">
                  {trackingType === "serial" ? "Serial" : "Lote"}
                </TableHead>
                {trackingType === "lot" && (
                  <TableHead className="text-xs font-medium uppercase tracking-wide">
                    Vencimiento
                  </TableHead>
                )}
                <TableHead className="text-xs font-medium uppercase tracking-wide">
                  Ubicación
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-center">
                  Disponible
                </TableHead>
                {trackingType === "lot" && (
                  <TableHead className="text-xs font-medium uppercase tracking-wide text-center w-32">
                    Cantidad
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={trackingType === "lot" ? 6 : 4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-muted p-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">Sin inventario disponible</p>
                      <p className="text-xs text-muted-foreground">
                        No hay lotes disponibles para este producto en el almacén seleccionado
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLots.map((lot) => {
                  const isSelected = selected.has(lot.lot_id);
                  const selectedQty = selected.get(lot.lot_id)?.quantity_to_ship || 0;
                  const expiringSoon = isExpiringSoon(lot.expiration_date);

                  return (
                    <TableRow
                      key={lot.lot_id}
                      className={isSelected ? "bg-primary/5" : ""}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleLot(lot)}
                          disabled={isLoading}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-medium">
                          {trackingType === "serial" ? lot.serial_number : lot.lot_number}
                        </span>
                      </TableCell>
                      {trackingType === "lot" && (
                        <TableCell>
                          {lot.expiration_date ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm tabular-nums ${expiringSoon ? "text-warning font-medium" : "text-muted-foreground"}`}>
                                {formatDate(lot.expiration_date)}
                              </span>
                              {expiringSoon && (
                                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <span className="text-sm">{lot.location_name}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono text-sm tabular-nums">
                          {lot.quantity_available}
                        </span>
                      </TableCell>
                      {trackingType === "lot" && (
                        <TableCell>
                          {isSelected ? (
                            <Input
                              type="number"
                              min={1}
                              max={lot.quantity_available}
                              value={selectedQty}
                              onChange={(e) => handleQuantityChange(lot.lot_id, Math.min(e.target.valueAsNumber || 1, lot.quantity_available))}
                              className="h-8 w-24 text-center tabular-nums"
                              disabled={isLoading}
                            />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isLoading || totalSelected === 0}
          >
            <Check className="mr-1.5 h-3.5 w-3.5" />
            Confirmar Selección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
