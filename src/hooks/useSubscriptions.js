import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export function useSubscriptions(userId) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const ref = collection(db, "users", userId, "subscriptions");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubscriptions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  async function addSubscription(newSub) {
    if (!userId) return;
    const ref = doc(collection(db, "users", userId, "subscriptions"));
    await setDoc(ref, { ...newSub, id: ref.id });
  }

  async function updateSubscription(updatedSub) {
    if (!userId) return;
    const ref = doc(db, "users", userId, "subscriptions", updatedSub.id);
    await setDoc(ref, updatedSub);
  }

  async function deleteSubscription(subId) {
    if (!userId) return;
    await deleteDoc(doc(db, "users", userId, "subscriptions", subId));
  }

  return { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription };
}