// const functions = require("firebase-functions");
// const axios = require("axios");
// const createHash = require("crypto");
// const cors = require("cors");

// // Initialize cors with no restrictions
// const corsHandler = cors({ origin: true });

// exports.createPaymentLink = functions.https.onRequest((req:any, res:any) => {
//   // Use corsHandler to handle preflight requests
//   corsHandler(req, res, async () => {
//     if (req.method !== 'POST') {
//       return res.status(405).send({ error: 'Method Not Allowed' });
//     }

//     try {
//       const {
//         amount,
//         reference,
//         customer_first_name,
//         customer_last_name,
//         customer_phone_number,
//         customer_email,
//       } = req.body;

//       const transactionData = {
//         amount,
//         app_id: functions.config().onepay.app_id,
//         reference,
//         customer_first_name,
//         customer_last_name,
//         customer_phone_number,
//         customer_email,
//         transaction_redirect_url: 'https://clothing-platform-nextjs-nkcq.vercel.app/api/callback',
//         currency: 'LKR'
//       };

//       let transactionDataString = JSON.stringify(transactionData).replace(/\s/g, '');
//       const hashSalt = functions.config().onepay.hash_salt;
//       transactionDataString += hashSalt;
//       const hash = createHash('sha256').update(transactionDataString).digest('hex');

//       const url = `https://merchant-api-live-v2.onepay.lk/api/ipg/gateway/request-payment-link/?hash=${hash}`;
//       const headers = {
//         Authorization: `Bearer ${functions.config().onepay.auth_token}`,
//         'Content-Type': 'application/json'
//       };

//       const response = await axios.post(url, transactionData, { headers });

//       return res.json(response.data);
//     } catch (error) {
//       console.error('Error:', error);
//       return res.status(500).json({ error: 'Something went wrong' });
//     }
//   });
// });



// const functions = require("firebase-functions");
// const savePaymentData = require("../../utils/v2/handlePlaceNewOrder");

// exports.paymentCallback = functions.https.onRequest(async (req:any, res:any) => {
//   if (req.method === 'GET') {
//     // Handle the GET request
//     return res.status(200).json({ status: 'Callback endpoint is up and running' });
//   }

//   if (req.method === 'POST') {
//     try {
//       const paymentData = req.body; // Firebase automatically parses JSON

//       // Check if the payment was successful
//       if (paymentData.message === 'success') {
//         console.log('Payment successful:', paymentData);

//         // Call a function to save the payment data
//         await savePaymentData(paymentData);

//         // Send a success response
//         return res.status(200).json({ message: 'Payment processed successfully' });
//       } else {
//         console.log('Payment not successful:', paymentData);
//         return res.status(200).json({ message: 'Payment not successful' });
//       }
//     } catch (error) {
//       console.error('Error processing payment callback:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }
// });


const functions = require("firebase-functions");

exports.callback = functions.https.onRequest(async (req: any, res: any) => {
  console.log('Init 1')
  if (req.method === 'GET') {
    console.log("call back url working correctly")
    
  }
  if (req.method === 'POST') {
    console.log('Init 2')
    try {
      const data = req.body; 
      console.log("body" ,data)// Firebase parses JSON automatically
      if (data.status_message === 'SUCCESS')
      res.status(200).json({ message: 'Success' });
      else {
        res.status(500).json({ message: 'Not Success' });
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'This is Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
});
