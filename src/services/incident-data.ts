import { createClient } from "@/utils/supabase/client";

export async function getIncidentData({ threadId }: { threadId: string }) {
  const supabase = createClient();
  
  // Fetch Supplies
  const { data: supplies } = await supabase
    .from('supplies')
    .select('name, count, category, critical')
    .eq('thread_id', threadId);

  // Fetch Map Data
  const { data: mapData } = await supabase
    .from('map_data')
    .select('label, lat, lng, type, details')
    .eq('thread_id', threadId);

  return {
    logistics: supplies || [],
    geospatial: mapData || [],
    generated_at: new Date().toISOString()
  };
}