export const kokoPaymentGateway = async (kokoOnlinePaymentData: any , orderID: number ) => {
    console.log( "Navigation to koko payment gateway portal  ","Got payment ID" , orderID);

    const requestBody = {
        ...kokoOnlinePaymentData,
        orderId: orderID,
    };

    console.log("Request body being sent to koko:", requestBody); // Log the request body

    try {
        const response = await fetch('/api/koko', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data) {
            console.log('Payment success:', data);
            // window.location.href = data.data.gateway.redirect_url;
        } else {
            console.error('Payment error:', data);
        }
    } catch (error) {
        console.error('Network error:', error);
    }

}