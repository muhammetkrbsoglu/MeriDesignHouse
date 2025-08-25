// Test ortamı için environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Test veritabanı (mock)
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Test Clerk keys
process.env.CLERK_SECRET_KEY = 'test_clerk_secret_key';
process.env.CLERK_PUBLISHABLE_KEY = 'test_clerk_publishable_key';

// Test ImageKit keys
process.env.IMAGEKIT_PUBLIC_KEY = 'test_public_key';
process.env.IMAGEKIT_PRIVATE_KEY = 'test_private_key';
process.env.IMAGEKIT_URL_ENDPOINT = 'https://test.imagekit.io';
process.env.IMAGEKIT_ID = 'test_id';

// Test WhatsApp keys
process.env.WHATSAPP_API_TOKEN = 'test_whatsapp_token';
process.env.WHATSAPP_PHONE_NUMBER_ID = '+905551234567';

// Test JWT
process.env.JWT_SECRET = 'test-jwt-secret-key';
