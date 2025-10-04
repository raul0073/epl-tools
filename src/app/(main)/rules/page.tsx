import React from "react";
import { Goal, Trophy, Scale, ArrowBigLeft } from "lucide-react"; // icons
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Rules | EPL Predictor",
  description:
    "Learn the rules for making match and season predictions, scoring system, and tie-breakers in the EPL Predictor app.",
  openGraph: {
    title: "Rules | EPL Predictor",
    description:
      "Learn the rules for making match and season predictions, scoring system, and tie-breakers in the EPL Predictor app.",
    url: "https://yourapp.com/prediction-rules",
    siteName: "EPL Predictor",
    images: [
      {
        url: "https://yourapp.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prediction Rules",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prediction Rules | EPL Predictor",
    description:
      "Learn the rules for making match and season predictions, scoring system, and tie-breakers in the EPL Predictor app.",
    images: ["https://yourapp.com/og-image.png"],
  },
};

const rulesData = [
  {
    title: "Match Predictions",
    description:
      "Predict the score for each fixture. You earn points based on the accuracy of your prediction.",
    rules: [
      "Exact score: 3 points",
      "Correct winner, wrong score: 1 point",
      "Incorrect winner: 0 points",
      "Submit predictions before rounds begins",
    ],
    icon: Goal,
    color: "text-blue-600"
  },
  {
    title: "Season Predictions",
    description:
      "Predict season-long outcomes such as top scorer, league champion, assist king and relegated teams.",
    rules: [
      "Correct top scorer: 10 points",
      "Correct league champion: 10 points",
      "Correct assist king: 10 points",
      "Correct relegated team: 5 points (*for each)",
      "Predictions can be updated until 1.11.2025",
    ],
    icon: Trophy,
    color: "text-green-600"
  },
  {
    title: "Tie-breakers",
    description:
      "In case of equal points among users, the following tie-breakers apply:",
    rules: [
      "Number of exact score predictions",
      "Number of correct winner predictions",
      "Submission timestamp of the last prediction (earlier is better)",
    ],
    icon: Scale,
    color: "text-orange-600"
  },
];

function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
     <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-bl from-indigo-600 to-teal-800 bg-clip-text text-transparent">Prediction Rules</h1>
      {rulesData.map((section, idx) => {
        const Icon = section.icon;
        return (
          <Card key={idx} className="shadow-sm">
            <CardHeader className="">
              <div className="flex justify-between gap-3 items-center">

              <CardTitle>{section.title}</CardTitle>
              <Icon className={cn("w-5 h-5", section.color)} />
              </div>
              <CardDescription>
                 {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
         
              <ul className="list-disc list-inside space-y-1">
                {section.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="text-sm">
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
         <div className="w-full p-2">
        <Link href={'/'} className="w-full">
          <Button variant={'secondary'} className="w-full rounded-full">
            <ArrowBigLeft /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;
