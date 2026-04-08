import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryMeta } from "@/data/content";
import { exerciseGuidance } from "@/data/exerciseGuidance";
import { exercises } from "@/data/workouts";
import type { CategoryId } from "@/types/domain";

const categories = Object.entries(categoryMeta) as Array<
  [CategoryId, (typeof categoryMeta)[CategoryId]]
>;

export function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("glutei_gambe");

  const filteredExercises = exercises.filter(
    (exercise) => exercise.category === activeCategory
  );

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow">Libreria allenamenti</div>
            <h1 className="mt-3 font-serif text-[1.95rem] leading-tight text-ink">
              Esercizi chiari, utili e facili da ritrovare.
            </h1>
          </div>
          <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
            <Search size={18} />
          </div>
        </div>
        <p className="mt-4 max-w-[20rem] text-sm leading-7 text-muted">
          Scegli una categoria e apri il dettaglio per leggere spiegazione,
          passi, errori comuni e varianti.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Categorie"
          title="Trova il focus giusto per oggi"
        />

        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map(([categoryId, category]) => {
            const isActive = activeCategory === categoryId;

            return (
              <button
                key={categoryId}
                type="button"
                onClick={() => setActiveCategory(categoryId)}
                className={[
                  "min-w-[220px] rounded-[24px] border px-4 py-4 text-left transition",
                  category.accent,
                  isActive
                    ? "border-accent bg-white shadow-lift"
                    : "border-line hover:border-accent/30"
                ].join(" ")}
              >
                <div className="text-sm font-semibold text-ink">{category.title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        {filteredExercises.map((exercise) => (
          <Link
            key={exercise.id}
            to={`/workouts/${exercise.id}`}
            className="surface flex items-center justify-between gap-4 px-4 py-4 transition hover:bg-white/80"
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink">{exercise.name}</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                {exerciseGuidance[exercise.id]?.summary ?? exercise.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">
                  {exercise.bodyArea}
                </span>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-deep">
                  {exercise.dose}
                </span>
              </div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-muted" />
          </Link>
        ))}
      </section>
    </div>
  );
}
