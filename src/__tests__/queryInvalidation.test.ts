import { queryClient } from '../services/serverState/queryClient';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getAllKeys: jest.fn().mockResolvedValue([]), multiRemove: jest.fn(), setItem: jest.fn().mockResolvedValue(undefined),
}));

describe('real-time query invalidation', () => {
  beforeEach(async () => { await queryClient.clearAll(); });
  it('notifies active matching observers and removes subscriptions on unmount', () => {
    const matching = jest.fn(); const unrelated = jest.fn();
    const stop = queryClient.subscribeInvalidation(['sessions', 'active'], matching);
    const stopOther = queryClient.subscribeInvalidation(['profile'], unrelated);
    queryClient.invalidateQueries(['sessions']);
    expect(matching).toHaveBeenCalledTimes(1); expect(unrelated).not.toHaveBeenCalled();
    stop(); queryClient.invalidateQueries(['sessions']);
    expect(matching).toHaveBeenCalledTimes(1); stopOther();
  });
  it('re-fetches after an older in-flight response instead of keeping stale session state', async () => {
    let resolve!: (value: string) => void;
    const fetcher = jest.fn().mockImplementationOnce(() => new Promise<string>(done => { resolve = done; }))
      .mockResolvedValueOnce('completed');
    const first = queryClient.fetchQuery(['sessions'], fetcher);
    const refreshed = queryClient.refetchQuery(['sessions'], fetcher);
    resolve('active');
    await first;
    await expect(refreshed).resolves.toBe('completed');
    expect(queryClient.getQueryData(['sessions'])).toBe('completed');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
