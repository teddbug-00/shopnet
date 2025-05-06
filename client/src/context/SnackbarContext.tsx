import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { Snackbar, SnackbarType } from "../components/common/Snackbar";
import { AnimatePresence } from "framer-motion";

// Create a unique ID for each snackbar
let snackbarId = 0;

interface SnackbarItem {
  id: number;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  // Function to show a new snackbar
  const showSnackbar = useCallback((message: string, type: SnackbarType = "info") => {
    const id = snackbarId++;
    setSnackbars(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeSnackbar(id);
    }, 5000);
  }, []);

  // Function to remove a snackbar by id
  const removeSnackbar = useCallback((id: number) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      
      {/* Only show the most recent snackbar */}
      {snackbars.length > 0 && (
        <Snackbar
          open={true}
          message={snackbars[snackbars.length - 1].message}
          type={snackbars[snackbars.length - 1].type}
          onClose={() => removeSnackbar(snackbars[snackbars.length - 1].id)}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
