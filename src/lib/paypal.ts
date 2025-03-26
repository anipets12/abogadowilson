import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

export const configurePayPal = (clientId: string, clientSecret: string, mode: 'sandbox' | 'live') => {
  const environment = mode === 'sandbox' 
    ? new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
};

export const createOrder = async (client: any, amount: number) => {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount.toString()
      }
    }]
  });

  const order = await client.execute(request);
  return order.result;
};
