import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

// Serve static files from the current directory
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Resource pack server running on port ${port}`);
});
