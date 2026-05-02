import { createActor } from "@/backend";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";

/**
 * Core backend hook — provides actor and identity helpers.
 * All domain hooks build on this.
 */
export function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();

  const principal = identity?.getPrincipal() ?? null;
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return {
    actor,
    isFetching,
    login,
    logout: clear,
    loginStatus,
    identity,
    principal,
    isLoggedIn,
    isLoggingIn,
    isInitializing,
  };
}
