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

  const show = ({
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
  };

  const success = (title: string, description?: string) =>
    show({ title, description, action: 'success' });

  const error = (title: string, description?: string) =>
    show({ title, description, action: 'error' });

  const warning = (title: string, description?: string) =>
    show({ title, description, action: 'warning' });

  const info = (title: string, description?: string) =>
    show({ title, description, action: 'info' });

  return { show, success, error, warning, info };
};
