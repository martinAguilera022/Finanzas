import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export const addMovement = async (
  userId: string,
  walletId: string,
  type: "Ingreso" | "Gasto",
  amount: number,
  description: string
) => {
  await addDoc(collection(db, "users", userId, "wallets", walletId, "movements"), {
    type,
    amount,
    description,
    createdAt: serverTimestamp(),
  });
};

export const subscribeMovements = (
  userId: string,
  walletId: string,
  callback: (movements: any[]) => void
) => {
  const q = query(
    collection(db, "users", userId, "wallets", walletId, "movements"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt ? docData.createdAt.toDate() : null,
      };
    });
    callback(data);
  });
};
