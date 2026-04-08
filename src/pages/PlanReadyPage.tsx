import { ArrowRight, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import { getTrialStatusCopy } from "@/lib/mirya";

export function PlanReadyPage() {
  const { data } = useMiryaApp();

  if (!data?.activePlan || !data.userAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong soft-gradient px-5 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-[16rem]">
            <div className="eyebrow">Il tuo piano è pronto</div>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
              Hai già una direzione chiara da seguire.
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Mirya ha composto il tuo primo percorso personale. Adesso puoi leggerlo,
              capire perché parte così e iniziare il mini-ciclo gratuito.
            </p>
          </div>
          <div className="rounded-[1.3rem] bg-white/82 p-3 text-accent-deep">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="mt-5 rounded-[22px] bg-white/82 px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Accesso gratuito iniziale
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">
            {getTrialStatusCopy(data.userAccess)}
          </p>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Cosa puoi fare da subito</div>
        <div className="mt-4 space-y-3">
          {[
            "Vedere il tuo primo piano personalizzato e la logica con cui è stato costruito.",
            "Usare il timer guidato e completare il primo mini-ciclo.",
            "Salvare sessioni, progressi base e feedback finali."
          ].map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-line bg-white/78 px-4 py-4 text-sm leading-6 text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Link to="/plan/story" className="flex-1">
          <Button variant="secondary" fullWidth>
            Perché questo piano
          </Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth icon={<ArrowRight size={18} />} className="justify-between">
            Vai al tuo oggi
          </Button>
        </Link>
      </div>
    </div>
  );
}




