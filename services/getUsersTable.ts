import { config } from "@/lib/config";
import { UserState } from "@/types/api/user";

/**
 * Gets all users
 */
export async function getAllUsers(): Promise<UserState[]> {
  const res = await fetch(`${config.API_URL}/users`, {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update user");
  }

  return res.json();
}
