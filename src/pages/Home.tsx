/* eslint-disable @typescript-eslint/no-explicit-any */
import EntranceExamCard from "@/components/EntranceExamCard";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import studentHero from "@/assets/images/student-hero.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getConcours } from "@/store/concours/concoursSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const getSlidesPerView = () => {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 640) return 2;  // sm
    return 1;                                // mobile
  };

  const { data: concours, loading } = useSelector(
    (state: RootState) => state.concours
  );

  useEffect(() => {
    dispatch(getConcours());
  }, [dispatch]);

  const slidesPerView = getSlidesPerView();
  const maxIndex = Math.max(concours.length - slidesPerView, 0);

  const next = () => {
    setIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  const prev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <main>
      <section className="md:relative min-h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${studentHero})` }}
        />
        
        {/* Overlay pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-0" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24 z-10 min-h-screen flex items-center">
          <div className="max-w-xl space-y-6">
            <span className="inline-block bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm">
              Plateforme d'enrôlement académique
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold leading-tight">
              Trouvez votre <span className="text-primary">concours</span> et
              <br /> lancez votre avenir académique
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-full">
              Inscrivez-vous facilement aux concours disponibles, suivez votre
              statut d'enrôlement et préparez votre réussite.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button className="cursor-pointer bg-primary hover:bg-primary-hover px-5 py-3 text-base sm:text-lg w-full sm:w-auto">
                Voir les concours
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer border-secondary text-secondary hover:bg-secondary/10 px-5 py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Comment ça marche
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10 py-2 md:py-16 overflow-hidden">
        <div>
          <h2 className="text-xl md:text-3xl font-bold">
            Concours <span className="text-primary">disponibles</span>
          </h2>
          <p className="text-muted-foreground mt-2 ">
            Découvrez les concours ouverts et commencez votre enrôlement.
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  index * 100
                }%)`,
              }}
            >
              {concours.length > 0 &&
                concours.map((item: any, i: number) => (
                  <div
                    key={item.id ?? i}
                    className="
                      w-full 
                      sm:w-1/2 
                      lg:w-1/3 
                      flex-shrink-0 
                      px-3
                    "
                  >
                    <EntranceExamCard {...item} />
                  </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              title="previous entrance"
              onClick={prev}
              disabled={index === 0}
              className="cursor-pointer h-10 w-10 rounded-full border flex items-center justify-center
                        disabled:opacity-40 hover:bg-muted transition"
            >
              <ChevronLeft />
            </button>

            <button
              title="next entrance"
              onClick={next}
              disabled={index >= maxIndex}
              className="cursor-pointer h-10 w-10 rounded-full border flex items-center justify-center
                        disabled:opacity-40 hover:bg-muted transition"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      <section className="text-center space-y-6 py-2 md:py-16">
        <h2 className="text-3xl font-bold">
          Prêt à rejoindre votre <span className="text-primary">avenir</span> ?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Créez un compte et commencez votre enrôlement en quelques minutes.
        </p>
        <Button onClick={() => navigate(`/auth/register`)} size="lg" className="cursor-pointer bg-secondary hover:bg-secondary-hover">
          Créer un compte
        </Button>
      </section>
    </main>
  );
};

export default Home;
