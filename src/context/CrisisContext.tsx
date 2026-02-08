"use client";

import React, { createContext, useContext, useState } from "react";

// Types
export interface SupplyItem {
  id: string;
  name: string;
  count: number;
  category: "medical" | "food" | "equipment";
  critical: boolean;
}

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: string;
  severity?: string;
}

interface CrisisContextType {
  supplies: SupplyItem[];
  setSupplies: (items: SupplyItem[]) => void;
  markers: MapMarker[];
  setMarkers: (markers: MapMarker[]) => void;
  // Helper to add/update items
  updateSupplyCount: (id: string, delta: number) => void;
}

const CrisisContext = createContext<CrisisContextType | null>(null);

export function CrisisProvider({ children }: { children: React.ReactNode }) {
  // Initial Demo Data
  const [supplies, setSupplies] = useState<SupplyItem[]>([
    { id: "1", name: "Sterile Bandages", count: 45, category: "medical", critical: false },
    { id: "2", name: "O+ Blood Packs", count: 2, category: "medical", critical: true },
  ]);

  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const updateSupplyCount = (id: string, delta: number) => {
    setSupplies((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, count: Math.max(0, item.count + delta) } : item
      )
    );
  };

  return (
    <CrisisContext.Provider value={{ supplies, setSupplies, markers, setMarkers, updateSupplyCount }}>
      {children}
    </CrisisContext.Provider>
  );
}

export const useCrisisContext = () => {
  const context = useContext(CrisisContext);
  if (!context) throw new Error("useCrisisContext must be used within CrisisProvider");
  return context;
};