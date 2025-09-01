import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import OnboardingScreen from "./components/Onboarding";
import WalletList from "./components/WalletList";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          // Si no está logueado, mostrar onboarding
          <Route path="*" element={<OnboardingScreen />} />
        ) : (
          <>
            {/* Lista de wallets */}
            <Route path="/" element={<WalletList />} />

            {/* Dashboard de wallet específica */}
            <Route path="/dashboard/:walletId" element={<Dashboard />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
