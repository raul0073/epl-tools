// utils/homeTabs.ts
export const tabTriggerClass = [
  "relative group w-full rounded-none py-4 shadow-none border-x-0 border-t-0",
  "text-sm font-medium",
  "transition-colors duration-200 ease-in-out",
  "bg-gradient-to-b from-muted to-transparent",
  "data-[state=active]:border-t-0",
  "data-[state=active]:border-x-0",
  "data-[state=active]:border-b-2",
  "data-[state=active]:border-indigo-600",
  "outline-none flex items-center justify-center",
].join(" ");

export const navigateRound = {
  prev: (round: number | null) => (round !== null ? Math.max(1, round - 1) : 1),
  next: (round: number | null) => (round !== null ? round + 1 : 1),
};
