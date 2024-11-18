// app/api/callback/route.js
import { NextResponse } from 'next/server';
import { onlineSavePaymentData } from '../../../../utils/v2/paymentMethod/online';




export async function GET(){
  return NextResponse.json({ status: 'Call back endpoint is up and running' });
  
}


export async function POST(req) {
  try {
    const paymentData = await req.json();

    // Check if the payment was successful
    if (paymentData.status_message === 'SUCCESS') {
      console.log('Payment successful:', paymentData);

      // Call a function to save the payment data
      await onlineSavePaymentData(paymentData);

      // Send a success response
      return NextResponse.json({ message: 'Payment processed successfully' }, { status: 200 });
    } else {
      console.log('Payment not successful:', paymentData);
      return NextResponse.json({ message: 'Payment not successful' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

