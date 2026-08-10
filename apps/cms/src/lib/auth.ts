import {
  API_BASE_URL,
  ApiError,
  clearStoredToken,
  isClerkMode,
  setStoredToken,
} from "./api";

export type AuthMode = "clerk" | "local";

export function authMode(): AuthMode {
  return isClerkMode() ? "clerk" : "local";
}

export interface LoginResult {
  token: string;
}

export async function loginLocal(
  username: string,
  password: string,
): Promise<LoginResult> {
  const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = (await res.json()) as { detail?: string; error?: string };
      message = body.detail ?? body.error ?? message;
    } catch {
      // keep default message
    }
    throw new ApiError(message, res.status);
  }

  const data = (await res.json()) as { access_token: string };
  setStoredToken(data.access_token);
  return { token: data.access_token };
}

export function logoutLocal(): void {
  clearStoredToken();
}

export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado";
}