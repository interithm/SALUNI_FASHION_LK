import { collection, addDoc, updateDoc, where, query, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase";

export const onlineSavePaymentData = async (paymentData: { additional_data: string }) => {
    const orgDocId = "20240711-1011-SaluniFashion";

    // Reference to the payments collection
    const paymentDocRef = collection(db, 'organizations', orgDocId, 'paymentss');
    console.log("Payment_ID", paymentData.additional_data)
    // Query to find the document by Payment_ID
    const q = query(paymentDocRef, where("Payment_ID", "==", paymentData.additional_data));
    const querySnapshotPayment = await getDocs(q);

    if (!querySnapshotPayment.empty) {
        // Get the document reference of the first matching document
        const docRef = querySnapshotPayment.docs[0].ref;

        // Update the document
        await updateDoc(docRef, { Payment_Method: "Online Direct Transfer" });

        console.log('Saving payment data:', paymentData);
        console.log('Payment data updated successfully.');
    } else {
        console.error("No matching payment document founded.");
    }
};
