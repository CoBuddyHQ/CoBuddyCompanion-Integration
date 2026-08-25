/**
 * CoBuddy Companion — useFlowTracker Hook
 *
 * Automatically:
 *  - Records the active screen name on mount for instant resume on reload.
 *  - Provides a safe `executeStep` action handler for API gating, loading, and error recovery.
 */

import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { FlowTracker, type FlowType } from '../services/flowTracker';

interface UseFlowTrackerOptions {
  flow: FlowType;
  screenName: string;
}

export function useFlowTracker({ flow, screenName }: UseFlowTrackerOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Record active screen whenever screen mounts
    FlowTracker.saveActiveScreen(screenName);
    FlowTracker.log(flow, screenName, 'VIEW_SCREEN', 'START');
  }, [flow, screenName]);

  /**
   * Execute an API step with loading indicator, error alert with retry, and success callback
   */
  const executeStep = useCallback(
    async (
      actionName: string,
      apiCall: () => Promise<any>,
      onSuccess: (result: any) => void | Promise<void>,
      options?: {
        errorMessage?: string;
        onFailure?: (error: any) => void;
      }
    ) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      FlowTracker.log(flow, screenName, actionName, 'START');

      try {
        const result = await apiCall();
        FlowTracker.log(flow, screenName, actionName, 'SUCCESS', result);
        await onSuccess(result);
      } catch (error: any) {
        FlowTracker.log(flow, screenName, actionName, 'FAILURE', error);
        if (options?.onFailure) {
          options.onFailure(error);
        } else {
          Alert.alert(
            'Unable to Save',
            options?.errorMessage ||
              error?.message ||
              'Could not save your changes. Please check your connection and try again.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Retry',
                onPress: () => executeStep(actionName, apiCall, onSuccess, options),
              },
            ]
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [flow, screenName, isSubmitting]
  );

  return {
    isSubmitting,
    executeStep,
  };
}
