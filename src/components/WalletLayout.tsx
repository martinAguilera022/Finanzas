import React from "react";
import Navbar from "./BottomNav";

interface WalletLayoutProps {
  children: React.ReactNode;
}

const WalletLayout: React.FC<WalletLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
};

export default WalletLayout;
