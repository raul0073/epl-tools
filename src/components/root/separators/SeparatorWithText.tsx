"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";

function SeparatorWithText({ text = "OR" }: { text?: string }) {
  return (
    <div className="flex items-center w-full gap-2">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground">{text}</span>
      <Separator className="flex-1" />
    </div>
  );
}

export default SeparatorWithText;
