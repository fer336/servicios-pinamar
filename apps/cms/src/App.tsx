import { useEffect, useState } from "react";
import type React from "react";
import { clearStoredToken, hasStoredToken } from "./lib/api";
import { Dashboard } from "./components/Dashboard";
import { LoginGoogle } from "./components/LoginGoogle";
import { ToastHost } from "./components/Toast";
import { consumeOAuthRedirect } from "./lib/auth";

function LocalGate(): React.JSX.Element {
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const result = consumeOAuthRedirect();
    setAuthed(result.authenticated || hasStoredToken());
    setLoginError(result.error);
  }, []);

  if (!authed) {
    return <LoginGoogle error={loginError} />;
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
  return (
    <>
      <LocalGate />
      <ToastHost />
    </>
  );
}
