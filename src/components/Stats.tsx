import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { ChartAreaInteractive } from "./ChartAreaInteractive";
import { MovementsChart } from "./MovementsChart";
import { ChartPieDonutInteractive } from "./CharPieDonutText";
interface Wallet {
  name: string;
  type: string;
  balance?: number;
}

export default function Stats() {
  const { walletId } = useParams<{ walletId: string }>();
  const { user } = useAuth();
  const [totals, setTotals] = useState({ ingresos: 0, gastos: 0 });

  useEffect(() => {
    if (!user || !walletId) return;

    const movementsRef = collection(db, "users", user.uid, "wallets", walletId, "movements");

    const unsub = onSnapshot(movementsRef, (snapshot) => {
      let ingresos = 0;
      let gastos = 0;

      snapshot.docs.forEach(doc => {
        const mov = doc.data();
        if (mov.type === "Ingreso") ingresos += mov.amount;
        else gastos += mov.amount;
      });

      setTotals({ ingresos, gastos });
    });

    return () => unsub();
  }, [user, walletId]);

  if (!walletId) return <div>No hay wallet seleccionada</div>;

  return (
    <div className="p-6 ">
      <h2 className="text-xl font-bold mb-4">Estadísticas de tu wallet</h2>
 {user && walletId && (
    <>
    <ChartAreaInteractive userId={user.uid} walletId={walletId} />
    <ChartPieDonutInteractive userId={user.uid} walletId={walletId} />
    </>
  
)}  

      <MovementsChart ingresos={totals.ingresos} gastos={totals.gastos} />
     
    </div>
  );
}
