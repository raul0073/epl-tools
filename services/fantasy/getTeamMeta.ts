export async function getFantasyTeamData(teamId: number) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/fantasy/${teamId}/meta`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch team meta for ${teamId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
