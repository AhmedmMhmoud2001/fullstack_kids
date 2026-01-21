import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import DashboardRoutes from './routes';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <DashboardRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
