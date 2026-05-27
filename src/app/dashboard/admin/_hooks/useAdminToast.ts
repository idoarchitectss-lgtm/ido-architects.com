import { toast } from "sonner";

export function useAdminToast() {
  const success = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  };

  const error = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  };

  const loading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (id?: string | number) => {
    toast.dismiss(id);
  };

  const promise = <T,>(
    promiseFn: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return toast.promise(promiseFn, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  };

  return { success, error, loading, dismiss, promise };
}
