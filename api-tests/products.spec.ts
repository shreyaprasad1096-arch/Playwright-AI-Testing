import {test,expect} from '@playwright/test';
test('should get all products', async ({request}) => {
    const response = await request.get('/products');
   // console.log(response);
   // 2. Log the raw response text to see the HTML content
  //const responseText = await response.text();
  //console.log('Raw Response:', responseText);
  expect(response.status()).toBe(200);
  //check header
  expect(response.headers()['content-type']).toBe('application/json');

   const responseBody = await response.json();

   //reponse structure validation
   expect(responseBody).toHaveProperty('success',true);
   expect(responseBody).toHaveProperty('data');
   expect(Array.isArray(responseBody.data)).toBe(true);
   expect(responseBody.data.length).toBeGreaterThan(0);
   //console.log(responseBody);
});