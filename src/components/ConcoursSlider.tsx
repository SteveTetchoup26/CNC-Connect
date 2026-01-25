/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EntranceExamCard from "@/components/EntranceExamCard";
import { Skeleton } from "@/components/ui/skeleton";
import EntranceExamCardSkeleton from "./skeletons/EntranceExamCardSkeleton";

const getSlidesPerView = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
  }
  return 1;
};

const ConcoursSlider = ({
  title,
  rubrique,
  items,
  isLoading = false, // Nouvelle prop
}: {
  title: string;
  rubrique: string;
  items: any[];
  isLoading?: boolean;
}) => {
  const [index, setIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Gérer le responsive
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize(); // Appel initial
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(items.length - slidesPerView, 0);
  const showControls = !isLoading && items.length > slidesPerView;

  // Si en chargement ET pas d'items
  if (isLoading) {
    return (
      <section className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Slider skeleton */}
        <div className="relative overflow-hidden">
          <div className="flex">
            {Array.from({ length: isMobile ? 1 : slidesPerView }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3"
              >
                <EntranceExamCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        {/* Controls skeleton */}
        <div className="flex justify-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </section>
    );
  }

  // Si pas d'items (et pas en chargement)
  if (!isLoading && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">
          {title}
          {items.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground block md:inline md:ml-2">
              ({items.length})
            </span>
          )}
        </h2>
        {/* Optionnel: Lien "Voir plus"
        <Link
          to={`/concours/rubrique/${rubrique}`}
          className="text-primary underline text-sm"
        >
          Voir plus
        </Link>
        */}
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((c) => (
            <div
              key={c.id}
              className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
            >
              <EntranceExamCard {...c} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex justify-center gap-4">
          <button
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
            className="h-10 w-10 border rounded-full flex items-center justify-center
                       disabled:opacity-40 hover:bg-muted transition disabled:cursor-not-allowed"
            aria-label="Précédent"
          >
            <ChevronLeft />
          </button>

          <button
            disabled={index >= maxIndex}
            onClick={() => setIndex((i) => i + 1)}
            className="h-10 w-10 border rounded-full flex items-center justify-center
                       disabled:opacity-40 hover:bg-muted transition disabled:cursor-not-allowed"
            aria-label="Suivant"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default ConcoursSlider;