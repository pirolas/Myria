import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";
import {
  getCurrentSession,
  listenToAuthState,
  signInWithPassword,
  signInWithGoogle,
  signOut,
  signUpWithPassword,
  type AuthCredentials
} from "@/services/auth";

type AuthStatus = "loading" | "signed_out" | "signed_in" | "missing_config";

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  isConfigured: boolean;
  signIn: (credentials: AuthCredentials) => Promise<{ requiresConfirmation: boolean }>;
  signUp: (credentials: AuthCredentials) => Promise<{ requiresConfirmation: boolean }>;
  signInWithGoogleProvider: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [status, setStatus] = useState<AuthStatus>(
    configured ? "loading" : "missing_config"
  );
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!configured) {
      setStatus("missing_config");
      setSession(null);
      setUser(null);
      return;
    }

    let isMounted = true;

    getCurrentSession()
      .then((currentSession) => {
        if (!isMounted) {
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setStatus(currentSession?.user ? "signed_in" : "signed_out");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setStatus("signed_out");
      });

    const unsubscribe = listenToAuthState((nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setStatus(nextSession?.user ? "signed_in" : "signed_out");
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user,
      isConfigured: configured,
      async signIn(credentials) {
        const result = await signInWithPassword(credentials);
        return {
          requiresConfirmation: !result.session
        };
      },
      async signUp(credentials) {
        const result = await signUpWithPassword(credentials);
        return {
          requiresConfirmation: !result.session
        };
      },
      async signInWithGoogleProvider() {
        await signInWithGoogle();
      },
      async signOutUser() {
        await signOut();
      }
    }),
    [configured, session, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve essere usato dentro AuthProvider.");
  }

  return context;
}
