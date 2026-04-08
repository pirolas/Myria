import type { AuthResponse, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, requireSupabaseClient } from "@/lib/supabase";

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function getCurrentSession() {
  const client = getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data } = await client.auth.getSession();
  return data.session;
}

export function listenToAuthState(
  callback: (session: Session | null) => void
) {
  const client = getSupabaseClient();

  if (!client) {
    return () => undefined;
  }

  const {
    data: { subscription }
  } = client.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => subscription.unsubscribe();
}

export async function signInWithPassword(credentials: AuthCredentials) {
  const client = requireSupabaseClient();
  const response = await client.auth.signInWithPassword(credentials);
  return normalizeAuthResponse(response);
}

export async function signUpWithPassword(credentials: AuthCredentials) {
  const client = requireSupabaseClient();
  const response = await client.auth.signUp(credentials);
  return normalizeAuthResponse(response);
}

export async function signInWithGoogle() {
  const client = requireSupabaseClient();
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth`
      : undefined;

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const client = requireSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

function normalizeAuthResponse(response: AuthResponse) {
  if (response.error) {
    throw response.error;
  }

  return {
    session: response.data.session,
    user: response.data.user as User | null
  };
}
