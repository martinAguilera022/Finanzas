import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  walletName?: string;
}

export const Header: React.FC<HeaderProps> = ({ userName = "Usuario", walletName }) => {
  const navigate = useNavigate();

  const goToWalletList = () => {
    navigate("/"); // Cambiá "/wallets" por la ruta de tu lista de wallets
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-lg font-medium text-gray-600">Hola, {userName}</h2>
        {walletName && <p className="text-sm text-gray-400">Wallet: {walletName}</p>}
      </div>
      <button onClick={goToWalletList}>
        <img src="/assets/billetera.png" alt="Wallets" className="w-8 h-8" />
      </button>
      
    </div>
  );
};
