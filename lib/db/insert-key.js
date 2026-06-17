import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

await sql`
  INSERT INTO api_keys (key, role) 
  VALUES ('675319da209eb496c22325bce59fe4734d66af2a73692329', 'admin')
  ON CONFLICT (key) DO NOTHING
`;

console.log('API key inserted');
await sql.end();
