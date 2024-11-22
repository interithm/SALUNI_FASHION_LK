import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase";



export const orderIdHandler = async () => {
    const orgDocId = "saluni-fashion-production-qa"; 
    const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'order-id'); 


    const orderIdList = await getDoc(counterDocRef); // get the all data related to order-id collection 
    const currentOrderID = orderIdList.exists() ? orderIdList.data().Order_ID : 0   // if Order_ID not present use 0 instead

    return currentOrderID + 1 // increment the order id once and returned it 
}