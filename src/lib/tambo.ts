/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";

// --- RESQ-AI IMPORTS ---
import { DisasterMap } from "@/components/resq/DisasterMap";
import { SupplyInventory } from "@/components/resq/SupplyInventory";
import { ReportGenerator } from "@/components/resq/ReportGenerator";
// --- SERVICE IMPORTS ---
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { ReportDownload } from "@/components/resq/ReportDownload";

/**
 * TOOLS
 * Functions the AI can call to fetch data (Population stats, etc.)
 */
export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description: "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia", "Africa", "Europe", "North America", "South America", "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description: "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
];

/**
 * COMPONENTS
 * UI Elements the AI can render in the chat stream
 */
export const components: TamboComponent[] = [
  // --- STANDARD TAMBO COMPONENTS ---
  {
    name: "Graph",
    description: "Renders charts (bar, line, pie). Use this to visualize trends, statistics, or comparisons.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "Displays clickable cards with summaries. Use this for lists of options or key metrics.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  
  // --- RESQ-AI CUSTOM COMPONENTS ---
  {
    name: "DisasterMap",
    description: "Renders a tactical map. Use this when the user asks about locations, disasters, impact zones, or coordinates.",
    component: DisasterMap,
    propsSchema: z.object({
      center: z.array(z.number()).describe("Center lat/lng [lat, lng]"), 
      zoom: z.number().optional().default(13),
      markers: z.array(
        z.object({
          lat: z.number(),
          lng: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          type: z.string().describe("Type: fire, medical, flood, structural").optional().default("structural"),
          severity: z.string().describe("Severity: low, medium, high, critical").optional().default("high"),
        })
      ).optional().default([]),
    }),
  },
  {
    name: "SupplyInventory",
    description: "Renders an interactive logistics manifest. Use this when the user discusses supplies, resources, equipment needs, or inventory tracking.",
    component: SupplyInventory,
    propsSchema: z.object({
      initialItems: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          count: z.number(),
          category: z.enum(["medical", "food", "equipment"]),
          critical: z.boolean(),
        })
      ).optional().describe("Initial list of supplies if provided in the prompt"),
    }),
  },
  {
    name: "ReportGenerator",
    description: "Renders a button to generate a formal SITREP (Situation Report). Use this when the user asks for a final report, summary, or handover document.",
    component: ReportGenerator,
    propsSchema: z.object({}),
  },
  {
    name: "ReportDownload",
    description: "Renders a downloadable PDF file card. Use this AFTER generating a text summary.",
    component: ReportDownload,
    propsSchema: z.object({
      reportTitle: z.string().optional().describe("Name of the file, e.g., 'Indiranagar_Fire_SITREP'"),
    }),
  },
];