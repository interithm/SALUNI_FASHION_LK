import { collection, addDoc , updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

// create a function and passed the required parameters

export const paymenthandler = async (onlinePaymentData , paymentID , orderID , customerID ) => {

    const paymentData = {
        Payment_ID:"Payment - " + paymentID,
        Payment_CallBack:paymentID,
        Bill_Total: onlinePaymentData.amount || 13035,
        Cust_ID: customerID,
        Payment_Method: onlinePaymentData.paymentMethod || "Online-COD",
        Status: onlinePaymentData.status || "CREDIT",
        Tax: onlinePaymentData.tax || "0",
        Location: onlinePaymentData.location || "Invoice",
        Terminal: onlinePaymentData.terminal || "Online-Portal",       //implement the payment object for firestore
        Email: onlinePaymentData.customer_email || 'No email',
        Time: onlinePaymentData.time || "15:55:47",
        Date: onlinePaymentData.date || "2024-07-10",
        Change_Amount: onlinePaymentData.changeAmount || 0,
        Due_Amount: onlinePaymentData.dueAmount || 0,
        Paid_Amount: onlinePaymentData.amount || 13035,
        BankName: onlinePaymentData.bankName || "",
        CardCharges: onlinePaymentData.cardCharges || 0,
        CardCheqNumber: onlinePaymentData.cardCheqNumber || "",
        CardType: onlinePaymentData.cardType || "",
        CashDrawerStatus: onlinePaymentData.cashDrawerStatus || 1,
        CheqDate: onlinePaymentData.cheqDate || "",
        Deleted: onlinePaymentData.deleted || 0,
        InvBill_No: "Payment - " + paymentID,
        Note: onlinePaymentData.note || "",
        UUID: onlinePaymentData.uuid || "03e6b735-b6e1-4759-8323-6017b2e4af3e",
        1: 0,
        2: 0,
        3: 0,
        4: 0,
    };
    savePaymentHandler(paymentData)


}

// save a=oayment data with updated values

const savePaymentHandler = async (paymentData) => {
try{
    const orgDocId = "saluni-fashion-production-qa";
    const paymentDocRef = collection(db, 'organizations', orgDocId, 'payments');

    const docRef = await addDoc(paymentDocRef, {
        ...paymentData,
        UUID:'',                          
    })

    await updateDoc(docRef, {UUID: docRef.id});

    console.log("Payment data saved sucessfully with incremented payment ID" , paymentData );
} catch(error){
    console.log("Error saving payment data:" , error)
}

};






