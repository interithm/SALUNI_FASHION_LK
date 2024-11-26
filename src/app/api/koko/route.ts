import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    const mId = 'c8cca514bdfa0582cdc40c9703c71e9d';
    const apiKey = '83fA5n1xUaj8OKnX23YY5vlni5q39gBi';
    const responseUrl = 'https://salunifashion.lk/api/koko-callback';
    const cancelUrl = 'https://salunifashion.lk/payment/koko-payment-failed';
    const returnUrl = 'https://salunifashion.lk/payment/koko-payment-success';
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCnAPcpmvA3Iipb7Fn+eAmO/P4Xv8y+PVm8FrDhqOSeMqaUQmzf
iZ6xw+ejCmye46MMW5SaA03Hnm0WGDXqYhMR0TiWUgXRCeQImxSq+wXwd+0ufxW+
ANnvH9l/mxcPwlGr2BKJTUJy2NQt8FZ9R6NSfIlKzdyGStvzF3j0KdBnjQIDAQAB
AoGAVMjwsnaurc7yomiD5+UZNTbL6VK+p3aOMCd09ZvBNW+RkoOGspYzsxw6ZVPN
gX0gMg3si6RRwJ5101nHRY81DmysZ90kgJsknqxUuwKGU6k2Wk18JqJBLGLXilwR
Z5/NjdgohoZDrJbbr029LNLZ06pvpdXtvVRM9A1XZVzEnAECQQDQ02Wg7nGFvS4M
yRWMHNARLto19W/Q+BlCsWRCDYO5zns9BtaqzZ3CyOAaXObDs6ZWpCEY+3e84u3X
pvBpdOGtAkEAzLr15YBG9Y3hQgErwIUd0dSlYiDzaIM9DszIh+lzCIi/bUM6nXQi
IZ0zDJmLjwa0bMduO+ZDiUbxuCFlxhEZYQJAdpTEbhlYr4gYwTvil3i5EjjXwrJH
t5NazMts0jFYbsd4pdPfTIiMIFLvJylABTtbpnF3Nfd+K+10//OVK10q1QJBAMLU
qW3exaipfNTziE+OXvJxC3J3KS0st85909iDsZVNjd7NO9rbyh9zGkHDXayfFNTw
dVdLqrnZae9w2QnE/AECQF+cRPcQMA1wbmOBCyn/C1YAMji71DtplJF9fFOxlp9P
XdzBrBj9flrwjasEs3WKrepvZ9A0GT5HaG15ULd2/rc=
-----END RSA PRIVATE KEY-----`;

    try {
        // Parse the incoming request data
        const apiData = await req.json();
        console.log('Received API Data:', apiData);

        // Combine incoming data with fixed fields
        const totalData = {
            _mId: mId,
            api_key: apiKey,
            _returnUrl: returnUrl,
            _cancelUrl: cancelUrl,
            _responseUrl: responseUrl,
            ...apiData,
        };

        // Create the data string in the correct order
        const createDataString = (data: any) => {
            return (
                data._mId +
                data._amount +
                data._currency +
                data._pluginName +
                data._pluginVersion +
                data._returnUrl +
                data._cancelUrl +
                data.orderId +
                data._reference +
                data._firstName +
                data._lastName +
                data._email +
                data._description +
                data.api_key +
                data._responseUrl
            );
        };

        const dataString = createDataString(totalData);

        const sign = crypto.createSign('sha256');
        sign.update(dataString); // Add the data string to the signer
        const signature = sign.sign(privateKey, 'base64'); // Get the signature in base64 format

        console.log('Generated Signature:', signature);

        console.log('Generated Data String:', dataString , "And The signature is this", signature);

        // Decode the provided signature
        const providedSignature = Buffer.from(apiData.signature, 'base64');

        // Verify the signature
        const isValid = crypto.verify(
            'sha256', // Hash algorithm
            Buffer.from(dataString, 'utf-8'), // Data to verify
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            providedSignature // Decoded signature
        );

        console.log('Signature verification result:', isValid);

        if (!isValid) {
            return NextResponse.json({ success: false, message: 'Invalid signature' });
        }

        // Prepare the processed data for the payment gateway
        const dataStringProcessed = JSON.stringify(apiData).replace(/\s/g, '');
        console.log('Processed Data String:', dataStringProcessed);

        // Proceed with sending data to the KoKo API or further processing
        return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Error during KoKo payment process:', error);
        return NextResponse.json({ success: false, message: 'Error during payment process' });
    }
}
