import { collection, addDoc , updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

// create a function and passed the required parameters

export const paymenthandler = async (onlinePaymentData , paymentID , orderID , customerID ) => {

    const paymentData = {
        Payment_ID:paymentID,
        Bill_Total: onlinePaymentData.amount || 13035,
        Cust_ID: customerID,
        Payment_Method: onlinePaymentData.paymentMethod || "Online",
        Status: onlinePaymentData.status || "CREDIT",
        Tax: onlinePaymentData.tax || "0",
        Location: onlinePaymentData.location || "Invoice",
        Terminal: onlinePaymentData.terminal || "Online-Portal",       //implement the payment object for firestore
        Email: onlinePaymentData.customer_email || 'No email',
        Time: onlinePaymentData.time || "15:55:47",
        Date: onlinePaymentData.date || "2024-07-10",
        Change_Amount: onlinePaymentData.changeAmount || 0,
        Due_Amount: onlinePaymentData.dueAmount || 0,
        Paid_Amount: onlinePaymentData.paidAmount || 13035,
        BankName: onlinePaymentData.bankName || "",
        CardCharges: onlinePaymentData.cardCharges || 0,
        CardCheqNumber: onlinePaymentData.cardCheqNumber || "",
        CardType: onlinePaymentData.cardType || "",
        CashDrawerStatus: onlinePaymentData.cashDrawerStatus || 1,
        CheqDate: onlinePaymentData.cheqDate || "",
        Deleted: onlinePaymentData.deleted || 0,
        InvBill_No: orderID,
        Note: onlinePaymentData.note || "",
        UUID: onlinePaymentData.uuid || "03e6b735-b6e1-4759-8323-6017b2e4af3e"
    };
    savePaymentHandler(paymentData)


}

// save a=oayment data with updated values

const savePaymentHandler = async (paymentData) => {
try{
    const orgDocId = "20240711-1011-SaluniFashion";
    const paymentDocRef = collection(db, 'organizations', orgDocId, 'paymentss');

    const docRef = await addDoc(paymentDocRef, {
        ...paymentData,
        UUID:'',                          
    })

    await updateDoc(docRef, {UUID: docRef.id});

    console.log("Payment data saved sucessfully with incremented payment ID");
} catch(error){
    console.log("Error saving payment data:" , error)
}

};






