import { BellRing, ChevronRight, LogOut, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  ageBandLabels,
  energyLabels,
  goalLabels,
  levelLabels,
  limitationLabels
} from "@/data/content";
import { useAuth } from "@/hooks/useAuth";
import { useMiryaApp } from "@/hooks/useMiryaApp";

export function ProfilePage() {
  const navigate = useNavigate();
  const { signOutUser } = useAuth();
  const { data, regeneratePlan, setTimerSoundEnabled, status } = useMiryaApp();

  if (!data?.onboarding) {
    return null;
  }

  const onboarding = data.onboarding;
  const timerSoundEnabled = data.preferences?.timerSoundEnabled ?? true;

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/", { replace: true });
  };

  return (
    <div className="page-enter space-y-6">
      <section className="surface-strong px-5 py-6">
        <div className="eyebrow">Il mio percorso</div>
        <h1 className="mt-3 font-serif text-[2rem] leading-tight text-ink">
          Un profilo semplice, costruito per guidarti meglio.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Qui rivedi le tue preferenze, il focus attuale e le impostazioni utili
          alla beta.
        </p>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Le tue basi attuali</div>
        <div className="mt-4 space-y-3">
          {[
            ["Fascia d'eta", ageBandLabels[onboarding.ageBand]],
            ["Livello percepito", levelLabels[onboarding.perceivedLevel]],
            ["Obiettivo principale", goalLabels[onboarding.primaryGoal]],
            ["Focus del percorso", goalLabels[onboarding.focusPreference]],
            ["Ritmo", `${onboarding.daysPerWeek} giorni a settimana`],
            ["Durata preferita", `${onboarding.preferredMinutes} minuti`],
            ["Energia media", energyLabels[onboarding.energyLevel]],
            [
              "Partenza",
              onboarding.gentleStart ? "Molto delicata" : "Delicata ma attiva"
            ]
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-[22px] border border-line bg-white/78 px-4 py-4"
            >
              <div className="text-sm text-muted">{label}</div>
              <div className="text-sm font-semibold text-ink">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Attenzioni segnalate</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {onboarding.limitations.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-muted"
            >
              {limitationLabels[item]}
            </span>
          ))}
        </div>
        {onboarding.notes ? (
          <p className="mt-4 text-sm leading-6 text-muted">{onboarding.notes}</p>
        ) : null}
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Preferenze beta</div>

        <button
          type="button"
          onClick={() => void setTimerSoundEnabled(!timerSoundEnabled)}
          className="mt-4 flex w-full items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            {timerSoundEnabled ? (
              <Volume2 size={18} className="text-accent-deep" />
            ) : (
              <VolumeX size={18} className="text-accent-deep" />
            )}
            <div>
              <div className="text-sm font-semibold text-ink">Suoni del timer</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Piccoli segnali sonori durante countdown e cambi di step.
              </p>
            </div>
          </div>
          <div className="text-sm font-semibold text-accent-deep">
            {timerSoundEnabled ? "On" : "Off"}
          </div>
        </button>

        <div className="mt-3 flex items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4">
          <div className="flex items-center gap-3">
            <BellRing size={18} className="text-accent-deep" />
            <div>
              <div className="text-sm font-semibold text-ink">Promemoria</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Struttura pronta per reminder e riepiloghi settimanali.
              </p>
            </div>
          </div>
          <div className="text-sm font-semibold text-muted">Beta</div>
        </div>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Azioni utili</div>
        <div className="mt-4 space-y-3">
          <Link
            to="/onboarding"
            className="flex items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4"
          >
            <div>
              <div className="text-sm font-semibold text-ink">Rivedi il percorso iniziale</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Aggiorna onboarding, focus e ritmo se il momento e cambiato.
              </p>
            </div>
            <ChevronRight size={18} className="text-accent-deep" />
          </Link>

          <button
            type="button"
            onClick={() => void regeneratePlan("weekly_refresh")}
            className="flex w-full items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4 text-left"
          >
            <div>
              <div className="text-sm font-semibold text-ink">Ricalcola il piano</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Rigenera la settimana guidata con i dati piu recenti.
              </p>
            </div>
            <RefreshCw size={18} className="text-accent-deep" />
          </button>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleSignOut}
            disabled={status === "saving"}
            icon={<LogOut size={18} />}
          >
            Esci da Mirya
          </Button>
        </div>
      </section>
    </div>
  );
}
