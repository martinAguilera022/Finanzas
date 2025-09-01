import { addDoc, collection } from "firebase/firestore";
import { db }  from "../firebase";

export const addWallet = async (userId: string, name: string, type: string) => {
  try {
    await addDoc(collection(db, "users", userId, "wallets"), {
      name,
      type,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error guardando wallet:", error);
  }
};
