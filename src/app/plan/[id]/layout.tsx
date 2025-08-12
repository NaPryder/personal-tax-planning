import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "container",
        "mx-auto px-4 py-8",
        "max-w-6xl",
      )}
    >
      <Button asChild variant="ghost">
        <Link
          href="/"
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </Button>

      {children}
    </div>
  );
}
