import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to create delay
const delay = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms)
);

// Routes with configurable delays
app.get('/delay/:seconds', async (req, res) => {
  const seconds = parseInt(req.params.seconds) || 1;
  const delayMs = Math.min(seconds * 1000, 30000); // Max 30 seconds

  await delay(delayMs);

  res.json({
    message: `Response delayed by ${seconds} seconds`,
    timestamp: new Date().toISOString(),
    delay: `${seconds}s`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`   GET  /delay/:seconds - Delay response by specified seconds`);
});
