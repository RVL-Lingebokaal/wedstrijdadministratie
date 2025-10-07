'use client';
import { useCallback, useEffect, useState } from 'react';
import { Time, WedstrijdIdProps } from '@models';
import { QUERY_PARAMS } from '@utils';

interface UseInitiateUpdatesProps extends WedstrijdIdProps {
  updateFunction: (values: Time[]) => void;
  isA: boolean;
  isStart: boolean;
}

export function useInitiateUpdates({
  isA,
  isStart,
  updateFunction,
  wedstrijdId,
}: UseInitiateUpdatesProps) {
  const [sseConnection, setSSEConnection] = useState<EventSource | null>(null);

  const listenToSSEUpdates = useCallback(() => {
    const eventSource = new EventSource(
      `/api/teams/time?${QUERY_PARAMS.isA}=${isA}&${QUERY_PARAMS.isStart}=${isStart}&${QUERY_PARAMS.wedstrijdId}=${wedstrijdId}`
    );
    eventSource.onopen = () => {
      console.log('SSE connection opened.');
    };

    eventSource.onmessage = (event) => {
      const times = JSON.parse(event.data);
      updateFunction(times);
    };

    setSSEConnection(eventSource);

    return eventSource;
  }, [isA, isStart]);

  useEffect(() => {
    if (sseConnection) {
      sseConnection.close();
    }
    listenToSSEUpdates();
    return () => {
      if (sseConnection) {
        sseConnection.close();
      }
    };
  }, [isA, isStart]);
}
