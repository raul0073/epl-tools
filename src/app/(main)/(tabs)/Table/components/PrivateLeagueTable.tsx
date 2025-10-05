import React from 'react'
type PrivateLeagueProps = {
     data: {
     user_id: string;
    team_name: string;
    points: number;
}[]
}
function PrivateLeagueTable({data}: PrivateLeagueProps) {
    if(!data) return null
  return (
    <div>
      No data .
    </div>
  )
}

export default PrivateLeagueTable
