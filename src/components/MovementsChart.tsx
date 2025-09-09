import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

interface MovementsChartProps {
  ingresos: number;
  gastos: number;
}

export const MovementsChart: React.FC<MovementsChartProps> = ({ ingresos, gastos }) => {
  // Creamos el array de datos para el gráfico
  const data = [
    { name: "Ingresos", value: ingresos },
    { name: "Gastos", value: gastos }
  ];

  const COLORS = ["#16a34a", "#dc2626"]; // verde y rojo

  return (
    <div className="mt-6 w-full h-96 mb-2 p-4 col-span-1 row-span-1">
      <h2 className="text-gray-600 font-medium">Resumen Movimientos</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
  <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
))}

          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
    </div>
  );
};
