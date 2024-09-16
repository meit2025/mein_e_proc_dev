// resources/js/app.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../sass/app.scss';
import { AlertProvider } from './Contexts/AlertContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    // Bungkus komponen dengan AlertProvider
    createRoot(el).render(
      <AlertProvider>
        {' '}
        {/* Bungkus dengan AlertProvider */}
        <ToastContainer /> {/* Tambahkan ToastContainer untuk menampilkan toast */}
        <App {...props} />
      </AlertProvider>,
    );
  },
});
