interface WalletBalanceProps {
  balance: number;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-400 text-sm">Total Balance</p>
      <h1 className="text-3xl font-bold text-gray-800">
        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h1>
    </div>
  );
};
