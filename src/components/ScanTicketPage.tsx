import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Tesseract from "tesseract.js";
import { addMovement } from "../services/movementsService";
import useAuth from "../hooks/useAuth";

const ScanTicketPage: React.FC = () => {
  const { walletId } = useParams<{ walletId: string }>();
  const { user } = useAuth(); // user.uid será tu userId

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywordsFound, setKeywordsFound] = useState<string[]>([]);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setText("");
    setKeywordsFound([]);
    setAmount(null);

    try {
      const { data } = await Tesseract.recognize(file, "spa");
      const result = data.text;
      setText(result);

      const keywords = ["TOTAL", "IMPORTE"];
      const found = keywords.filter((word) =>
        result.toUpperCase().includes(word)
      );
      setKeywordsFound(found);

      if (found.length === 0) setError("❌ No se detectaron palabras clave en el ticket.");

      const match = result.match(/(\$?\s?\d+[.,]\d{2})/);
      if (match) {
        const rawAmount = match[1].replace(/[^\d.,]/g, "").replace(",", ".");
        setAmount(parseFloat(rawAmount));
      } else {
        setAmount(null);
      }
    } catch (err) {
      console.error("Error en OCR:", err);
      setError("❌ Ocurrió un error procesando la imagen.");
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user?.uid || !walletId) {
      alert(" Usuario o Wallet no definidos");
      return;
    }
    if (amount === null || keywordsFound.length === 0) {
      alert("Hubo un error detectando el ticket");
      return;
    }

    try {
      await addMovement(
        user.uid,
        walletId,
        "Gasto",
        amount,
        keywordsFound.join(", ") || "Gasto detectado",
        "OCR"
      );
      alert("✅ Gasto guardado correctamente!");
      setText("");
      setAmount(null);
      setKeywordsFound([]);
      setError(null);
    } catch (err) {
      console.error(err);
      alert("❌ Error guardando el gasto.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Escanear Ticket</h1>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="mb-6 p-2 border rounded-lg"
      />

      {loading && <p className="text-green-700 mb-4">Leyendo texto...</p>}
      {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

      {text && (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md mb-4 text-left">
          <p className="font-semibold mb-2">Texto detectado:</p>
          

          {keywordsFound.length > 0 && (
            <p className="text-green-700 mb-1">
              🔑 Palabras clave: {keywordsFound.join(", ")}
            </p>
          )}
          {amount !== null ? (
            <p className="text-blue-700 font-bold">
            Monto detectado: ${amount.toFixed(2)}
            </p>
          ) : (
            <p className="text-red-500">No se detectó monto</p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={amount === null || keywordsFound.length === 0}
          className={`px-6 py-2 rounded-lg text-white ${
            amount && keywordsFound.length > 0
              ? "bg-green-700 hover:bg-green-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ScanTicketPage;
