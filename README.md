# ITPlugin - Minecraft Server Monitoring Application

Full-stack Minecraft server monitoring application deployed on Render.com.

## Architecture

- **API Server**: Express 5 REST API (Node.js) - Receives webhook events from Minecraft plugin
- **Dashboard**: React + Vite SPA - Admin monitoring dashboard
- **Resource Pack**: Static site - Hosts Minecraft resource pack ZIP for player download
- **Database**: PostgreSQL - Stores plugin events and API keys

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **Frontend**: React 18, Vite, React Router, Zustand, TanStack Query
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Render.com (free tier)

## Project Structure

```
/
├── render.yaml                              # Render blueprint
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
├── tsconfig.base.json
├── lib/
│   ├── api-spec/openapi.yaml               # OpenAPI contract
│   ├── api-client-react/src/               # Generated React Query hooks
│   ├── api-zod/src/                        # Generated Zod schemas
│   └── db/src/schema/index.ts              # Drizzle ORM schema
├── artifacts/
│   ├── api-server/                         # Express API server
│   └── dashboard/                          # React + Vite dashboard
└── resource-pack-hosting/                  # Static resource pack site
```

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Running locally

```bash
# Run all services in dev mode
pnpm dev

# Or run individually
pnpm --filter @workspace/api-server dev
pnpm --filter @workspace/dashboard dev
```

### Database Setup

```bash
# Set DATABASE_URL in .env
DATABASE_URL="postgresql://localhost:5432/itplugin"

# Push schema to database
pnpm --filter @workspace/db run push
```

## Deployment to Render.com

### Step 1: Push to GitHub

Push the entire workspace root to a GitHub repository (public or private).

### Step 2: Create Render Blueprint

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repo
4. Render reads `render.yaml` and shows the 3 services + 1 database
5. Click "Apply"

### Step 3: Configure Environment Variables

After deployment, configure the following:

**itplugin-api service:**
- `ALLOWED_ORIGINS`: Set to dashboard URL (e.g., `https://itplugin-dashboard.onrender.com`)

**itplugin-dashboard service:**
- `VITE_API_URL`: Set to API URL (e.g., `https://itplugin-api.onrender.com`)
- After setting, trigger a manual redeploy

### Step 4: Run Database Migrations

```bash
DATABASE_URL="<production connection string>" pnpm --filter @workspace/db run push
```

### Step 5: Seed API Keys

```bash
DATABASE_URL="<production connection string>" node --input-type=module << 'EOF'
import pg from 'pg';
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(`
  INSERT INTO api_keys (key, role) VALUES
    ('YOUR-ADMIN-KEY-HERE', 'admin'),
    ('YOUR-STAFF-KEY-HERE', 'staff')
  ON CONFLICT (key) DO NOTHING;
`);
console.log('Keys inserted');
await client.end();
EOF
```

### Step 6: Configure Minecraft Plugin

In `plugins/ITPlugin/config.yml`:

```yaml
webhooks:
  enabled: true
  server-name: "My Server"
  urls:
    default: "https://itplugin-api.onrender.com/api/events"
```

### Step 7: Configure Resource Pack

In `server.properties`:

```properties
resource-pack=https://itplugin-resourcepack.onrender.com/ITPlugin-ResourcePack.zip
resource-pack-sha1=9972e33cfa916c26dcf4ba4b8deb0ab3dbd3f1e7
resource-pack-prompt=ITPlugin custom icons required
resource-pack-required=false
```

## API Endpoints

All endpoints are served at the API service URL:

- `GET /api/healthz` - Health check
- `POST /api/auth/verify` - Verify API key
- `POST /api/events` - Receive plugin webhook event
- `GET /api/events` - List events (query: type, limit, offset)
- `GET /api/dashboard/summary` - Dashboard summary stats
- `GET /api/dashboard/tickets` - Get tickets from events
- `GET /api/dashboard/errors` - Get console errors
- `GET /api/dashboard/activity` - Get all events in reverse chronological order

## License

MIT
