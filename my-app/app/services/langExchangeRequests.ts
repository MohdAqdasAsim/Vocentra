import { doc, setDoc, getDocs, collection, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Import db, which is the correct Firestore reference

// Add a new language exchange request
export const addLangExchangeRequest = async (
  userId: string,
  name: string,
  region: string,
  targetLanguage: string,
  description?: string
) => {
  try {
    const requestRef = collection(db, "langExchangeRequests"); // Use db here
    const newRequestRef = doc(requestRef); // Create a new document reference
    await setDoc(newRequestRef, {
      userId,
      name,
      region,
      targetLanguage,
      description,
      createdAt: new Date().toISOString(),
    });
    console.log("Request added successfully");
  } catch (error: any) {
    console.error("Error adding language exchange request:", error);
    throw new Error("Failed to add language exchange request: " + error.message);
  }
};

// Fetch all language exchange requests
export const getLangExchangeRequests = async () => {
  try {
    console.log(db); // Check db reference here
    
    const querySnapshot = await getDocs(collection(db, "langExchangeRequests")); // Use db here
    if (querySnapshot.empty) {
      console.warn("No language exchange requests found.");
      return []; // Return empty array to avoid further errors
    }
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return requests;
  } catch (error: any) {
    console.error("Error fetching language exchange requests:", error);
    throw new Error("Failed to fetch requests: " + error.message);
  }
};

// Fetch requests made by a specific user
export const getUserRequests = async (userId: string) => {
  try {
    const requestRef = collection(db, "langExchangeRequests"); // Use db here
    const q = query(requestRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.warn(`No requests found for user ${userId}`);
      return []; // Return empty array
    }
    const userRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return userRequests;
  } catch (error: any) {
    console.error("Error fetching user requests:", error);
    throw new Error("Failed to fetch user requests: " + error.message);
  }
};

// Delete a language exchange request by ID
export const deleteLangExchangeRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, "langExchangeRequests", requestId); // Use db here
    await deleteDoc(requestRef);
    console.log("Request deleted successfully");
  } catch (error: any) {
    console.error("Error deleting request:", error);
    throw new Error("Failed to delete language exchange request: " + error.message);
  }
};
