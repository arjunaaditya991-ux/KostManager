/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPage } from './components/LandingPage';
import { AppLayout } from './components/AppLayout';
import './index.css';

const App = () => {
  const [isDashboardVisible, setIsDashboardVisible] = React.useState(false);

  return (
    <React.StrictMode>
      {isDashboardVisible ? (
        <AppLayout />
      ) : (
        <LandingPage onStart={() => setIsDashboardVisible(true)} />
      )}
    </React.StrictMode>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
