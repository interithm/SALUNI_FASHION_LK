import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase";



export const paymentIdHandler = async () => {
    const orgDocId = "saluni-fashion-production-qa"; 
    const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'payment-id'); 


    const paymentIdList = await getDoc(counterDocRef); // get the all data related to payment-id collection 
    const currentPaymentID = paymentIdList.exists() ? paymentIdList.data().Payment_ID : 0   // if Payment_ID not present use 0 instead

    return currentPaymentID + 1 // increment the order id once and returned it 
}


