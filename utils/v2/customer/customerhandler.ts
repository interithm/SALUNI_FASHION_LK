import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const customerHandler =  (billingDetails) => {

const customerData = {
        Account_Balance: 0,
        Account_Limit: billingDetails.accountLimit || 200000,
        Address1: billingDetails.address || "",
        Address2: billingDetails.city || "",
        Address3: billingDetails.postalCode || "",
        Auto_Email_Invoice: billingDetails.autoEmailInvoice || 0,
        Available_Loyalty_Credit: billingDetails.availableLoyaltyCredit || 0,
        B1: billingDetails.b1 || 0,
        B3: billingDetails.b3 || 1,
        Card_Number: billingDetails.cardNumber || "",
        Credit_Card_Bank: billingDetails.creditCardBank || "",
        Credit_Card_Type: billingDetails.creditCardType || "Visa",
        Cus_Group_Name: billingDetails.cusGroupName || "Online Customers",
        Cust_ID: 0,
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

      saveCustomerHandler(customerData);
}

 const saveCustomerHandler = async (customerData) => {
    try {
        const orgDocId = "20240711-1011-SaluniFashion"; // the organization name
        const customerDocRef = collection(db, 'organizations', orgDocId, 'customerss'); // target collection to update the data 
        const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'customer-id'); // to update the customers we need to get the increwment id from here 
        const q = query(customerDocRef, where("Email", "==", customerData.Email)); // check the providing email is mathching to any other email in firestore
        const querySnapshot = await getDocs(q); // if there is data get their snapshot

        if (!querySnapshot.empty) {
            console.log("Customer data already exists"); // check there is data or not 
            // return querySnapshot.docs[0].data().Cust_ID; // Return existing Cust_ID if customer data  exists
        } else {

            // register customer 

            const customerIdList = await getDoc(counterDocRef); // retrieve the latest customer id 
            const currentCustID = customerIdList.exists() ? customerIdList.data().Cust_ID : 0; // then add the retrieved current id to the variable if it available if not set the value to 0

            // customer saving part with special customer id that retrieve from customerIdList and make UUID field empthy

            const docRef = await addDoc(customerDocRef, {
                ...customerData,
                Cust_ID: currentCustID + 1,
                UUID: ''
            });
            
            // after that process then i updated the UUID with the created document id 
            await updateDoc(docRef, { UUID: docRef.id });
            // after that increment the id in collection where id are saving for incrementation
            await updateDoc(counterDocRef, { Cust_ID: currentCustID + 1 });

            console.log("Customer Data Saved Successfully")
                                                                // log and returned for better debuggings
            return currentCustID + 1;
        }
    } catch(error) {
         console.log ('Error while saving the Cusomer' ,  error)
    }
    finally {
        console.log('check customer:');
        console.log('i did check customer mtf');
    }
}