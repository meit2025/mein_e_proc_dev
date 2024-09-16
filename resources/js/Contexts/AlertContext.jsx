// resources/js/contexts/AlertContext.js

import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Buat Alert Context
const AlertContext = createContext();

// Hook untuk menggunakan Alert Context
export const useAlert = () => useContext(AlertContext);

// Provider untuk Alert Context
export const AlertProvider = ({ children }) => {
  // Fungsi untuk menampilkan toast notifikasi
  const showToast = (message, type = 'info') => {
    toast(message, { type });
  };

  return <AlertContext.Provider value={{ showToast }}>{children}</AlertContext.Provider>;
};
