import {
  SearchTrackingEvent,
  setSearchTrackingSink,
  trackSearch,
} from './analytics';

describe('trackSearch', () => {
  afterEach(() => setSearchTrackingSink(null));

  it('forwards the event to the configured sink', () => {
    const events: SearchTrackingEvent[] = [];
    setSearchTrackingSink(event => events.push(event));

    trackSearch({ query: 'bunny', resultCount: 1, inputMethod: 'voice' });

    expect(events).toEqual([
      { query: 'bunny', resultCount: 1, inputMethod: 'voice' },
    ]);
  });

  it('stays silent when no sink is configured', () => {
    setSearchTrackingSink(null);

    expect(() =>
      trackSearch({ query: 'steel', resultCount: 0, inputMethod: 'typed' }),
    ).not.toThrow();
  });

  it('stops reporting once the sink is cleared', () => {
    const events: SearchTrackingEvent[] = [];
    setSearchTrackingSink(event => events.push(event));
    setSearchTrackingSink(null);

    trackSearch({ query: 'angel', resultCount: 2, inputMethod: 'typed' });

    expect(events).toEqual([]);
  });
});
