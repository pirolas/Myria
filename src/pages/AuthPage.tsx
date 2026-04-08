import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { brand } from "@/data/content";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "signin" | "signup";

export function AuthPage() {
  const navigate = useNavigate();
  const { status, signIn, signUp, signInWithGoogleProvider, isConfigured } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await signInWithGoogleProvider();
      setMessage("Ti stiamo portando su Google per completare l'accesso.");
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Non siamo riusciti ad avviare l'accesso con Google."
      );
      setIsGoogleSubmitting(false);
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
            <div className="space-y-3">
              <Button
                fullWidth
                variant="secondary"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSubmitting || isSubmitting}
                icon={<GoogleIcon />}
                className="border-[rgba(108,162,158,0.22)] bg-white text-ink"
              >
                {isGoogleSubmitting ? "Apertura di Google..." : "Continua con Google"}
              </Button>

              <p className="text-sm leading-6 text-muted">
                Il modo piu rapido per entrare in Myria e ritrovare subito il tuo
                percorso personale.
              </p>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted">
                oppure con email
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>

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

            <p className="mt-3 text-xs leading-6 text-muted">
              Per usare Google, attiva il provider Google nelle impostazioni Auth
              di Supabase e aggiungi questo URL tra i redirect consentiti:{" "}
              <span className="font-semibold text-ink">{window.location.origin}/auth</span>
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.4a4.62 4.62 0 0 1-2 3.03v2.52h3.24c1.9-1.75 2.96-4.33 2.96-7.54Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.24-2.52c-.9.6-2.05.96-3.37.96-2.59 0-4.78-1.75-5.57-4.1H3.08v2.58A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.43 13.91A5.98 5.98 0 0 1 6.12 12c0-.66.11-1.3.31-1.91V7.51H3.08A9.99 9.99 0 0 0 2 12c0 1.61.39 3.13 1.08 4.49l3.35-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.78.5 3.82 1.48l2.86-2.86C16.95 2.98 14.7 2 12 2a9.98 9.98 0 0 0-8.92 5.51l3.35 2.58c.79-2.35 2.98-4.11 5.57-4.11Z"
      />
    </svg>
  );
}
