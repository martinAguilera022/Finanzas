import React, { useEffect, useState } from "react";
import { Movement } from "./Movement";
import { subscribeMovements } from "../services/movementsService";
import { useNavigate } from "react-router-dom";

interface RecentActivityProps {
  userId: string;
  walletId: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ userId, walletId }) => {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"Todos" | "Ingreso" | "Gasto">("Todos");
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId || !walletId) return;

    setLoading(true);
    const unsubscribe = subscribeMovements(userId, walletId, (data) => {
      setMovements(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, walletId]);

  // Filtrar por tipo
  const filteredMovements = movements.filter((mov) => {
    if (filterType === "Todos") return true;
    return mov.type === filterType;
  });

  // Ordenar por fecha descendente
  const sortedMovements = [...filteredMovements].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt?._seconds ? new Date(a.createdAt._seconds * 1000) : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt?._seconds ? new Date(b.createdAt._seconds * 1000) : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });



  return (
    <>
      <div className="flex justify-between items-center mb-2 p-4">
        <h3 className="text-gray-600 font-medium">Movimientos Recientes</h3>
        <button className="text-green-600" onClick={() => navigate(`/movements/${walletId}`)}>Ver más</button>
      </div>

      <div className="space-y-2">
        {loading ? (
          // Skeleton Loader simulando la estructura de Movement
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center bg-gray-200 p-3 rounded-xl animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-32 bg-gray-300 rounded" />
                    <div className="h-2 w-24 bg-gray-300 rounded" />
                  </div>
                </div>
                <div className="h-3 w-16 bg-gray-300 rounded" />
              </div>
            ))}
          </>
        ) : sortedMovements.length > 0 ? (
          sortedMovements.map((mov) => {
            let date: Date;

            if (mov.createdAt?.toDate) date = mov.createdAt.toDate();
            else if (mov.createdAt?._seconds) date = new Date(mov.createdAt._seconds * 1000);
            else if (typeof mov.createdAt === "number") date = new Date(mov.createdAt);
            else date = new Date(mov.createdAt);

            return (
              <Movement
                key={mov.id}
                type={mov.type}
                amount={mov.amount}
                description={mov.description}
                category={mov.category}
                date={date}
              />
            );
          })
        ) : (
          <p className="text-gray-600 text-center">No hay movimientos recientes</p>
        )}
      </div>
    </>
  );
};
