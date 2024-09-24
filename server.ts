import express from 'express';
import { initDatabase, getDb } from '@/database/init';

const app = express();

// Initialize database before setting up routes
initDatabase().then(() => {
  // Test route
  app.get('/test-db', async (req, res) => {
    try {
      const db = getDb();
      const result = await db.all('SELECT * FROM users');
      res.json({ message: 'Database test successful', result });
    } catch (error) {
      res.status(500).json({ 
        message: 'Database test failed', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});