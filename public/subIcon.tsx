import { cn } from '@/lib/utils';
import { FixtureEvent } from '@/types/api/fixtures';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import { GiRunningShoe } from "react-icons/gi";
import { IoFootball } from 'react-icons/io5';
import { TbRectangleVerticalFilled } from 'react-icons/tb';

/** Event Icons */
export function SecondYellowIcon() {
  return (
    <div className='relative inline'>
      <TbRectangleVerticalFilled className="fill-red-600 relative -bottom-1 z-10" size={12} />
      <TbRectangleVerticalFilled className="fill-yellow-400 relative -top-1.5 -right-1" size={12} />
    </div>
  )
}
export function YellowCardIcon() { return <TbRectangleVerticalFilled className="fill-yellow-400" size={12} /> }
export function RedCardIcon() { return <TbRectangleVerticalFilled className="fill-red-600" size={12} /> }
export function SubstitutionInIcon() { return <ArrowRight className="text-lime-600 inline" size={12} /> }
export function SubstitutionOutIcon() { return <ArrowLeft className="text-pink-600 inline" size={12} /> }
export function OGIcon() { return <span className='text-destructive font-bold'>OG</span> }
export function GoalIcon() { return <IoFootball className="inline text-primary/80" size={12} /> }
export function AssistIcon() { return <GiRunningShoe className="inline" size={12} /> }

/** Returns a fully processed event component */
export function getEventComp(ev: FixtureEvent, teamSide: "home" | "away") {
  const { player1, player2, event_type } = ev;

  let mainIcon: React.ReactNode = null;
  let secondary: React.ReactNode = null;
  let secondaryAway: React.ReactNode = null;

  switch (event_type) {
    case "goal":
      mainIcon = <GoalIcon />;
      if (player2) secondary = <span className="text-xs text-muted-foreground">{player2} <AssistIcon /></span>;
      break;
    case "own_goal":
      mainIcon = <OGIcon />;
      break;
    case "yellow_card":
      mainIcon = <YellowCardIcon />;
      break;
    case "red_card":
      mainIcon = <RedCardIcon />;
      break;
    case "yellow_red_card":
      mainIcon = <SecondYellowIcon />;
      break;
    case "substitute_in":
      mainIcon = <SubstitutionInIcon />;
      if (player2) {
        secondary = <span className="text-xs text-muted-foreground">{player2} <SubstitutionOutIcon /></span>;
        secondaryAway = <span className="text-xs text-muted-foreground"><SubstitutionOutIcon /> {player2} </span>;
      }
      break;
    case "substitute_out":
      mainIcon = <SubstitutionOutIcon />;
      if (player2) secondary = <span className="text-xs">{player2}</span>;
      break;
    default:
      mainIcon = null;
  }

  if (teamSide === "home") {
    // Home team: name first, icon second
    return (
      <div className={cn("relative flex flex-col gap-1 items-end pr-1  text-xs sm:text-sm  before:absolute before:w-2 before:bg-input before:h-[2px] before:rounded-lg before:top-1/2 before:trnaslate-y-1/2 before:-right-2")}>
        <div className={cn("flex items-center gap-1 text-right")}>
          <>
            <span className="font-semibold">{player1}</span>
            <span className=''>{mainIcon}</span>
          </>

        </div>
        {secondary}
      </div>
    );
  } else {
    // Away team: icon first, name second (mirror)
    return (
      <div className={cn("relative flex flex-col gap-1 items-start pl-1  text-xs sm:text-sm  before:absolute before:w-2 before:bg-input before:h-[2px] before:rounded-lg before:top-1/2 before:trnaslate-y-1/2 before:-left-2")}>
        <div className="flex items-center gap-1 text-left">
          <span>{mainIcon}</span>
          <span className="font-semibold">{player1}</span>
        </div>
        {secondaryAway}
      </div>
    );
  }
}
