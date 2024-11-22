import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const customerIdHandler = async (billingDetails) => {
    try {
        const orgDocId = "saluni-fashion-production-qa";
        const customerDocRef = collection(db, 'organizations', orgDocId, 'customerss');
        const q = query(customerDocRef, where("Email", "==", billingDetails.email));
        const querySnapshotCustomers = await getDocs(q);

        if (!querySnapshotCustomers.empty) {
            const customerData = querySnapshotCustomers.docs[0].data();
            console.log("Customer ID retrieved successfully");
            return customerData.Cust_ID;
        } else {
            console.log("Customer not registered");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving customer ID:", error);
        return null;
    }
};
