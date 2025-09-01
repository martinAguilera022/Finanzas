import React from "react";
import Swal from "sweetalert2";
import { addMovement } from "../services/movementsService";

interface ActionButtonsProps {
  userId: string;
  walletId: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ userId, walletId }) => {

  const handleAdd = async (type: "Ingreso" | "Gasto") => {
    const { value: formValues } = await Swal.fire({
      title: `Agregar ${type}`,
      html: `
        <input 
          id="amount" 
          type="number" 
          class="swal2-input border border-gray-300 rounded-lg p-3 text-center text-lg" 
          placeholder="Monto"
        >
        <input 
          id="description" 
          class="swal2-input border border-gray-300 rounded-lg p-3 text-center text-lg mt-2" 
          placeholder="Descripción"
        >
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-lg'
      },
      preConfirm: () => {
        const amount = Number((document.getElementById("amount") as HTMLInputElement).value);
        const description = (document.getElementById("description") as HTMLInputElement).value;

        if (!amount || !description) {
          Swal.showValidationMessage("Debes ingresar monto y descripción");
          return;
        }

        return { amount, description };
      },
    });

    if (formValues) {
      try {
        await addMovement(userId, walletId, type, formValues.amount, formValues.description);
        Swal.fire(`${type} agregado!`, `${formValues.amount} - ${formValues.description}`, "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo agregar el movimiento", "error");
      }
    }
  };


  return (
    <div className="flex gap-4">
      <button
        className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white py-2 rounded-xl font-semibold hover:bg-green-800"
        onClick={() => handleAdd("Ingreso")}
      >
        <img src="../../public/assets/ingreso.png" alt="" className="w-6 h-6"/>
        Ingreso
      </button>

      <button
        className="flex-1 flex items-center justify-center gap-2 bg-green-200 text-green-700 py-2 rounded-xl font-semibold hover:bg-green-300"
        onClick={() => handleAdd("Gasto")}
      >
        <img src="../../public/assets/gasto.png" alt="" className="w-6 h-6"/>
        Gasto
      </button>
    </div>
  );
};
