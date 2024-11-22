import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export async function generateCustomId(prefix: string): Promise<string> {
  // Define the path to the specific counter document
  const orgDocId = "saluni-fashion-production-qa";
  const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'customer-id');

  // Fetch the current counter for the specified prefix
  const counterDoc = await getDoc(counterDocRef);

  if (counterDoc.exists()) {
    const currentCount = counterDoc.data()[prefix] || 0;
    const newCount = currentCount + 1;

    // Update Firestore with the new counter value
    // await updateDoc(counterDocRef, { [prefix]: increment(1) });

    // Return the formatted ID, e.g., "WC-01"
    return `${prefix}-${newCount.toString().padStart(2, '0')}`;
  } else {
    throw new Error("Counter document doesn't exist.");
  }
}
// Example usage
generateCustomId("WC").then((id) => console.log(id)); 



export async function generateOrderId(prefix: string): Promise<string> {

  const orgDocId = "saluni-fashion-production-qa";
  const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'order-id');

  const counterDoc = await getDoc(counterDocRef);
  if (counterDoc.exists()) {
    const currentCount = counterDoc.data()[prefix] || 0;
    const newCount = currentCount + 1;

    // await updateDoc(counterDocRef, { [prefix]: increment(1) });

    return `${prefix}-${newCount.toString().padStart(2, '0')}`;
  } else {
    throw new Error("Counter document doesn't exist.");
  }
}
generateOrderId("WO").then((id) => console.log(id)); 


export async function generatePaymentId(prefix: string): Promise<string> {

  const orgDocId = "saluni-fashion-production-qa";
  const counterDocRef = doc(db, 'organizations', orgDocId, 'increment-id', 'payment-id');

  const counterDoc = await getDoc(counterDocRef);
  if (counterDoc.exists()) {
    const currentCount = counterDoc.data()[prefix] || 0;
    const newCount = currentCount + 1;

    // await updateDoc(counterDocRef, { [prefix]: increment(1) });
 
    return `${prefix}-${newCount.toString().padStart(2, '0')}`;
  } else {
    throw new Error("Counter document doesn't exist.");
  }
}

generatePaymentId("WP").then((id) => console.log(id)); 