export const paymentGateway = async (onlinePaymentData , orderID:number) => {
    console.log("Navigating to online portal...");

    try {
        const response = await fetch('/api/onepay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...onlinePaymentData , additional_data:orderID.toString()}),
        });

        const data = await response.json();

        if (data?.data?.gateway?.redirect_url) {
            console.log('Payment success:', data);
            window.location.href = data.data.gateway.redirect_url;
        } else {
            console.error('Payment error:', data);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};
