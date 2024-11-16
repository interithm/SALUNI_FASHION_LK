// import { doc, setDoc , collection, addDoc , updateDoc , query , where , getDocs } from "firebase/firestore";
// import { db } from "./firebase"; // Ensure you import your Firestore instance from the firebase config
// import { generatePaymentId , generateOrderId , generateCustomId } from './idhandler';

// const savePaymentData = async (paymentData) => {
//     try {
//       const orgDocId = "20240711-1011-SaluniFashion"; 
//       const paymentDocRef = collection(db, 'organizations', orgDocId, 'paymentss');
      
//       // Adding the payment data to Firestore
//       const docRef = await addDoc(paymentDocRef, {
//         ...paymentData, // Spread the existing payment data
//         UUID: '' // Update the UUID field if needed, otherwise leave it empty
//       });
      
//       // Updating the document with the generated UUID
//       await updateDoc(docRef, { UUID: docRef.id });
//       console.log("Payment data saved successfully");
//     } catch (error) {
//       console.error("Error saving payment data:", error);
//     }
//   };
  
//   export const handlePaymentFormSubmit =async (paymentDetails:any) => {

//     const Payment_id = await generatePaymentId("WP");
//     const Order_id = await generateOrderId("WO");
//     const Customer_id = await generateCustomId("WC");

//     const paymentData = {
//       Payment_ID: Payment_id || "11",
//       Bill_Total: paymentDetails.billTotal || 13035,
//       Cust_ID: Customer_id || "1",
//       Payment_Method: paymentDetails.paymentMethod || "Online",
//       Status: paymentDetails.status || "CREDIT",
//       Tax: paymentDetails.tax || "0",
//       Location: paymentDetails.location || "Invoice",
//       Terminal: paymentDetails.terminal || "Online-Portal",
//       Time: paymentDetails.time || "15:55:47",
//       Date: paymentDetails.date || "2024-07-10",
//       Change_Amount: paymentDetails.changeAmount || 0,
//       Due_Amount: paymentDetails.dueAmount || 0,
//       Paid_Amount: paymentDetails.paidAmount || 13035,
//       BankName: paymentDetails.bankName || "",
//       CardCharges: paymentDetails.cardCharges || 0,
//       CardCheqNumber: paymentDetails.cardCheqNumber || "",
//       CardType: paymentDetails.cardType || "",
//       CashDrawerStatus: paymentDetails.cashDrawerStatus || 1,
//       CheqDate: paymentDetails.cheqDate || "",
//       Deleted: paymentDetails.deleted || 0,
//       InvBill_No: Order_id || "INV-001001",
//       Note: paymentDetails.note || "",
//       UUID: paymentDetails.uuid || "03e6b735-b6e1-4759-8323-6017b2e4af3e"
//     };
  
//     // Save the mapped payment data to Firestore
//     savePaymentData(paymentData);
//   };
  