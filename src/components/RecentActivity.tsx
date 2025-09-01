import React, { useEffect, useState } from "react";
import { Movement } from "./Movement";
import { subscribeMovements } from "../services/movementsService";

interface RecentActivityProps {
  userId: string;
  walletId: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ userId, walletId }) => {
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    if (!userId || !walletId) return;
    const unsubscribe = subscribeMovements(userId, walletId, setMovements);
    return () => unsubscribe();
  }, [userId, walletId]);

  return (
    <>
      <div className="flex justify-between items-center mb-2 p-4">
        <h3 className="text-gray-600 font-medium">Movimientos Recientes</h3>
        
      </div>
      <div className="space-y-2">
        {movements.length > 0 ? (
          movements.map((mov) => (
            <Movement key={mov.id} type={mov.type} amount={mov.amount} description={mov.description} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No hay movimientos aún</p>
        )}
      </div>
    </>
  );
};
