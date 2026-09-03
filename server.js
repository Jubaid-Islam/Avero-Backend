import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

import dns from 'node:dns';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

dns.setServers(["1.1.1.1", "1.0.0.1"]);


const [{ default: app }, { default: connectDB }] = await Promise.all([
  import('./src/app.js'),
  import('./src/config/db.js'),
]);


const PORT = process.env.PORT || 5000;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});