import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const paymentIdIncrement = async (paymentID:number) => {
    const orgDocId = "20240711-1011-SaluniFashion"; 
    const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'payment-id'); 

    try {
        // Set the payment ID directly
        await setDoc(counterDocRef, { Payment_ID: paymentID });
    } catch (error) {
        console.error("Error setting order ID: ", error);
    }
};
 