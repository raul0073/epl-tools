import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowBigLeft, Mail, Send, Toilet } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact | EPL Predictor",
  description:
    "Get in touch with the EPL Predictor team. Questions, feedback or suggestions? Use our contact page.",
  openGraph: {
    title: "Contact | EPL Predictor",
    description:
      "Get in touch with the EPL Predictor team. Questions, feedback or suggestions? Use our contact page.",
    url: "https://yourapp.com/contact",
    siteName: "EPL Predictor",
    images: [
      {
        url: "https://yourapp.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact EPL Predictor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | EPL Predictor",
    description:
      "Get in touch with the EPL Predictor team. Questions, feedback or suggestions? Use our contact page.",
    images: ["https://yourapp.com/og-image.png"],
  },
};

const contactSections = [
  {
    title: "General Inquiries",
    description: "For questions about predictions, scoring or technical issues.",
    items: ["Email: support@eplpredictor.com", "Response time: within 48 hours"],
    icon: Mail,
    color: "text-blue-600",
  },
  {
    title: "Feedback & Suggestions",
    description: "We welcome your ideas for improving the platform.",
    items: [
      "Share your feedback anytime",
      "Feature requests are reviewed monthly",
    ],
    icon: Toilet,
    color: "text-green-600",
  },
  {
    title: "Submit a Message",
    description: "Use our quick form to send us a message directly.",
    items: [
      "Provide your name and email",
      "Keep your message clear and concise",
    ],
    icon: Send,
    color: "text-orange-600",
  },
];

function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-bl from-indigo-600 to-teal-800 bg-clip-text text-transparent">Contact Us</h1>
      {contactSections.map((section, idx) => {
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
                {section.items.map((item, rIdx) => (
                  <li key={rIdx} className="text-sm">
                    {item}
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
