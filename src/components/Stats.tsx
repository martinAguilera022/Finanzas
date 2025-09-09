import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";
import { ChartAreaInteractive } from "./ChartAreaInteractive";
import { MovementsChart } from "./MovementsChart";
import { ChartPieDonutInteractive } from "./CharPieDonutText";
import { Skeleton } from "@/components/ui/skeleton";

export default function Stats() {
  const { walletId } = useParams<{ walletId: string }>();
  const { user } = useAuth();
  const [totals, setTotals] = useState({ ingresos: 0, gastos: 0 });
  const [loading, setLoading] = useState(true); // 👈 Estado para skeleton

  useEffect(() => {
    if (!user || !walletId) return;

    const movementsRef = collection(
      db,
      "users",
      user.uid,
      "wallets",
      walletId,
      "movements"
    );

    const unsub = onSnapshot(movementsRef, (snapshot) => {
      let ingresos = 0;
      let gastos = 0;

      snapshot.docs.forEach((doc) => {
        const mov = doc.data();
        if (mov.type === "Ingreso") ingresos += mov.amount;
        else gastos += mov.amount;
      });

      setTotals({ ingresos, gastos });
      setLoading(false); // 👈 Ya tenemos datos, ocultar skeleton
    });

    return () => unsub();
  }, [user, walletId]);

  if (!walletId) return <div>No hay wallet seleccionada</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Estadísticas de tu wallet</h2>

      {loading ? (
        // 👇 Mostramos Skeleton mientras no hay datos
        <div className="flex flex-col gap-4">
          <Skeleton className="h-90 w-full rounded-2xl bg-gray-100" /> {/* Simula el chart */}
          <Skeleton className="h-90 w-full rounded-2xl bg-gray-100" /> {/* Simula el chart */}
          <Skeleton className="h-90 w-full rounded-2xl bg-gray-100" /> {/* Simula el chart */}
           {/* Simula el otro chart */}
          
        </div>
      ) : (
        <>
          <ChartAreaInteractive userId={user!.uid} walletId={walletId} />
          <ChartPieDonutInteractive userId={user!.uid} walletId={walletId} />
          <MovementsChart ingresos={totals.ingresos} gastos={totals.gastos} />
        </>
      )}
    </div>
  );
}
