import { ClerkProvider, useAuth, useClerk } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import type React from "react";
import {
  clearStoredToken,
  hasStoredToken,
  isClerkMode,
  setTokenProvider,
} from "./lib/api";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { LoginLocal } from "./components/LoginLocal";
import { FullSpinner } from "./components/Spinner";
import { ToastHost } from "./components/Toast";

function ClerkGate(): React.JSX.Element {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isSignedIn) {
      setTokenProvider(async () => (await getToken()) ?? null);
    } else {
      setTokenProvider(() => Promise.resolve(null));
    }
  }, [isSignedIn, getToken]);

  if (!isLoaded) {
    return <FullSpinner label="Cargando autenticación…" />;
  }

  if (!isSignedIn) {
    return <Login />;
  }

  return (
    <Dashboard
      onLogout={() => {
        void signOut();
      }}
    />
  );
}

function ClerkCallback(): React.JSX.Element {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      window.location.replace("/");
      return;
    }

    void clerk.handleRedirectCallback({
      signInFallbackRedirectUrl: "/",
      signUpFallbackRedirectUrl: "/",
    });
  }, [clerk, isLoaded, isSignedIn]);

  return <FullSpinner label="Completando autenticación…" />;
}

function LocalGate(): React.JSX.Element {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(hasStoredToken());
  }, []);

  if (!authed) {
    return <LoginLocal onSuccess={() => setAuthed(true)} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        clearStoredToken();
        setAuthed(false);
      }}
    />
  );
}

export default function App(): React.JSX.Element {
  if (isClerkMode()) {
    return (
      <>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!}
        >
          {window.location.pathname === "/sso-callback" ? (
            <ClerkCallback />
          ) : (
            <ClerkGate />
          )}
        </ClerkProvider>
        <ToastHost />
      </>
    );
  }

  return (
    <>
      <LocalGate />
      <ToastHost />
    </>
  );
}
