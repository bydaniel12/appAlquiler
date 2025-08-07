import { useAuth } from "./AuthProvider";
import { db } from "../firebaseconfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  query,
  updateDoc,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { createContext, useContext } from "react";

const FireStoreContext = createContext();

export function FireStoreProvider({ children }) {
  const { currentUser } = useAuth();

  // Function to add a tenant for the current user
  const addTenant = async (tenantData) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      // Add tenant data to Firestore v9+
      const tenanRef = collection(db, "users", currentUser.uid, "tenants");
      return await addDoc(tenanRef, {
        ...tenantData,
        createdAt: new Date(),
        userId: currentUser.uid,
      });
    } catch (error) {
      console.error("Error adding tenant:", error);
      throw error;
    }
  };

  // Function to get tenants for the current user
  const getTenants = async () => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      // Fetch tenants from Firestore v9+
      const tenantRef = collection(db, "users", currentUser.uid, "tenants");
      const q = query(tenantRef);
      // Use getDocs para recuperar los documentos usando query
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching tenants:", error);
      throw error;
    }
  };

  // Function to delete a tenant by ID
  const deleteTenant = async (tenantId) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      // Eliminar todos los pagos asociados al inquilino
      const paymentsRef = collection(
        db,
        "users",
        currentUser.uid,
        "tenants",
        tenantId,
        "payments"
      );
      const paymentsSnap = await getDocs(paymentsRef);
      const deletePromises = paymentsSnap.docs.map((docSnap) =>
        deleteDoc(docSnap.ref)
      );
      await Promise.all(deletePromises);
      // Eliminar el documento del inquilino
      const tenantRef = doc(db, "users", currentUser.uid, "tenants", tenantId);
      return await deleteDoc(tenantRef);
    } catch (error) {
      console.error("Error deleting tenant:", error);
      throw error;
    }
  };
  // function to update a tenant by ID
  const updateTenant = async (tenantId, tenantData) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      // Update tenant document in Firestore v9+
      const tenantRef = doc(db, "users", currentUser.uid, "tenants", tenantId);
      return await updateDoc(tenantRef, tenantData);
    } catch (error) {
      console.error("Error updating tenant:", error);
      throw error;
    }
  };

  const addPayment = async (tenantId, paymentData) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    try {
      const paymentRef = collection(
        db,
        "users",
        currentUser.uid,
        "tenants",
        tenantId,
        "payments"
      );
      return await addDoc(paymentRef, {
        ...paymentData,
      });
    } catch (error) {
      console.error("Error adding payment:", error);
      throw error;
    }
  };

  // Actualiza un pago por ID
  const updatePayment = async (tenantId, paymentId, paymentData) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      const paymentRef = doc(
        db,
        "users",
        currentUser.uid,
        "tenants",
        tenantId,
        "payments",
        paymentId
      );
      return await updateDoc(paymentRef, paymentData);
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  };

  // Actualiza el campo active a false en todos los pagos de un inquilino
  const updatePaymentsActive = async (tenantId) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      const paymentRef = collection(
        db,
        "users",
        currentUser.uid,
        "tenants",
        tenantId,
        "payments"
      );
      const q = query(paymentRef);
      const querySnapshot = await getDocs(q);
      const batchUpdates = [];
      querySnapshot.forEach((docSnap) => {
        if (docSnap.data().active !== false) {
          batchUpdates.push(updateDoc(docSnap.ref, { active: false }));
        }
      });
      await Promise.all(batchUpdates);
    } catch (error) {
      console.error("Error actualizando pagos activos:", error);
      throw error;
    }
  };

  const getPayments = async (tenantId) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      const paymentRef = collection(
        db,
        "users",
        currentUser.uid,
        "tenants",
        tenantId,
        "payments"
      );
      const q = query(paymentRef, orderBy("fecha", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  };

  // Busca todos los pagos de todos los inquilinos por rango de fechas
  const searchPaymentsByDateRange = async (dateInit, dateEnd) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      const tenants = await getTenants();
      let allPayments = [];
      for (const tenant of tenants) {
        const payments = await getPayments(tenant.id);
        const filteredPayments = payments
          .filter((p) => {
            if (!p.fecha) return false;
            const fechaPago = new Date(p.fecha);
            const desde = new Date(dateInit);
            const hasta = new Date(dateEnd);
            hasta.setDate(hasta.getDate() + 1);
            return fechaPago >= desde && fechaPago <= hasta;
          })
          .map((p) => ({ ...p, name: tenant.name, rent: tenant.rent }));
        allPayments = allPayments.concat(filteredPayments);
      }
      return allPayments;
    } catch (error) {
      console.error("Error buscando pagos por rango de fechas:", error);
      throw error;
    }
  };

  const deletePayment = async (tenantId, paymentId) => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    try {
      const paymentRef = doc(
        db,
        "users",
        currentUser.uid,
        "tenants",
        tenantId,
        "payments",
        paymentId
      );
      return await deleteDoc(paymentRef);
    } catch (error) {
      console.error("Error deleting payment:", error);
      throw error;
    }
  };

  return (
    <FireStoreContext.Provider
      value={{
        addTenant,
        getTenants,
        deleteTenant,
        updateTenant,
        addPayment,
        getPayments,
        deletePayment,
        updatePaymentsActive,
        updatePayment,
        searchPaymentsByDateRange,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
}

export function useFireStore() {
  return useContext(FireStoreContext);
}
