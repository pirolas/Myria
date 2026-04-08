import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { brand } from "@/data/content";

const promises = [
  "Raccoglie le tue esigenze iniziali in pochi passaggi chiari.",
  "Ti assegna il workout di oggi senza farti scegliere da sola.",
  "Adatta il percorso in base a costanza, feedback e giorni reali."
];

export function WelcomePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] px-4 pb-10 pt-4">
      <div className="page-enter space-y-6">
        <section className="surface-strong soft-gradient relative overflow-hidden px-5 py-6">
          <div className="absolute right-[-2rem] top-8 h-32 w-32 rounded-full border border-white/70 bg-[rgba(255,255,255,0.36)]" />
          <div className="absolute bottom-0 right-0 h-48 w-40 rounded-tl-[4rem] bg-[rgba(94,184,178,0.12)]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <div className="eyebrow">Beta guidata</div>
              <div className="rounded-full bg-white/85 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-deep">
                Mirya
              </div>
            </div>

            <h1 className="mt-4 max-w-[15rem] font-serif text-[2.35rem] leading-[1] text-ink">
              Tonificazione a casa, guidata con calma e pensata per te.
            </h1>
            <p className="mt-4 max-w-[21rem] text-sm leading-7 text-muted">
              {brand.longPitch}
            </p>

            <div className="mt-6 rounded-[26px] border border-white/75 bg-[rgba(255,255,255,0.82)] px-4 py-4 shadow-[0_16px_40px_rgba(72,102,103,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="eyebrow text-accent-deep">Il cuore del prodotto</div>
                  <div className="mt-2 text-lg font-semibold text-ink">
                    Non devi capire tu come allenarti.
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Mirya costruisce il tuo percorso iniziale, ti mostra il focus
                    della fase e ti accompagna seduta dopo seduta.
                  </p>
                </div>
                <div className="rounded-[1.2rem] bg-accent-soft p-3 text-accent-deep">
                  <Sparkles size={18} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Link to="/auth">
                <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
                  Crea il tuo percorso
                </Button>
              </Link>
            </div>

            <p className="mt-3 text-center text-sm leading-6 text-muted">
              Bastano pochi minuti per partire con una base realistica.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          {promises.map((item) => (
            <div key={item} className="surface flex items-start gap-4 px-4 py-4">
              <div className="rounded-full bg-[rgba(215,239,236,0.72)] p-2 text-accent-deep">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-sm leading-7 text-muted">{item}</p>
            </div>
          ))}
        </section>

        <section className="surface px-5 py-5">
          <div className="eyebrow">Pensata per la vita vera</div>
          <p className="mt-3 text-sm leading-7 text-ink">
            Sessioni da 10 a 25 minuti, focus su gambe, glutei, core profondo,
            postura e tonicita generale. Nessuna palestra, nessun linguaggio
            aggressivo, nessuna confusione.
          </p>
        </section>
      </div>
    </div>
  );
}
