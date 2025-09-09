import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { HomeIcon, WalletIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const BottomNav: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();

  const navItems = [
    { path: "/", icon: <WalletIcon className="w-8 h-8" />, label: "Wallets" },
    { path: walletId ? `/dashboard/${walletId}` : "/", icon: <HomeIcon className="w-8 h-8" />, label: "Inicio" },
    { path: walletId ? `/stats/${walletId}` : "/", icon: <ChartBarIcon className="w-8 h-8" />, label: "Estadísticas" },
  ];

  return (
    <nav className="fixed bottom-0 z-50 left-0 min-w-full shadow-t bg-green-700 flex justify-between px-8 items-center py-2">
      {navItems.map((item, idx) => (
        <NavLink key={idx} to={item.path} className="flex flex-col items-center justify-center px-6 relative">
          {({ isActive }) => (
            <>
              {/* Notch activo */}
              {isActive && (
                <span className="absolute -top-6 w-16 h-16 bg-green-700 rounded-t-full left-1/2 -translate-x-1/2 [clip-path:circle(50%_at_50%_0%)]" />
              )}

              <span
                className={`relative z-10 transition-all duration-300 ${
                  isActive
                    ? "bg-white text-green-700 rounded-full p-3 shadow-lg -translate-y-4"
                    : "text-green-200"
                }`}
              >
                {item.icon}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
