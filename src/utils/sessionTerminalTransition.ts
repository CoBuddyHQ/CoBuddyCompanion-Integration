const TERMINAL_SESSION_STATUSES = new Set(['completed', 'cancelled', 'ended_early']);

/** Prevent duplicate terminal navigation when a poll races with a user action. */
export class SessionTerminalTransitionGuard {
  private sessionId: string | null = null;
  private navigationClaimed = false;

  reset(sessionId: string): void {
    if (this.sessionId !== sessionId) {
      this.sessionId = sessionId;
      this.navigationClaimed = false;
    }
  }

  claim(sessionId: string, status: string | undefined): boolean {
    if (this.sessionId !== sessionId || !status || !TERMINAL_SESSION_STATUSES.has(status)) {
      return false;
    }
    if (this.navigationClaimed) return false;
    this.navigationClaimed = true;
    return true;
  }
}
