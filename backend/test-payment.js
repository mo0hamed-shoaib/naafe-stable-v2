import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function testStripeConnection() {
  try {
    console.log('Testing Stripe connection...');
    console.log('Secret key (first 10 chars):', process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...');
    
    // Test creating a simple checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Service',
              description: 'Test payment for development',
            },
            unit_amount: 1000, // $10.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/',
    });

    console.log('✅ Stripe connection successful!');
    console.log('Session ID:', session.id);
    console.log('Checkout URL:', session.url);
    
    return session;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
    if (error.type) {
      console.error('Error type:', error.type);
    }
    throw error;
  }
}

// Run the test
testStripeConnection()
  .then(() => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 