// implement koko payment gateway

import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { amount, reference, customer_first_name, customer_last_name, customer_phone_number, customer_email, additional_data } = await req.json();

        // Transaction data
        const transactionData = {
            amount,
            app_id: process.env.NEXT_PUBLIC_ONEPAY_APP_ID, // Replace with your actual app_id
            reference,
            customer_first_name,
            customer_last_name,
            customer_phone_number,
            customer_email,
            transaction_redirect_url: 'https://salunifashion.lk/', // Replace with your actual redirect URL
            currency: 'LKR',
            additional_data
        };

        // Convert request body to string and remove spaces
        let transactionDataString = JSON.stringify(transactionData).replace(/\s/g, '');

        // Append hash salt
        const hashSalt = process.env.ONEPAY_HASH_SALT; // Replace with your actual hash salt
        transactionDataString += hashSalt;

        // Generate the SHA-256 hash
        const hash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

        // Prepare the request to Onepay
        const url = `https://merchant-api-live-v2.onepay.lk/api/ipg/gateway/request-payment-link/?hash=${hash}`;

        const headers = {
            Authorization: process.env.ONEPAY_AUTH_TOKEN, // Replace with your actual token
            'Content-Type': 'application/json'
        };

        // Make the request to Onepay
        const response = await axios.post(url, transactionData, { headers });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
