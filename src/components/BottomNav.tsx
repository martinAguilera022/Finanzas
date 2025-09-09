import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { HomeIcon, WalletIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const BottomNav: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();

  const navItems = [
    { path: "/", icon: <WalletIcon className="w-8 h-8" />, label: "Wallets" },
    { path: walletId ? `/dashboard/${walletId}` : "/", icon: <HomeIcon className="w-8 h-8 " />, label: "Inicio" },
    { path: walletId ? `/stats/${walletId}` : "/", icon: <ChartBarIcon className="w-8 h-8" />, label: "Estadísticas" },
  ];

  return (
    <nav className="fixed bottom-0 z-50 left-0 min-w-full shadow-t bg-green-700 flex justify-between px-8 items-center py-2">
      {navItems.map((item, idx) => (
       <NavLink
  key={idx}
  to={item.path}
  className={({ isActive }) =>
    `flex flex-col items-center justify-center transition-all duration-300 relative px-6  ${
      isActive
        ? "text-green-700 bg-white rounded-full p-3 -translate-y-4 shadow-lg z-10"
        : "text-green-200"
    }`
  }
>
  {item.icon}
</NavLink>


      ))}
    </nav>
  );
};

export default BottomNav;
