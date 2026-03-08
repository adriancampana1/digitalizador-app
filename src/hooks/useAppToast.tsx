import { useCallback } from 'react';

import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/components/ui/toast';

type ToastOptions = 'success' | 'error' | 'warning' | 'info';

type ShowToastPropsType = {
  title: string;
  description?: string;
  action?: ToastOptions;
  duration?: number;
};

export const useAppToast = () => {
  const toast = useToast();

  const show = useCallback(
    ({
      title,
      description,
      action = 'info',
      duration = 3000,
    }: ShowToastPropsType) => {
      toast.show({
        placement: 'top',
        duration,
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action={action} variant="solid">
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
          </Toast>
        ),
      });
    },
    [toast]
  );

  const success = useCallback(
    (title: string, description?: string) =>
      show({ title, description, action: 'success' }),
    [show]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      show({ title, description, action: 'error' }),
    [show]
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      show({ title, description, action: 'warning' }),
    [show]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      show({ title, description, action: 'info' }),
    [show]
  );

  return { show, success, error, warning, info };
};
