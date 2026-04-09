import { BellRing, ChevronRight, Crown, LogOut, Volume2, VolumeX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  ageBandLabels,
  energyLabels,
  focusAreaLabels,
  goalLabels,
  levelLabels,
  limitationLabels,
  primaryBodyGoalLabels
} from "@/data/content";
import { useAuth } from "@/hooks/useAuth";
import { useMiryaApp } from "@/hooks/useMiryaApp";
import {
  formatComputedBodyGoalLabelValue,
  formatLifestyleLabelValue,
  formatNaturalList,
  formatSleepQualityLabelValue,
  formatStressLabelValue,
  formatTimePreferenceLabelValue,
  formatWeeklyAvailabilityLabelValue
} from "@/lib/formatters";
import { getTrialStatusCopy } from "@/lib/mirya";

export function ProfilePage() {
  const navigate = useNavigate();
  const { signOutUser } = useAuth();
  const { data, setTimerSoundEnabled, status } = useMiryaApp();

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
          Qui rivedi le tue preferenze, la lettura del tuo momento e le impostazioni
          utili alla beta.
        </p>
      </section>

      <section className="surface px-5 py-5">
        <div className="text-base font-semibold text-ink">Le tue basi attuali</div>
        <div className="mt-4 space-y-3">
          {[
            ["Nome", onboarding.fullName || "Non indicato"],
            ["Fascia d'età", ageBandLabels[onboarding.ageBand]],
            ["Livello percepito", levelLabels[onboarding.perceivedLevel]],
            ["Obiettivo principale", primaryBodyGoalLabels[onboarding.primaryBodyGoal]],
            [
              "Lettura corporea",
              formatComputedBodyGoalLabelValue(onboarding.computedBodyGoal)
            ],
            [
              "Obiettivi secondari",
              formatNaturalList(
                onboarding.secondaryObjectives.map((goal) => secondaryObjectiveToLabel(goal))
              )
            ],
            [
              "Focus ricavato dal profilo",
              formatNaturalList(onboarding.focusAreas.map((focus) => focusAreaLabels[focus]))
            ],
            ["Focus del percorso", goalLabels[onboarding.focusPreference]],
            ["Ritmo", `${onboarding.daysPerWeek} giorni a settimana`],
            ["Durata preferita", `${onboarding.preferredMinutes} minuti`],
            ["Energia media", energyLabels[onboarding.energyLevel]],
            ["Stile di vita", formatLifestyleLabelValue(onboarding.lifestyle)],
            ["Sonno percepito", formatSleepQualityLabelValue(onboarding.sleepQuality)],
            ["Stress percepito", formatStressLabelValue(onboarding.stressLevel)],
            [
              "Disponibilità reale",
              formatWeeklyAvailabilityLabelValue(onboarding.weeklyAvailability)
            ],
            [
              "Orario preferito",
              formatTimePreferenceLabelValue(onboarding.preferredTimeOfDay)
            ],
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
              <div className="text-right text-sm font-semibold text-ink">{value}</div>
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
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent-soft p-3 text-accent-deep">
            <Crown size={18} />
          </div>
          <div>
            <div className="text-base font-semibold text-ink">Stato accesso</div>
            <p className="mt-1 text-sm leading-6 text-muted">
              {getTrialStatusCopy(data.userAccess)}
            </p>
          </div>
        </div>
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
            to="/profile/deep"
            className="flex items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4"
          >
            <div>
              <div className="text-sm font-semibold text-ink">Rendi il piano più personale</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Aggiungi dettagli opzionali su ritmo reale, segnali del corpo e stile di allenamento.
              </p>
            </div>
            <ChevronRight size={18} className="text-accent-deep" />
          </Link>

          <Link
            to="/onboarding"
            className="flex items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4"
          >
            <div>
              <div className="text-sm font-semibold text-ink">Rivedi il percorso iniziale</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Aggiorna onboarding, focus e ritmo se il momento è cambiato.
              </p>
            </div>
            <ChevronRight size={18} className="text-accent-deep" />
          </Link>

          <Link
            to="/plan/update"
            className="flex items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4"
          >
            <div>
              <div className="text-sm font-semibold text-ink">Ricalcola il piano</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Aggiorna il percorso oppure scopri come funziona la continuità Premium.
              </p>
            </div>
            <ChevronRight size={18} className="text-accent-deep" />
          </Link>

          <Link
            to={data.userAccess?.status === "premium" ? "/reassessment" : "/premium"}
            className="flex items-center justify-between rounded-[22px] border border-line bg-white/78 px-4 py-4"
          >
            <div>
              <div className="text-sm font-semibold text-ink">Compila una rivalutazione</div>
              <p className="mt-1 text-sm leading-6 text-muted">
                Se il piano è cambiato rispetto a come ti senti oggi, aggiornalo con pochi tocchi.
              </p>
            </div>
            <ChevronRight size={18} className="text-accent-deep" />
          </Link>

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

function secondaryObjectiveToLabel(value: string) {
  return {
    glutei_piu_sodi: "Glutei più sodi",
    gambe_piu_toniche: "Gambe più toniche",
    addome_piu_stabile: "Addome più stabile",
    postura_migliore: "Postura migliore",
    piu_energia: "Più energia",
    meno_flaccidita: "Sentirti meno flaccida",
    piu_forza: "Sentirti più forte",
    maggiore_costanza: "Maggiore costanza",
    ridurre_rigidita: "Ridurre rigidità",
    migliorare_mobilita: "Migliorare mobilità"
  }[value] ?? value;
}
