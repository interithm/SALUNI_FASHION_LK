import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { generateCustomId, generatePaymentId, generateOrderId } from './idhandler';

const saveCustomerData = async (customerData) => {
  try {
    const orgDocId = "20240711-1011-SaluniFashion"; 
    const customerDocRef = collection(db, 'organizations', orgDocId, 'customerss');
    const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'customer-id');
    const q = query(customerDocRef, where("Email", "==", customerData.Email));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      console.log("Customer data already exists");
      return querySnapshot.docs[0].data().Cust_ID; // Return existing Cust_ID if customer exists
    } else {
      const counterSnap = await getDoc(counterDocRef);
      const currentCustID = counterSnap.exists() ? counterSnap.data().Cust_ID : 0;

      // Add new customer data with a new Cust_ID
      const docRef = await addDoc(customerDocRef, {
        ...customerData,
        Cust_ID: currentCustID + 1,
        UUID: ''
      });

      await updateDoc(docRef, { UUID: docRef.id });
      await updateDoc(counterDocRef, { Cust_ID: currentCustID + 1 });

      console.log("Customer data saved successfully");
      return currentCustID + 1;
    }
  } catch (error) {
    console.error("Error saving customer data:", error);
  }
};

const savePaymentData = async (paymentData, custId) => {
  try {
    const orgDocId = "20240711-1011-SaluniFashion"; 
    const paymentDocRef = collection(db, 'organizations', orgDocId, 'paymentss');
    const paymentCounterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'payment-id');

    // Retrieve the current Payment_ID value
    const counterSnap = await getDoc(paymentCounterDocRef);
    const currentPaymentID = counterSnap.exists() ? counterSnap.data().Payment_ID : 0;

    // Add the payment data with the new Payment_ID
    const docRef = await addDoc(paymentDocRef, {
      ...paymentData,
      Payment_ID: currentPaymentID + 1,
      Cust_ID: custId,
      UUID: ''
    });

    // Update UUID field with document ID
    await updateDoc(docRef, { UUID: docRef.id });

    // Increment the Payment_ID in the counter document
    await updateDoc(paymentCounterDocRef, { Payment_ID: currentPaymentID + 1 });

    console.log("Payment data saved successfully with incremented Payment_ID");
  } catch (error) {
    console.error("Error saving payment data:", error);
  }
};

export const handleCustomerFormSubmit = async (billingDetails, paymentDetails) => {
  const id = await generateCustomId("WC");
  const Payment_id = await generatePaymentId("WP");
  const Order_id = await generateOrderId("WO");

  const customerData = {
    Account_Balance: 0,
    Account_Limit: billingDetails.accountLimit || 200000,
    Address1: billingDetails.address1 || "",
    Address2: billingDetails.address2 || "",
    Address3: billingDetails.address3 || "",
    Auto_Email_Invoice: billingDetails.autoEmailInvoice || 0,
    Available_Loyalty_Credit: billingDetails.availableLoyaltyCredit || 0,
    B1: billingDetails.b1 || 0,
    B3: billingDetails.b3 || 1,
    Card_Number: billingDetails.cardNumber || "",
    Credit_Card_Bank: billingDetails.creditCardBank || "",
    Credit_Card_Type: billingDetails.creditCardType || "Visa",
    Cus_Group_Name: billingDetails.cusGroupName || "Online Customers",
    Cust_ID: id,
    Cust_Name: billingDetails.name || "Default Customer",
    Date_Of_Birth: billingDetails.dateOfBirth || "0000-00-00",
    Deleted: 0,
    Earned_Loyalty: billingDetails.earnedLoyalty || 0,
    Email: billingDetails.email || "",
    Expiration_date: billingDetails.expirationDate || "0000-00-00",
    Gender: billingDetails.gender || "Mr.",
    Internal_Notes: billingDetails.internalNotes || "",
    J1: billingDetails.j1 || 1,
    J2: billingDetails.j2 || 1,
    J4: billingDetails.j4 || 1,
    J5: billingDetails.j5 || 1,
    Last_Visit: billingDetails.lastVisit || "0000-00-00 00:00:00",
    Loyalty_Enabled: billingDetails.loyaltyEnabled || 1,
    Loyalty_Point: billingDetails.loyaltyPoint || 0,
    NIC: billingDetails.nic || "",
    Phone: billingDetails.number || "000 000 0000",
    Phone_Land: billingDetails.phoneLand || "",
    Premium_Membership: billingDetails.premiumMembership || 1,
    Redeemed_Loyalty: billingDetails.redeemedLoyalty || 0,
    Ref_Emp_ID: billingDetails.refEmpId || "",
    Ref_Emp_Name: billingDetails.refEmpName || "<html><b><center>(None)</center></b></html>",
    Remark: billingDetails.remark || "",
    S1: billingDetails.s1 || 1,
    S2: billingDetails.s2 || 1,
    Store_Credit_Amount: billingDetails.storeCreditAmount || 0,
    Store_Credit_Enabled: billingDetails.storeCreditEnabled || 1,
    Total_Orders: billingDetails.totalOrders || 1,
    Total_Spent: billingDetails.totalSpent || 120,
    UUID: billingDetails.uuid || "default_Id",
    VehicleNo: billingDetails.vehicleNo || ""
  };

  const custId = await saveCustomerData(customerData);

  const paymentData = {
    Payment_ID: Payment_id,
    Bill_Total: paymentDetails.total || 13035,
    Cust_ID: custId,
    Payment_Method: paymentDetails.paymentMethod || "Online",
    Status: paymentDetails.status || "CREDIT",
    Tax: paymentDetails.tax || "0",
    Location: paymentDetails.location || "Invoice",
    Terminal: paymentDetails.terminal || "Online-Portal",
    Email: paymentDetails.email || 'No email',
    Time: paymentDetails.time || "15:55:47",
    Date: paymentDetails.date || "2024-07-10",
    Change_Amount: paymentDetails.changeAmount || 0,
    Due_Amount: paymentDetails.dueAmount || 0,
    Paid_Amount: paymentDetails.paidAmount || 13035,
    BankName: paymentDetails.bankName || "",
    CardCharges: paymentDetails.cardCharges || 0,
    CardCheqNumber: paymentDetails.cardCheqNumber || "",
    CardType: paymentDetails.cardType || "",
    CashDrawerStatus: paymentDetails.cashDrawerStatus || 1,
    CheqDate: paymentDetails.cheqDate || "",
    Deleted: paymentDetails.deleted || 0,
    InvBill_No: Order_id,
    Note: paymentDetails.note || "",
    UUID: paymentDetails.uuid || "03e6b735-b6e1-4759-8323-6017b2e4af3e"
  };

  await savePaymentData(paymentData, custId);
};
