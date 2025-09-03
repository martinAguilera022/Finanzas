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
  movements.map((mov) => {
 let date: Date;

  if (mov.createdAt?.toDate) {
    date = mov.createdAt.toDate(); // Timestamp real
  } else if (mov.createdAt?._seconds) {
    date = new Date(mov.createdAt._seconds * 1000); // Timestamp serializado
  } else if (typeof mov.createdAt === "number") {
    date = new Date(mov.createdAt); // Milisegundos
  } else {
    date = new Date(mov.createdAt); // String o fallback
  }


  return (
    <Movement
      key={mov.id}
      type={mov.type}
      amount={mov.amount}
      description={mov.description}
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
