import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(
    Buffer.from(process.env.SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
);

const app = initializeApp({
    credential: cert(serviceAccount),
});

export const adminAuth = getAuth(app);

export default app;