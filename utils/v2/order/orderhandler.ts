import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const orderHandler = async (cartItems , orderID , customerID , billingDetails) => {

    const orgDocId = "20240711-1011-SaluniFashion";
    const orderItemsRef = collection(db, 'organizations', orgDocId, 'order_items');
    const ordersRef = collection(db, 'organizations', orgDocId, 'orders');


    try {
        // Prepare order-level data
        const orderData = {
            customerName:billingDetails.name,
            customerID:customerID,
            customerAddress:billingDetails.address,
            customerAddress2:billingDetails.city,
            customerAddress3:billingDetails.postalCode,
            orderAutoID: "", // Generate an auto ID if needed
            orderID: orderID,
            orderDate: new Date(),
            totalAmount: cartItems.reduce((total, item) => total + item.Sales_Price * item.quantity, 0),
            1: 0,
            2: 0,
            3: 0,
            4: 0,
        };

        // Create a new document in the 'orders' collection
        const orderRef = await addDoc(ordersRef, orderData);

        // Loop through each item in cartItems to create individual order items
        for (const [index, item] of cartItems.entries()) {
            const orderItemData = {
                orderAutoID: orderRef.id, // Link to main order
                orderID: orderID,
                lineOrder: index + 1,
                itemAutoID: item.Item_ID_Auto,
                itemID: item.Item_ID,
                itemName: item.Item_Name,
                itemEngName: item.Item_Eng_Name || "", // Assuming optional English name
                quantity: item.quantity,
                UUID: item.UUID,
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
