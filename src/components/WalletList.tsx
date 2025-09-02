import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { addWallet } from "../services/walletsService";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

interface Wallet {
  id: string;
  name: string;
  type: string;
}

export default function WalletSelector() {
  const handleLogout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    console.log("Sesión cerrada ✅");
    navigate("/"); // redirige al login
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }
};

  const { user, loading } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const navigate = useNavigate();

  // Cargar wallets en tiempo real
  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, "users", user.uid, "wallets"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Wallet[];
        setWallets(data);
      }
    );

    return () => unsub();
  }, [user]);

  const handleAddWallet = async () => {
    if (!user) return;

    const { value: formValues } = await Swal.fire({
      title: "Agregar Wallet",
      html: `
        <input id="wallet-name" class="swal2-input tailwind-input" placeholder="Nombre de la wallet">
        <select id="wallet-type" class="swal2-select tailwind-input">
          <option value="" disabled selected>Selecciona el tipo</option>
          <option value="Personal">Personal</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Otro">Otro</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("wallet-name") as HTMLInputElement).value;
        const type = (document.getElementById("wallet-type") as HTMLSelectElement).value;
        if (!name || !type) {
          Swal.showValidationMessage("Debes ingresar nombre y tipo");
        }
        return { name, type };
      },
    });

    if (formValues) {
      await addWallet(user.uid, formValues.name, formValues.type);
      Swal.fire("Wallet agregada!", `${formValues.name} - ${formValues.type}`, "success");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-6 py-12">
      <div className="w-full flex justify-between mb-8">
        <div className="grid grid-cols-2">
          <div className="bg-green-900 w-6 h-6 rounded-sm"></div>
          <div className="bg-white w-4 h-4 rounded-sm"></div>
          <div className="bg-white w-4 h-4 rounded-sm"></div>
          <div className="bg-green-900 w-6 h-6 rounded-sm"></div>
        </div>
        <button onClick={handleLogout}><img src="/assets/salida.png" alt="" /></button>
      </div>

      <h1 className="text-xl text-green-900 leading-snug font-bold mb-4">
        Selecciona tu Wallet
      </h1>

      {/* Wallet List */}
      <div className="w-full max-w-md mb-8">
        <ul className="flex flex-col gap-2">
          {wallets.map((wallet) => (
            <li
              key={wallet.id}
              className="p-4 bg-green-100 text-green-900 rounded-md font-medium flex justify-between cursor-pointer"
              onClick={() => navigate(`/dashboard/${wallet.id}`)}
            >
              <span>{wallet.name}</span>
              <span className="italic text-sm">{wallet.type}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Wallet Button */}
      <button
        className="bg-green-900 text-white px-6 min-w-full py-3 rounded-md text-lg"
        onClick={handleAddWallet}
      >
        Agregar Wallet
      </button>
    </div>
  );
}
