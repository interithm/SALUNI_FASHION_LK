import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const orderIdIncrement = async (orderID:number) => {
    const orgDocId = "saluni-fashion-production-qa"; 
    const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'order-id'); 

    try {
        // Set the order ID directly
        await setDoc(counterDocRef, { Order_ID: orderID });
    } catch (error) {
        console.error("Error setting order ID: ", error);
    }
};
 