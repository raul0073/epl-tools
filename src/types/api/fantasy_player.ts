export interface FantasyPlayer {
  id: number
  web_name: string
  first_name: string
  second_name: string
  team: string
  position: 'GKP' | 'DEF' | 'MID' | 'FWD'
  now_cost: number
  selected_by_percent: string
  total_points: number
  form: string
  event_points: number
  minutes: number
}

export interface FantasyPick {
  element: number
  position: number
  multiplier: number
  is_captain: boolean
  is_vice_captain: boolean
  element_type: number
  player: FantasyPlayer
}

export interface FantasyEntryHistory {
  event: number
  points: number
  total_points: number
  rank: number
  rank_sort: number
  overall_rank: number
  percentile_rank: number
  bank: number
  value: number
  event_transfers: number
  event_transfers_cost: number
  points_on_bench: number
}

export interface FantasyTeamPicksData {
  active_chip: string | null
  //eslint-disable-next-line
  automatic_subs: any[]
  entry_history: FantasyEntryHistory
  picks: FantasyPick[]
}

export interface FantasyTeamPicksResponse {
  success: true
  data: FantasyTeamPicksData
}
