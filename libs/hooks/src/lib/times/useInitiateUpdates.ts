import { useCallback, useEffect, useState } from 'react';
import { Time } from '@models';

export function useInitiateUpdates(updateFunction: (values: Time[]) => void) {
  const [sseConnection, setSSEConnection] = useState<EventSource | null>(null);

  const listenToSSEUpdates = useCallback(() => {
    const eventSource = new EventSource('/api/teams/time');
    eventSource.onopen = () => {
      console.log('SSE connection opened.');
    };

    eventSource.onmessage = (event) => {
      const times = JSON.parse(event.data);
      updateFunction(times);
    };

    setSSEConnection(eventSource);

    return eventSource;
  }, []);

  useEffect(() => {
    listenToSSEUpdates();
    return () => {
      if (sseConnection) {
        sseConnection.close();
      }
    };
  }, []);
}
