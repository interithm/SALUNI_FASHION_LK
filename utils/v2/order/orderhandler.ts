import { collection, addDoc , updateDoc ,  doc } from "firebase/firestore";
import { db } from "../../firebase";

export const orderHandler = async (cartItems , orderID , customerID , billingDetails) => {

    const orgDocId = "saluni-fashion-production-qa";
    const orderItemsRef = collection(db, 'organizations', orgDocId, 'order_items');
    const ordersRef = collection(db, 'organizations', orgDocId, 'orders');


    try {
        // Prepare order-level data

        const orderData = {
            Cust_Name:billingDetails.name,
            customerID:customerID,
            Cust_Phone:billingDetails.number,
            Cust_Address1:billingDetails.address,
            Cust_Address2:billingDetails.city,
            Cust_Address3:billingDetails.postalCode,
            Cust_Email:billingDetails.email,
            orderAutoID: "",
            orderID: "Order - " + orderID ,
            NetTotal: cartItems.reduce((total, item) => total + item.Sales_Price * item.quantity, 0),
            orderDate: new Date(),
            createdDate: new Date().toLocaleDateString(),
            createdTime: new Date().toLocaleTimeString(),
            currentStatus:"pending",
            tableName:"",
            note:"",
            subTotal:cartItems.reduce((total, item) => total + item.Sales_Price * item.quantity, 0) - 400,
            ExtraDiscount:0,
            ExtraDiscPercentage:0,
            ServiceCharge:400,
            ServiceChargePercentage:0,
            Deleted:0,
            UUID:"",
            OrderType:"web order",
            IsPaid:"",
            ReasonRemark:"",
            ReasonCategory:"",
            parkNo:"",
            invoiceNo:"",
            deletedBy:"",
            rejectedBy:"",
            confirmedBy:"",
            1: 0,
            2: 0,
            3: 0,
            4: 0,
        };

        // Create a new document in the 'orders' collection
        const orderRef = await addDoc(ordersRef, orderData);
        const orderDocRef = doc(db, ordersRef.path, orderRef.id);
        await updateDoc(orderDocRef, { orderAutoID: orderRef.id });
        // Loop through each item in cartItems to create individual order items
        for (const [index, item] of cartItems.entries()) {
            const orderItemData = {
                orderAutoID: orderRef.id, // Link to main order
                orderID:"Order - " + orderID,
                lineOrder: index + 1,
                itemAutoID: item.Item_ID_Auto,
                itemID: item.Item_ID,
                itemName: item.Item_Name,
                itemEngName: item.Item_Eng_Name || "", // Assuming optional English name
                quantity: item.quantity,
                UUID:orderRef.id,
                salePrice: item.Sales_Price,
                lineTotal: item.Sales_Price * item.quantity,
                remark: "",
                Deleted: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
            };

            // Add each order item to a sub-collection within the order
            await addDoc(orderItemsRef, orderItemData);
        }

        console.log("Order and order items saved successfully");
    } catch (error) {
        console.error("Error saving order:", error);
    }
};
