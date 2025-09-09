import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Header } from "./Header";
import { WalletBalance } from "./WalletBalance";
import { ActionButtons } from "./ActionButtons";
import { RecentActivity } from "./RecentActivity";
import { MovementsChart } from "./MovementsChart";
import { ChartAreaInteractive } from "./ChartAreaInteractive";

interface Wallet {
  name: string;
  type: string;
  balance?: number;
}

export default function Dashboard() {
  const { walletId } = useParams();
  const { user, loading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [totals, setTotals] = useState({ ingresos: 0, gastos: 0 }); 
  const [showChart, setShowChart] = useState(true);

  // Cargar datos de la wallet
  useEffect(() => {
    const fetchWallet = async () => {
      if (!user || !walletId) return;
      const docRef = doc(db, "users", user.uid, "wallets", walletId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWallet(docSnap.data() as Wallet);
      }
    };
    fetchWallet();
  }, [user, walletId]);

  // Escuchar movimientos y actualizar balance + totales
  useEffect(() => {
    if (!user || !walletId) return;
    const movementsRef = collection(db, "users", user.uid, "wallets", walletId, "movements");

    const unsub = onSnapshot(movementsRef, (snapshot) => {
      let totalBalance = 0;
      let ingresos = 0;
      let gastos = 0;

      snapshot.docs.forEach(doc => {
        const mov = doc.data();
        if (mov.type === "Ingreso") {
          totalBalance += mov.amount;
          ingresos += mov.amount;
        } else {
          totalBalance -= mov.amount;
          gastos += mov.amount;
        }
      });

      setWallet(prev => prev ? { ...prev, balance: totalBalance } : prev);
      setTotals({ ingresos, gastos });
    });

    return () => unsub();
  }, [user, walletId]);

  if (loading) return <div>Cargando usuario...</div>;
  if (!wallet) return <div>Wallet no encontrada.</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen h-full p-6 bg-gray-50 shadow-lg">
      {user && (
        <>
          <Header userName={user?.displayName ?? undefined} walletName={wallet.name} />

          <WalletBalance balance={wallet.balance || 0} />
          <ActionButtons userId={user.uid} walletId={walletId!} />

       

          
            <RecentActivity userId={user.uid} walletId={walletId!} />
          
            
          
        </>
      )}
    </div>
  );
}
