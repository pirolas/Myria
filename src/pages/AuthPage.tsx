import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { brand } from "@/data/content";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "signin" | "signup";

export function AuthPage() {
  const navigate = useNavigate();
  const { status, signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const pageCopy = useMemo(
    () =>
      mode === "signup"
        ? {
            title: "Crea il tuo spazio Myria",
            description:
              "Apri il tuo account per ricevere un percorso guidato e personale."
          }
        : {
            title: "Rientra nel tuo percorso",
            description:
              "Riprendi da dove eri rimasta, con il workout di oggi gia pronto."
          },
    [mode]
  );

  if (status === "signed_in") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const result =
        mode === "signup"
          ? await signUp({ email, password })
          : await signIn({ email, password });

      if (result.requiresConfirmation && mode === "signup") {
        setMessage(
          "Account creato. Se hai attivato la conferma email in Supabase, controlla la casella di posta per completare l'accesso."
        );
        return;
      }

      navigate("/", { replace: true });
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Non siamo riusciti a completare l'accesso."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[440px] px-4 pb-10 pt-4">
      <div className="page-enter space-y-6">
        <section className="surface-strong soft-gradient px-5 py-6">
          <div className="eyebrow">Accesso beta</div>
          <h1 className="mt-3 font-serif text-[2.05rem] leading-tight text-ink">
            {pageCopy.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            {pageCopy.description}
          </p>

          <div className="mt-5 flex gap-2 rounded-full bg-[rgba(255,255,255,0.72)] p-1">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={[
                "flex-1 rounded-full px-4 py-3 text-sm font-semibold transition",
                mode === "signup"
                  ? "bg-white text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              ].join(" ")}
            >
              Crea account
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={[
                "flex-1 rounded-full px-4 py-3 text-sm font-semibold transition",
                mode === "signin"
                  ? "bg-white text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              ].join(" ")}
            >
              Accedi
            </button>
          </div>
        </section>

        {!isConfigured ? (
          <section className="surface px-5 py-5">
            <div className="text-base font-semibold text-ink">
              Configura Supabase per usare la beta reale
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">
              Inserisci `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nelle env
              del frontend. Senza queste chiavi Myria non puo creare account,
              salvare progressi o generare piani personalizzati.
            </p>
          </section>
        ) : (
          <section className="surface px-5 py-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Email
              </span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded-[18px] border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
                placeholder="nome@email.it"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Password
              </span>
              <input
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-12 w-full rounded-[18px] border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent"
                placeholder="Almeno 6 caratteri"
              />
            </label>

            {error ? (
              <div className="mt-4 rounded-[18px] bg-[rgba(183,98,98,0.1)] px-4 py-3 text-sm leading-6 text-[rgba(116,63,63,0.96)]">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-4 rounded-[18px] bg-[rgba(94,184,178,0.12)] px-4 py-3 text-sm leading-6 text-accent-deep">
                {message}
              </div>
            ) : null}

            <div className="mt-5">
              <Button
                fullWidth
                onClick={handleSubmit}
                disabled={isSubmitting || email.trim().length === 0 || password.length < 6}
              >
                {isSubmitting
                  ? "Un attimo..."
                  : mode === "signup"
                    ? "Entra nella beta"
                    : "Accedi a Myria"}
              </Button>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {brand.name} salva onboarding, percorso, progressi e feedback in modo
              personale e riservato.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
