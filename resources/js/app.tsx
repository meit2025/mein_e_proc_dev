// resources/js/app.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../sass/app.scss';
import { AlertProvider } from './Contexts/AlertContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    createRoot(el).render(
      <AlertProvider>
        <ToastContainer />
        <App {...props} />
      </AlertProvider>,
    );
  },
});
