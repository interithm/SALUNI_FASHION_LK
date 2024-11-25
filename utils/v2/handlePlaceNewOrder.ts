import { doc, setDoc, collection, addDoc, updateDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { customerHandler } from './customer/customerhandler';
import { customerIdHandler } from './customer/customerIdHandler';
import { orderIdHandler } from './order/orderIdHandler';
import { orderHandler } from './order/orderhandler';
import { orderIdIncrement } from './order/orderIdIncrement';
import { paymentIdHandler } from './payment/paymentIdHandler';
import { paymenthandler } from './payment/paymenthandler';
import { paymentIdIncrement } from './payment/paymentIdIncrement';
import { paymentGateway } from './payment/paymentGateway';


export const handlePlaceNewOrder = async (billingDetails, cartItems, onlinePaymentData, paymentMethod) => {

    let orderID;
    let paymentID;

    try {
        customerHandler(billingDetails);
        const customerID = await customerIdHandler(billingDetails);
        orderID = await orderIdHandler();
        paymentID = await paymentIdHandler();

        console.log(customerID);
        console.log(orderID);
        console.log(paymentID);
        console.log(cartItems);
        console.log('payemtn data' , onlinePaymentData);
        console.log(billingDetails);

        // then conditionally call the functions accroding to the payment types

        if (paymentMethod === 'cod') {
            orderHandler(cartItems, orderID, customerID, billingDetails);
            paymenthandler(onlinePaymentData, paymentID, orderID, customerID);
            orderIdIncrement(orderID);
            paymentIdIncrement(paymentID);
            console.log("All Ids Are Incremented");
            
        }
        else if (paymentMethod === "gateway") {
            orderHandler(cartItems, orderID, customerID, billingDetails);
            paymenthandler(onlinePaymentData, paymentID, orderID, customerID);
            await paymentGateway(onlinePaymentData ,paymentID);
            orderIdIncrement(orderID);
            paymentIdIncrement(paymentID);
            console.log("All Ids Are Incremented");
            
        }
        else {
            console.log("User select the koko payment gateway");
        }

    } catch (error) {
            console.log("Error while processing orders", error);
    } finally {

    }
}

