import { config } from "@/lib/config";
import { UserState } from "@/types/api/user";

/**
 * Sends full user object to server to update
 */
export async function updateUserApi(user: UserState): Promise<UserState> {
  if (!user.id) throw new Error('User id missing');
  const res = await fetch(`${config.API_URL}/user/${user.id}`, {
    method: 'POST',
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update user');
  }

  return res.json();
}