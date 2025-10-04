export interface Player {
  label: string;
  value: string;
  team: string;
  position: string;
  starts?: number;
  goals?: number;
  assists?: number;
  xG?: number;
  xGA?: number;
}