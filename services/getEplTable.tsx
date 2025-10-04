import { config } from "@/lib/config";
import { TeamTable } from "@/types/api/table";

export async function getEplTable(): Promise<TeamTable[]> {
  try {
    const res = await fetch(`${config.API_URL}/fotmob/table`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Failed to fetch EPL table:", res.status, res.statusText);
      return [];
    }

    const data: TeamTable[] = await res.json();
    
    // Optional: sanity check
    if (!Array.isArray(data)) return [];
    
    return data;
  } catch (err) {
    console.error("Error fetching EPL table:", err);
    return [];
  }
}
