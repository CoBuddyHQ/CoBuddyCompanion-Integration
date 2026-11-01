import { SessionTerminalTransitionGuard } from '../utils/sessionTerminalTransition';

describe('SessionTerminalTransitionGuard', () => {
  it('allows one navigation when the requested session reaches a terminal state', () => {
    const guard = new SessionTerminalTransitionGuard();
    guard.reset('session-1');

    expect(guard.claim('session-1', 'active')).toBe(false);
    expect(guard.claim('session-1', 'completed')).toBe(true);
    expect(guard.claim('session-1', 'completed')).toBe(false);
  });

  it('recognizes an early end and resets for a different session', () => {
    const guard = new SessionTerminalTransitionGuard();
    guard.reset('session-1');
    expect(guard.claim('session-1', 'ended_early')).toBe(true);

    guard.reset('session-2');
    expect(guard.claim('session-2', 'cancelled')).toBe(true);
  });

  it('does not claim a transition for a different session id', () => {
    const guard = new SessionTerminalTransitionGuard();
    guard.reset('session-1');

    expect(guard.claim('session-2', 'completed')).toBe(false);
  });
});
