import { config } from "@/lib/config";

export async function getUserById(userId: string)  {
  if (!userId) throw new Error("User id missing");
  console.log("service user id: ", userId)
  try {
    const res = await fetch(`${config.API_URL}/user/${userId}/get`, {
      method: "GET",
      
    });

     
    return res.json();
  } catch (err: any) {
    console.error(err);
  }
}
