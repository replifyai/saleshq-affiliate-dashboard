import { useSnackbar as useSnackbarContext } from './snackbar-context';
import { SnackbarSeverity } from './snackbar-context';

interface ShowSnackbarOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useSnackbar() {
  const { addMessage, removeMessage, clearAll } = useSnackbarContext();

  const showSnackbar = (
    message: string,
    severity: SnackbarSeverity = 'info',
    options: ShowSnackbarOptions = {}
  ) => {
    addMessage({
      message,
      severity,
      duration: options.duration,
      action: options.action,
    });
  };

  const showSuccess = (message: string, options?: ShowSnackbarOptions) => {
    showSnackbar(message, 'success', options);
  };

  const showError = (message: string, options?: ShowSnackbarOptions) => {
    showSnackbar(message, 'error', options);
  };

  const showWarning = (message: string, options?: ShowSnackbarOptions) => {
    showSnackbar(message, 'warning', options);
  };

  const showInfo = (message: string, options?: ShowSnackbarOptions) => {
    showSnackbar(message, 'info', options);
  };

  return {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeMessage,
    clearAll,
  };
}