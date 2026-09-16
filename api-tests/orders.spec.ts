import {test, expect} from '@playwright/test';

test('create order', async ({request}) => {
    const orderPayload = {
        customerDetails:{
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            address: "123 Main St",
            city: "Anytown",
            zipCode: "12345",
            country: "USA"
        },
        items:[
            {
                productId: "504",
                quantity:1
            }
        ]
    };

    const orderResponse = await request.post('/orders',{
        data: orderPayload
    });
    //check order status code
    expect(orderResponse.status()).toBe(201);
    
    const orderBody = await orderResponse.json();

    //check structure of the response body
    expect(orderBody).toHaveProperty('success', true);
    expect(orderBody).toHaveProperty('data');
    expect(orderBody.data).toHaveProperty('orderId');
    console.log(orderBody);
});