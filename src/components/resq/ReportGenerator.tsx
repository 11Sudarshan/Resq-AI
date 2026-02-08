"use client";

import { useState } from "react";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { useCrisisContext } from "@/context/CrisisContext";
import { FileText, Loader2 } from "lucide-react";

export function ReportGenerator() {
  const { thread } = useTamboThread();
  const { submit, setValue } = useTamboThreadInput();
  const [loading, setLoading] = useState(false);
  

  const { supplies, markers } = useCrisisContext();

  const generateReport = async () => {
    setLoading(true);

    try {
      const dynamicTitle = `SITREP_${new Date().toISOString().split('T')[0]}`;
      

      const supplyText = supplies.map(s => `- ${s.count}x ${s.name} (${s.category})`).join("\n");
      const mapText = markers.map(m => `- ${m.title} at [${m.lat.toFixed(3)}, ${m.lng.toFixed(3)}]`).join("\n");

 
      const prompt = `
      [SYSTEM] GENERATE REPORT FROM PROVIDED DATA
      
      DATA CONTEXT:
      Logistics:
      ${supplyText}
      
      Locations:
      ${mapText}

      INSTRUCTIONS:
      1. Write a formal Executive Summary based on the data above.
      2. Render the 'ReportDownload' component.
         - set reportTitle="${dynamicTitle}"
         - (Note: The component will self-hydrate the data from Context).
      `;

      setValue(prompt);

      setTimeout(() => {
        submit({ streamResponse: true, resourceNames: {} });
        setLoading(false); 
      }, 500);

    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={generateReport}
      disabled={loading}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
      {loading ? "ANALYZING..." : "GENERATE SITREP"}
    </button>
  );
}