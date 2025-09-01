interface MovementProps {
  type: "Ingreso" | "Gasto";
  amount: number;
  description: string;
  date?: Date | string;
}

export const Movement: React.FC<MovementProps> = ({ type, amount, description, date }) => {
  const isIncome = type === "Ingreso";

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isIncome ? "bg-green-200 text-green-700" : "bg-pink-200 text-pink-600"}`}>
          {description.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-gray-700 font-medium">{description}</p>
          <p className="text-gray-400 text-xs">{date ? new Date(date).toLocaleString() : "Hoy"}</p>
        </div>
      </div>
      <p className={`${isIncome ? "text-green-500" : "text-red-500"} font-semibold`}>
        {isIncome ? "+" : "-"}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};
