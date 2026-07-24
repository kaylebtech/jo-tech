import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
      {icon}
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      <Button
        className="mt-2 rounded-full"
        render={
          <Link href="/products">
            Browse Products
            <ArrowRight className="size-4" />
          </Link>
        }
      />
    </div>
  );
}
