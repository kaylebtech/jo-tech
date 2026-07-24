"use client";

import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/shared/reveal";

export type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  source: string;
};

export function Testimonials({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Testimonials</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Loved by Customers Across Lagos
        </h2>
      </Reveal>

      <Carousel opts={{ align: "start", loop: true }} className="mt-12">
        <CarouselContent className="-ml-4">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <Quote className="size-6 text-accent/50" />
                <div className="mt-3 flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < review.rating ? "fill-current" : "text-border"}`} />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">{review.comment}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {review.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.source === "google" ? "Google Review" : "Verified Customer"}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex justify-center gap-2">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}
