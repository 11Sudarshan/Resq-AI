"use client";

import Link from "next/link";
import { 
  ShieldAlert, 
  Map as MapIcon, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard 
} from "lucide-react";

import { CrisisProvider } from "@/context/CrisisContext";

export default function LandingPage() {
  return (
    <CrisisProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
        

        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-all">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ResQ<span className="text-emerald-500">.AI</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
              <a href="#features" className="hover:text-emerald-500 transition-colors">Capabilities</a>
              <Link href="/chat" className="hover:text-emerald-500 transition-colors">
                Live Simulation
              </Link>
              <a href="https://github.com/tambo-ai/tambo" target="_blank" className="hover:text-emerald-500 transition-colors">Tambo SDK</a>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/chat"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Launch Console
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col pt-32 pb-20 px-6 relative overflow-hidden">
          
          {/* Background Blob - Updated to Aquamarine/Teal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
            
            {/* Status Badge - Updated to Teal/Green */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100 dark:border-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Generative UI for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary dark:from-emerald-400 dark:to-primary">
                Crisis Response
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              ResQ-AI adapts to the emergency. It generates 
              <span className="text-slate-900 dark:text-slate-200 font-semibold mx-1">tactical maps</span>, 
              <span className="text-slate-900 dark:text-slate-200 font-semibold mx-1">logistics manifests</span>, and 
              <span className="text-slate-900 dark:text-slate-200 font-semibold mx-1">SITREPs</span> 
              instantly based on natural language commands.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              
              <Link 
                href="/chat"
                className="h-12 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 active:scale-95 justify-center"
              >
                <LayoutDashboard className="w-5 h-5" />
                Initialize Command Center
              </Link>
              
              <button className="h-12 px-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Watch Demo Video
              </button>
            </div>

            <div id="features" className="grid md:grid-cols-3 gap-6 pt-20 text-left">
              {[
                {
                  icon: MapIcon,
                  title: "Generative Mapping",
                  desc: "AI identifies locations in real-time and renders tactical maps with danger zones and safe routes."
                },
                {
                  icon: Activity,
                  title: "Live Triage",
                  desc: "Dynamic forms that adapt to patient symptoms. If a user says 'Burn victim', the UI changes instantly."
                },
                {
                  icon: ShieldAlert,
                  title: "Auto-Logistics",
                  desc: "Manage inventory with natural language. 'Add 500 kits' updates the database immediately."
                }
              ].map((feature, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2026 ResQ-AI Project. Built for Crisis Response Demo.</p>
          </div>
        </footer>
      </div>
    </CrisisProvider>
  );
}