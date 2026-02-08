"use client";

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, AlertTriangle, Activity } from 'lucide-react';
import { useCrisisContext } from "@/context/CrisisContext";
import "leaflet/dist/leaflet.css";

export interface DisasterMapProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
    type?: string;     
    severity?: string; 
  }>;
}

const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const { useMap } = require("react-leaflet");
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, zoom);
      setTimeout(() => { map.invalidateSize(); }, 200);
    }
  }, [center, zoom, map]);

  return null;
};

const MapComponent = ({ center, zoom = 13, markers }: DisasterMapProps) => {
  const { MapContainer, TileLayer, Marker, Popup, Circle } = require("react-leaflet");
  const L = require("leaflet");
  
  const { setMarkers } = useCrisisContext();

  const safeCenter: [number, number] = (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) 
    ? center 
    : [12.9716, 77.5946];


  const validMarkers = useMemo(() => {
    if (!Array.isArray(markers)) return [];
    return markers.filter(m => 
      m && 
      typeof m.lat === 'number' && !isNaN(m.lat) &&
      typeof m.lng === 'number' && !isNaN(m.lng)
    );
  }, [markers]);

  useEffect(() => {
    if (validMarkers.length > 0) {
      const contextMarkers = validMarkers.map(m => ({
        lat: m.lat,
        lng: m.lng,
        title: m.title || "Unknown Location",
        description: m.description,
        type: m.type,
        severity: m.severity
      }));
      
      setMarkers(contextMarkers);
    }
  }, [validMarkers, setMarkers]);

  const getIcon = (type: string = "structural") => {
    const isFire = (type || "").toLowerCase().includes("fire");
    const outerClass = isFire ? "bg-red-400" : "bg-emerald-400";
    const innerClass = isFire ? "bg-red-500" : "bg-emerald-600";
    
    return L.divIcon({
      className: 'bg-transparent',
      html: `<div class="relative flex items-center justify-center w-8 h-8">
              <span class="absolute inline-flex h-full w-full rounded-full ${outerClass} opacity-75 animate-ping"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 ${innerClass} border-2 border-white"></span>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-lg my-4 animate-in relative z-0">
      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Live Incident Tracker</span>
        </div>
        <div className="flex gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold animate-pulse">
                LIVE FEED
            </span>
        </div>
      </div>

      <div className="h-[400px] relative bg-slate-100">
        <MapContainer center={safeCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
          <MapUpdater center={safeCenter} zoom={zoom} />
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />

          {validMarkers.map((marker, idx) => (
            <Marker key={`marker-${idx}`} position={[marker.lat, marker.lng]} icon={getIcon(marker.type)}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2 border-b pb-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-sm uppercase">{marker.type || "ALERT"}</span>
                  </div>
                  <h3 className="font-semibold text-base">{marker.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{marker.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <Circle 
            center={safeCenter} 
            radius={800} 
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15 }} 
          />
        </MapContainer>
      </div>
    </div>
  );
};

export const DisasterMap = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400">
      <Activity className="w-8 h-8 mb-2 animate-bounce" />
      <span className="text-sm font-mono">ESTABLISHING SATELLITE LINK...</span>
    </div>
  ),
});