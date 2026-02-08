"use client";

import { useEffect, useState } from "react";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider, useTamboThreadInput } from "@tambo-ai/react";
import { Zap, Radio, Globe, ShieldCheck, Activity } from "lucide-react";
import { CrisisProvider } from "@/context/CrisisContext";

function TacticalHUD() {
  const { setValue, submit } = useTamboThreadInput();
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    const scenarioText = `
[SYSTEM INSTRUCTION: You are ResQ-AI, a Tactical Disaster Response Coordinator. 
RULES: 
1. Render 'DisasterMap' immediately for locations.
2. Render 'SupplyInventory' for resources.
3. Keep text brief and military-style.]

REPORT: EMERGENCY ALERT: 6.8 Magnitude Earthquake detected in Indiranagar, Bangalore. Structural damage reported at 3 coordinates. We need to immediately mobilize 500 Food Packets and Search & Rescue teams. Visualize the impact zone now.
    `.trim();
    
    setValue(scenarioText);

    setTimeout(() => {
      submit({ 
        streamResponse: true,
        resourceNames: {} 
      });
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="absolute top-6 right-6 z-40 animate-in slide-in-from-right-10 duration-700 pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-lg p-3 shadow-xl flex flex-col gap-2 w-64">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Simulation Control</span>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="h-2 w-2 rounded-full bg-slate-300"></span>
          </div>
        </div>
        
        <button 
          onClick={runSimulation}
          disabled={isRunning}
          className="group relative overflow-hidden flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold uppercase tracking-wider">Execute Scenario</span>
            <span className="text-[10px] text-primary-foreground/70">Indiranagar Earthquake</span>
          </div>
      
          <Zap className={`w-5 h-5 text-primary-foreground ${isRunning ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>
    </div>
  );
}

function HeaderStatusBar({ userName }: { userName: string | null }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50 select-none relative shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-primary/25 shadow-lg">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 tracking-tight">ResQ.AI</span>
            <span className="text-[10px] text-emerald-600 font-mono tracking-widest">COMMAND CONSOLE</span>
          </div>
        </div>
        
        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
        
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-emerald-600" />
            <span>NET: SECURE</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-amber-600" />
            <span>LATENCY: 24ms</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Operative</div>
          <div className="text-xs font-mono text-emerald-600 font-bold truncate max-w-[150px] uppercase tracking-wide">
            {userName || "TACTICAL_CMD"}
          </div>
        </div>
        <div className="text-xs sm:text-sm font-mono text-slate-600 font-medium tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-200 min-w-[80px] text-center">
          {time || "--:--:--"}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const mcpServers = useMcpServers();
  const userId = "demo-commander";
  const userName = "TACTICAL_COMMANDER";

  const contextKey = `user-${userId}`;

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      contextKey={contextKey}
    >
      <CrisisProvider>
        <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden">
          
          <HeaderStatusBar userName={userName} />

          <div className="flex-1 relative w-full flex flex-col overflow-hidden">
            
            <div className="absolute top-0 right-0 z-30 pointer-events-none w-full h-full">
               <TacticalHUD />
            </div>

            <div className="flex-1 w-full bg-slate-50 relative flex flex-col min-h-0 overflow-hidden">
               <MessageThreadFull />
            </div>

          </div>
        </div>
      </CrisisProvider>
    </TamboProvider>
  );
}