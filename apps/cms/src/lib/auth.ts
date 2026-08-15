import { API_BASE_URL, clearStoredToken, setStoredToken } from "./api";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  email_not_allowed: "Este email no está autorizado para administrar el sitio.",
  email_not_verified: "Google no confirmó este email. Verificá tu cuenta e intentá de nuevo.",
  google_denied: "No se pudo completar el ingreso con Google.",
  invalid_id_token: "Google no pudo validar tu identidad. Intentá nuevamente.",
  invalid_state: "La sesión de ingreso venció. Intentá nuevamente.",
  missing_code: "Google no devolvió el código de ingreso. Intentá nuevamente.",
  missing_allowlist: "El servidor no tiene configurado el email autorizado.",
  missing_google_client_id: "El servidor no tiene configurado Google OAuth.",
  missing_google_client_secret: "El servidor no tiene configurado Google OAuth.",
  missing_google_redirect_uri: "El servidor no tiene configurado Google OAuth.",
  missing_jwt_secret: "El servidor no tiene configurada la firma del token.",
  missing_id_token: "Google no devolvió la identidad de la cuenta.",
  oauth_failed: "No se pudo completar el ingreso con Google. Intentá nuevamente.",
};

export interface OAuthRedirectResult {
  authenticated: boolean;
  error: string | null;
}

export function startGoogleOAuth(): void {
  window.location.assign(`${API_BASE_URL}/api/admin/google/start`);
}

export function consumeOAuthRedirect(): OAuthRedirectResult {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (!hash) return { authenticated: false, error: null };

  const params = new URLSearchParams(hash);
  const token = params.get("access_token");
  const errorCode = params.get("error");

  if (token) {
    setStoredToken(token);
    cleanUrl();
    return { authenticated: true, error: null };
  }

  if (errorCode) {
    cleanUrl();
    return {
      authenticated: false,
      error: OAUTH_ERROR_MESSAGES[errorCode] ?? "No se pudo iniciar sesión con Google.",
    };
  }

  return { authenticated: false, error: null };
}

export function logoutLocal(): void {
  clearStoredToken();
}

export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}

function cleanUrl(): void {
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}`,
  );
}
