import { ArrowRight, Dot } from "lucide-react";
import { exerciseGuidance } from "@/data/exerciseGuidance";

interface ExerciseFigureProps {
  exerciseId: string;
}

export function ExerciseFigure({ exerciseId }: ExerciseFigureProps) {
  const guidance = exerciseGuidance[exerciseId];

  if (!guidance) {
    return null;
  }

  const startNotes = compactVisualNotes(guidance.startingPosition, 2);
  const moveNotes = compactVisualNotes(guidance.movementCue, 2);

  return (
    <section className="rounded-[24px] border border-line bg-[rgba(255,255,255,0.84)] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Schema rapido
          </div>
          <div className="mt-1 text-sm font-semibold text-ink">{guidance.purpose}</div>
        </div>
        <div className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
          Due passaggi chiave
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
        <VisualBlock
          stepNumber="1"
          title="Parti così"
          label={guidance.visual.startLabel}
          notes={startNotes}
        />

        <div className="flex items-center justify-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(215,239,236,0.82)] text-accent-deep">
            <ArrowRight size={18} />
          </div>
        </div>

        <VisualBlock
          stepNumber="2"
          title="Poi fai questo"
          label={guidance.visual.moveLabel}
          notes={moveNotes}
        />
      </div>

      <div className="mt-4 rounded-[18px] bg-[rgba(244,249,248,0.92)] px-4 py-3">
        <div className="text-sm font-semibold text-ink">Cosa tenere a mente</div>
        <p className="mt-2 text-sm leading-6 text-muted">{guidance.returnCue}</p>
      </div>
    </section>
  );
}

function VisualBlock({
  stepNumber,
  title,
  label,
  notes
}: {
  stepNumber: string;
  title: string;
  label: string;
  notes: string[];
}) {
  return (
    <div className="rounded-[20px] bg-[rgba(244,249,248,0.95)] px-3 py-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-accent-deep">
          {stepNumber}
        </span>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
          {title}
        </div>
      </div>
      <div className="mt-3 rounded-[16px] bg-white px-3 py-3">
        <div className="text-sm font-semibold leading-5 text-ink">{label}</div>
        <div className="mt-3 space-y-2">
          {notes.map((note) => (
            <div key={note} className="flex items-start gap-2">
              <Dot size={18} className="-ml-1 mt-0.5 shrink-0 text-accent-deep" />
              <p className="text-xs leading-5 text-muted">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function compactVisualNotes(text: string, limit: number) {
  return text
    .split(/,| e | senza /)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}
