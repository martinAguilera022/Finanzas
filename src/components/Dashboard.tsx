import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Header } from "./Header";
import { WalletBalance } from "./WalletBalance";
import { ActionButtons } from "./ActionButtons";
import { RecentActivity } from "./RecentActivity";
import { Skeleton } from "@/components/ui/skeleton"
interface Wallet {
  name: string;
  type: string;
  balance?: number;
}

export default function Dashboard() {
  const { walletId } = useParams();
  const { user, loading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  useEffect(() => {
    if (!user || !walletId) return;

    const docRef = doc(db, "users", user.uid, "wallets", walletId);
    const movementsRef = collection(db, "users", user.uid, "wallets", walletId, "movements");

    let unsubscribe: (() => void) | null = null;

    const fetchAndListen = async () => {
      try {
        // 1️⃣ Traemos la wallet
        const docSnap = await getDoc(docRef);
        let walletData: Wallet | null = null;
        if (docSnap.exists()) {
          walletData = docSnap.data() as Wallet;
          setWallet(walletData);
        } else {
          setWallet(null);
        }

        // 2️⃣ Nos suscribimos a los movimientos
        unsubscribe = onSnapshot(movementsRef, (snapshot) => {
          let totalBalance = 0;

          snapshot.docs.forEach((doc) => {
            const mov = doc.data();
            totalBalance += mov.type === "Ingreso" ? mov.amount : -mov.amount;
          });

          // 🔑 Si la wallet ya estaba seteada, actualizamos su balance
          // Si no, creamos un objeto con el balance
          setWallet((prev) =>
            prev
              ? { ...prev, balance: totalBalance }
              : walletData
              ? { ...walletData, balance: totalBalance }
              : null
          );

          setLoadingWallet(false);
        });
      } catch (err) {
        console.error("Error cargando wallet:", err);
        setLoadingWallet(false);
      }
    };

    fetchAndListen();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, walletId]);

  if (loading) return <div>Cargando usuario...</div>;
  if (loadingWallet) {
  return (
    <div className="max-w-md mx-auto min-h-screen h-full p-6 bg-gray-50 shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <Skeleton className="h-6 w-40 mb-2 bg-gray-100" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Balance */}
      <Skeleton className="h-10 w-24 bg-gray-100 mb-2" />
      <div className="flex  mb-6">
        
        <Skeleton className="h-20 w-full bg-gray-100" />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-center mb-6">
        <Skeleton className="h-10 w-full rounded-full bg-gray-100" />
        <Skeleton className="h-10 w-full rounded-full bg-gray-100" />
      </div>

      {/* Lista de movimientos */}
      <div className="flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
  if (!wallet) return <div>Wallet no encontrada.</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen h-full p-6 bg-gray-50 shadow-lg">
      {user && (
        <>
          <Header userName={user?.displayName ?? undefined} walletName={wallet.name} />
          <WalletBalance balance={wallet.balance ?? 0} />
          <ActionButtons userId={user.uid} walletId={walletId!} />
          <RecentActivity userId={user.uid} walletId={walletId!} />
        </>
      )}
    </div>
  );
}
