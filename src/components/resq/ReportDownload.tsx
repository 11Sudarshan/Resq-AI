"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCrisisContext } from "@/context/CrisisContext";

interface ReportDownloadProps {
  reportTitle?: string;
}

export function ReportDownload({ reportTitle = "SITREP_Report" }: ReportDownloadProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "downloaded">("idle");
  
 
  const { supplies, markers } = useCrisisContext();

  const generatePDF = () => {
    setStatus("generating");

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
     
      doc.setFillColor(13, 148, 136);
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("SITREP: INCIDENT REPORT", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(204, 251, 241); 
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

      
      doc.setTextColor(15, 23, 42); 
      doc.setFontSize(14);
      doc.text("1. LOGISTICS MANIFEST", 14, 55);

      const supplyRows = supplies.length > 0 ? supplies.map(s => [
        s.name, 
        s.count, 
        s.category.toUpperCase(), 
        s.critical ? "CRITICAL" : "OK"
      ]) : [["No supplies recorded", "-", "-", "-"]];

      autoTable(doc, {
        startY: 60,
        head: [["Item Name", "Quantity", "Category", "Status"]],
        body: supplyRows,
        theme: 'striped',
        headStyles: { fillColor: [13, 148, 136] }, 
        styles: { fontSize: 10 },
      });

      
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("2. TACTICAL LOCATIONS", 14, finalY);

     
      let mapRows = markers.map(m => [
        m.title || "Unknown Point",                          
        m.type?.toUpperCase() || "MARKER",                    
        `${Number(m.lat).toFixed(4)}, ${Number(m.lng).toFixed(4)}`, 
        m.description || "No description provided"           
      ]);

      if (mapRows.length === 0) {
        mapRows = [["No tactical locations identified", "-", "-", "-"]];
      }

      autoTable(doc, {
        startY: finalY + 5,
        head: [["Location Name", "Type", "Coordinates", "Notes"]],
        body: mapRows,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] }, 
      });

      
      doc.save(`${reportTitle}.pdf`);
      setStatus("downloaded");
      setTimeout(() => setStatus("idle"), 3000);

    } catch (error) {
      console.error("PDF Generation Failed:", error);
      setStatus("idle");
    }
  };

  return (
    <div 
      onClick={generatePDF}
      className="group w-full max-w-sm mt-4 cursor-pointer"
    >
      <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">
            {reportTitle}.pdf
          </h4>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {status === "generating" ? "Generating PDF..." : "Click to download"}
          </p>
        </div>

        <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">
          {status === "generating" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
}