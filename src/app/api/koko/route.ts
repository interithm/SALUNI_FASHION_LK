// implement koko payment gateway

import {NextResponse} from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST(req: Request) {

    const _mId = 'c8cca514bdfa0582cdc40c9703c71e9d';
    const api_key = '83fA5n1xUaj8OKnX23YY5vlni5q39gBi';
    const _responseUrl = 'https://salunifashion.lk/api/koko-callback';
    const _cancelUrl = 'https://salunifashion.lk/payment/koko-payment-failed';
    const _returnUrl = 'https://salunifashion.lk/payment/koko-payment-success';
    const privateKey = `  -----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY----- `;

    const apiData = await req.json();
    console.log("This Is Api Data 1", apiData);
    try {
        const totalData = [
            apiData._amount,
            apiData._currency,
            apiData.orderId,
            apiData._email,
            apiData._firstName,
            apiData._lastName,
            apiData._description,
            apiData._pluginVersion,
            apiData._reference,
            _cancelUrl,
            _returnUrl,
            api_key,
            _mId,
        ];
        console.log(totalData);
        const totalDataString = Buffer.from(request.totalDataString, 'base64');

        try {
            const isValid = crypto.verify(
                'sha256', // Hash algorithm
                Buffer.from(totalData), // Data to verify
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                totalDataString // Provided signature
            );

            console.log('Signature verification result:', isValid);
        } catch (error) {
            console.error('Error verifying signature:', error);
        }


        const dataString = JSON.stringify(apiData).replace(/\s/g, '');

        console.log("This Is Api Data 2", dataString);


    } catch (err) {
        console.log('This is error in koko payment process', err)
    }


}
