"use client";

import { useEffect } from "react";
import { useCrisisContext } from "@/context/CrisisContext"; 
import { 
  Package, 
  Plus, 
  Minus, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp 
} from "lucide-react";

export interface SupplyItem {
  id: string;
  name: string;
  count: number;
  category: "medical" | "food" | "equipment";
  critical: boolean;
}

interface SupplyInventoryProps {
  initialItems?: SupplyItem[];
}

export function SupplyInventory({ initialItems = [] }: SupplyInventoryProps) {

  const { supplies, setSupplies, updateSupplyCount } = useCrisisContext();

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setSupplies(initialItems);
    }
  }, [initialItems, setSupplies]);


  const totalItems = supplies.reduce((acc, curr) => acc + curr.count, 0);
  const criticalCount = supplies.filter(i => i.critical && i.count < 10).length;

  return (
    <div className="w-full my-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in">

      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-700">Logistics Manifest</h3>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-bold animate-pulse">
            <AlertCircle className="w-3 h-3" />
            {criticalCount} CRITICAL LOW
          </div>
        )}
      </div>


      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-100/50 text-xs font-mono text-slate-500 uppercase">
        <div className="col-span-6">Item Name</div>
        <div className="col-span-3 text-center">Status</div>
        <div className="col-span-3 text-right">Quantity</div>
      </div>

      <div className="divide-y divide-slate-100">
        {supplies.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50 transition-colors">
            

            <div className="col-span-6 flex flex-col justify-center">
              <span className="font-medium text-sm text-slate-900">{item.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.category}</span>
            </div>


            <div className="col-span-3 flex justify-center">
              {item.count < 5 && item.critical ? (
                <span className="flex items-center gap-1 text-xs text-red-600 font-bold">
                  <AlertCircle className="w-3 h-3" /> LOW
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> OK
                </span>
              )}
            </div>

            {/* Controls - Directly Updates Global Context */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              <button 
                onClick={() => updateSupplyCount(item.id, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
                disabled={item.count === 0}
              >
                <Minus className="w-3 h-3" />
              </button>
              
              <span className="w-8 text-center font-mono font-bold text-sm text-slate-700">{item.count}</span>
              
              <button 
                onClick={() => updateSupplyCount(item.id, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
        <span className="text-slate-500">Total Assets tracked</span>
        <div className="flex items-center gap-2 font-mono font-bold text-slate-700">
          <TrendingUp className="w-3 h-3 text-indigo-600" />
          {totalItems} UNITS
        </div>
      </div>
    </div>
  );
}