import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useAuth from "../hooks/useAuth";
import { addWallet } from "../services/walletsService";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import 'animate.css';

interface Wallet {
  id: string;
  name: string;
  type: string;
}

const MySwal = withReactContent(Swal);

export default function WalletSelector() {
  const { user, loading } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const navigate = useNavigate();

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

    const { value: formValues } = await MySwal.fire({
      title: <p className="text-[#0d542b] font-bold text-lg text-xl text-center">Agregar Wallet</p>,
      html: (
        <div className="flex  text-white  flex-col gap-4 p-4">
          <input
            id="wallet-name"
            placeholder="Nombre de la wallet"
            className="border text-[#0d542b] border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0d542b]"
          />
          <select
            id="wallet-type"
            className="border text-[#0d542b] border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0d542b] appearance-none"
          >
            <option value="" disabled selected>
              Selecciona el tipo
            </option>
            <option value="Personal">Personal</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      ),
      background: "#ffffffff",
      showCancelButton: true,
      confirmButtonText: "Agregar",
      confirmButtonColor: "#0d542b",
      
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      width: '90%',
      padding: '1.5rem',
      backdrop: 'rgba(0,0,0,0.3)',
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' },
      customClass: {
        popup: "rounded-xl shadow-lg bg-white",
        confirmButton: "bg-[#0d542b] hover:bg-[#0b4622] text-white font-semibold px-6 py-3 rounded-md shadow-md text-base",
        cancelButton: "bg-gray-200 hover:bg-gray-300 text-[#0d542b] font-semibold px-6 py-3 rounded-md shadow-md text-base",
      },
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
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-green-900 w-6 h-6 rounded-sm"></div>
          <div className="bg-white w-4 h-4 rounded-sm"></div>
          <div className="bg-white w-4 h-4 rounded-sm"></div>
          <div className="bg-green-900 w-6 h-6 rounded-sm"></div>
        </div>
        <button onClick={handleLogout}>
          <img src="/assets/salida.png" alt="Salir" />
        </button>
      </div>
<div className="w-full max-w-md mb-8 ">
  {wallets.length === 0 ? (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg text-gray-400 text-center">
        ¡No tienes wallets aún!
      </p>
      <p className="text-green-900 font-semibold text-center">
        Crea tu primera wallet para empezar
      </p>
    </div>
  ) : (
    
    <ul className="flex flex-col  gap-2">
      <h2 className="mb-4  text-green-900 text-5xl text-center font-semibold">Tus Wallets</h2>
      {wallets.map((wallet) => (
        <li
          key={wallet.id}
          className="p-4 bg-green-100 text-green-900 rounded-md font-medium flex justify-between cursor-pointer hover:bg-green-200 transition"
          onClick={() => navigate(`/dashboard/${wallet.id}`)}
        >
          <span>{wallet.name}</span>
          <span className="italic text-sm">{wallet.type}</span>
        </li>
      ))}
    </ul>
  )}
</div>

      <button
        className="bg-green-900 text-white px-6 min-w-full py-3 rounded-md text-lg"
        onClick={handleAddWallet}
      >
       + Agregar Wallet
      </button>
    </div>
  );
}
