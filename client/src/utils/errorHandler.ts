import { useSnackbar } from "../context/SnackbarContext";

export const useErrorHandler = () => {
  const { showSnackbar } = useSnackbar();
  
  const handleError = (error: any) => {
    let errorMessage = "An unexpected error occurred";
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    showSnackbar(errorMessage, "error");
  };
  
  return { handleError };
};