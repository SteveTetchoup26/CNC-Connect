/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EntranceExamCard from "@/components/EntranceExamCard";
import { Link } from "react-router-dom";

const getSlidesPerView = () => {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
};

const ConcoursSlider = ({
  title,
  rubrique,
  items,
}: {
  title: string;
  rubrique: string;
  items: any[];
}) => {
  const [index, setIndex] = useState(0);

  const slidesPerView = getSlidesPerView();
  const maxIndex = Math.max(items.length - slidesPerView, 0);
  const showControls = items.length > slidesPerView;

  if (!items.length) return null;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {/* <Link
          to={`/concours/rubrique/${rubrique}`}
          className="text-primary underline text-sm"
        >
          Voir plus
        </Link> */}
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
                       disabled:opacity-40 hover:bg-muted transition"
          >
            <ChevronLeft />
          </button>

          <button
            disabled={index >= maxIndex}
            onClick={() => setIndex((i) => i + 1)}
            className="h-10 w-10 border rounded-full flex items-center justify-center
                       disabled:opacity-40 hover:bg-muted transition"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default ConcoursSlider;
