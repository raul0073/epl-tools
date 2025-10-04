import { Fixture, FixturesApiResponse } from "@/types/api/fixtures";

export async function fetchFixtures(week: number | null): Promise<FixturesApiResponse | null> {
  const query = week ? week : null
  const url = query ? `${process.env.NEXT_PUBLIC_API_URL}/fbref/fixtures?week=${week}` : `${process.env.NEXT_PUBLIC_API_URL}/fbref/fixtures`
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch fixtures");
    return await res.json() as FixturesApiResponse
  } catch (err) {
    console.error(err);
    return null;
  }
}