import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Movement } from "./Movement";
import { subscribeMovements } from "../services/movementsService";
import useAuth from "../hooks/useAuth"; // 🔹 importa tu hook

export const AllMovements: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { user } = useAuth(); // 🔹 obtenemos user
  const userId = user?.uid;

  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"Todos" | "Ingreso" | "Gasto">("Todos");

  useEffect(() => {
    if (!userId || !walletId) return;
    setLoading(true);
    const unsubscribe = subscribeMovements(userId, walletId, (data) => {
      setMovements(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId, walletId]);

  const filteredMovements = movements.filter((mov) =>
    filterType === "Todos" ? true : mov.type === filterType
  );

  const sortedMovements = [...filteredMovements].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Todos los Movimientos</h2>
      <select
        className="mb-4 rounded-md p-2"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as "Todos" | "Ingreso" | "Gasto")}
      >
        <option value="Todos">Todos</option>
        <option value="Ingreso">Ingresos</option>
        <option value="Gasto">Gastos</option>
      </select>

      <div className="space-y-2">
        {loading ? (
          <p>Cargando...</p>
        ) : sortedMovements.length > 0 ? (
          sortedMovements.map((mov) => (
            <Movement
              key={mov.id}
              type={mov.type}
              amount={mov.amount}
              description={mov.description}
              category={mov.category}
              date={mov.createdAt}
            />
          ))
        ) : (
          <p>No hay movimientos</p>
        )}
      </div>
    </div>
  );
};
