import React from "react";
import Swal from "sweetalert2";
import { addMovement } from "../services/movementsService";

interface ActionButtonsProps {
  userId: string;
  walletId: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ userId, walletId }) => {
  const handleAdd = async (kind: "Ingreso" | "Gasto") => {
    const categories =
      kind === "Ingreso"
        ? ["Trabajo", "Regalo", "Venta", "Otro"]
        : ["Comida", "Transporte", "Entretenimiento", "Salud", "Compras", "Otro"];

    const { value: formValues } = await Swal.fire({
      title: `Agregar ${kind}`,
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
        <select 
          id="category" 
          class="swal2-input border border-gray-300 rounded-lg p-3 text-center text-lg mt-2"
        >
          <option value="">Selecciona categoría</option>
          ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-lg",
      },
      preConfirm: () => {
        const amount = Number(
          (document.getElementById("amount") as HTMLInputElement).value
        );
        const description = (
          document.getElementById("description") as HTMLInputElement
        ).value.trim();
        const category = (
          document.getElementById("category") as HTMLSelectElement
        ).value;

        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Debes ingresar un monto válido");
          return;
        }
        if (!description) {
          Swal.showValidationMessage("Debes ingresar una descripción");
          return;
        }
        if (!category) {
          Swal.showValidationMessage("Debes seleccionar una categoría");
          return;
        }

        return { amount, description, category };
      },
    });

    if (formValues) {
      try {
        await addMovement(
          userId,
          walletId,
          kind,
          formValues.amount,
          formValues.description,
          formValues.category
        );
        Swal.fire(
          `${kind} agregado!`,
          `${formValues.category} - ${formValues.description} - $${formValues.amount}`,
          "success"
        );
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
        <img src="/assets/ingreso.png" alt="" className="w-6 h-6" />
        Ingreso
      </button>

      <button
        className="flex-1 flex items-center justify-center gap-2 bg-green-200 text-green-700 py-2 rounded-xl font-semibold hover:bg-green-300"
        onClick={() => handleAdd("Gasto")}
      >
        <img src="/assets/gasto.png" alt="" className="w-6 h-6" />
        Gasto
      </button>
    </div>
  );
};
