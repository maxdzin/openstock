Want to vibe code this App ? It's recommended to use this [$10 Coding AI tool with OpenCode](https://z.ai/subscribe?ic=SVEALL4DWW) 🚀 _(+10% off via this link!)_ - the AGENTS.md file is optimized for it.

# OpenStock

A modern, self-hosted inventory and stock management system built with Nuxt 4 and Cloudflare.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82.svg)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020.svg)

## 🎮 Demo

Give it a try: [openstock-v2.pages.dev](https://openstock-v2.pages.dev/)

- **User:** demo@demo.com
- **Password:** 12345678

## ✨ Features

- **Product Management** — Track products with SKU, barcode, variants, and categories
- **Supplier Management** — Manage supplier information, contacts, and product associations
- **Automatic Pricing** — Calculate selling prices from cost + margin with tax support
- **Tax Configuration** — Multiple tax rates with default selection
- **Stock Movements** — Full audit trail of inventory changes (in/out/adjustment)
- **Price History** — Track price changes over time
- **Low Stock Alerts** — Get notified when stock runs low
- **Dashboard & Charts** — Visual analytics for stock levels and movements
- **Multi-variant Support** — Products with size, color, or other variants

## 🛠 Tech Stack

| Category      | Technology                                                                  |
| ------------- | --------------------------------------------------------------------------- |
| **Framework** | [Nuxt 4](https://nuxt.com/) with Vue 3 Composition API                      |
| **Styling**   | [TailwindCSS](https://tailwindcss.com/)                                     |
| **Database**  | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite at the edge) |
| **ORM**       | [Drizzle ORM](https://orm.drizzle.team/)                                    |
| **Hosting**   | [Cloudflare Pages](https://pages.cloudflare.com/)                           |
| **Cache/KV**  | [Cloudflare KV](https://developers.cloudflare.com/kv/)                      |
| **Hub**       | [NuxtHub](https://hub.nuxt.com/)                                            |
| **Charts**    | [Chart.js](https://www.chartjs.org/) with vue-chartjs                       |
| **Icons**     | [Lucide Icons](https://lucide.dev/) via @nuxt/icon                          |

## 📋 Prerequisites

- **Node.js** 18 or later ([Download](https://nodejs.org/))
- **Cloudflare account** ([Sign up](https://dash.cloudflare.com/sign-up) - free tier available)

## 🚀 Quick Start (Automated)

The easiest way to get started is using the installation script:

```bash
# Clone the repository
git clone https://github.com/florianjs/openstock.git
cd openstock

# Make the script executable
chmod +x install.sh

# Run the installer (full setup + deployment)
./install.sh
```

### Installation Script Options

| Command                    | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `./install.sh`             | Full installation and deployment to Cloudflare |
| `./install.sh --dev`       | Development setup only (no deployment)         |
| `./install.sh --deploy`    | Skip setup, deploy existing configuration      |
| `./install.sh --no-deploy` | Full setup without deployment                  |
| `./install.sh --help`      | Show help message                              |

The script will:

1. ✅ Check prerequisites (Node.js, npm)
2. ✅ Install project dependencies
3. ✅ Create and configure `.env` file with secure session password
4. ✅ Authenticate with Cloudflare (opens browser)
5. ✅ Create D1 database and KV namespace
6. ✅ Update `wrangler.toml` with resource IDs
7. ✅ Run database migrations
8. ✅ Build and deploy to Cloudflare Pages

## 🔧 Manual Setup

If you prefer manual setup or need more control:

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set a secure session password (32+ characters)
```

### 3. Cloudflare Authentication

```bash
npx wrangler login
```

### 4. Create Cloudflare Resources

```bash
# Create D1 database
npx wrangler d1 create openstock-db

# Create KV namespace
npx wrangler kv:namespace create openstock_kv
```

> ⚠️ After creation, copy the returned IDs to `wrangler.toml`.

### 5. Run Migrations

```bash
# Apply migrations to remote database
for file in migrations/*.sql; do
  npx wrangler d1 execute openstock-db --remote --file="$file" --yes
done
```

### 6. Configure Cloudflare Pages Environment

After the first deployment, add the session password in Cloudflare Dashboard:

1. Go to **Workers & Pages** → **openstock-v2** → **Settings** → **Environment variables**
2. Add variable:
   - **Name:** `NUXT_SESSION_PASSWORD`
   - **Value:** Copy from your `.env` file (or generate with `openssl rand -base64 32`)
   - Check **Encrypt**
3. Save and redeploy

### 7. Deploy

```bash
npm run build
npm run deploy:cf
```

## 💻 Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The development server uses NuxtHub's local proxy for Cloudflare resources.

## 📦 Available Scripts

| Script                | Description                             |
| --------------------- | --------------------------------------- |
| `npm run dev`         | Start development server                |
| `npm run build`       | Build for production                    |
| `npm run preview`     | Preview production build locally        |
| `npm run deploy:cf`   | Build and deploy to Cloudflare Pages    |
| `npm run db:generate` | Generate migrations from schema changes |

## 🗄 Database

### Schema

The database schema is defined in `server/database/schema.ts` using Drizzle ORM.

### Generate Migrations

After modifying the schema:

```bash
npm run db:generate
```

### Apply Migrations (Remote)

```bash
npx wrangler d1 execute openstock-db --remote --file=migrations/XXXX_migration.sql --yes
```

## 📁 Project Structure

```text
├── app/                    # Frontend application (Nuxt 4)
│   ├── components/         # Vue components
│   │   ├── ui/             # Reusable UI components
│   │   └── charts/         # Chart components
│   ├── composables/        # Vue composables
│   ├── layouts/            # Page layouts
│   ├── pages/              # File-based routing
│   ├── plugins/            # Nuxt plugins
│   └── assets/             # CSS and static assets
├── server/                 # Backend (Nitro)
│   ├── api/                # API endpoints
│   ├── database/           # Drizzle schema
│   └── utils/              # Server utilities
├── migrations/             # SQL migration files
├── documentation/          # Product documentation
├── public/                 # Static files
├── install.sh              # Automated setup script
├── wrangler.toml           # Cloudflare configuration
└── nuxt.config.ts          # Nuxt configuration
```

## 🌐 API Endpoints

| Method   | Endpoint                | Description             |
| -------- | ----------------------- | ----------------------- |
| `GET`    | `/api/products`         | List all products       |
| `POST`   | `/api/products`         | Create a product        |
| `GET`    | `/api/products/:id`     | Get product details     |
| `PUT`    | `/api/products/:id`     | Update a product        |
| `DELETE` | `/api/products/:id`     | Delete a product        |
| `GET`    | `/api/categories`       | List all categories     |
| `GET`    | `/api/suppliers`        | List all suppliers      |
| `GET`    | `/api/movements`        | List stock movements    |
| `POST`   | `/api/movements`        | Record a stock movement |
| `GET`    | `/api/taxes`            | List tax rates          |
| `GET`    | `/api/dashboard/stats`  | Dashboard statistics    |
| `GET`    | `/api/dashboard/charts` | Chart data              |

## 🔒 Environment Variables

| Variable                | Description                                                     | Required |
| ----------------------- | --------------------------------------------------------------- | -------- |
| `NUXT_SESSION_PASSWORD` | Session encryption key (32+ chars)                              | ✅       |
| `NUXT_MIGRATE_SECRET`   | Secret key to access `/api/__migrate` in production             | ❌       |
| `NUXT_ADMIN_SECRET_KEY` | Secret key to access admin endpoints (seed/clear) in production | ❌       |

## 🛠️ Admin Endpoints

These endpoints are available for database management:

| Endpoint            | Description                                   |
| ------------------- | --------------------------------------------- |
| `POST /api/__seed`  | Seed the database with sample data            |
| `POST /api/__clear` | Clear all data (preserves users and settings) |

### Access Control

- **Development:** Always accessible without authentication
- **Production:** Requires `NUXT_ADMIN_SECRET_KEY` environment variable

### Usage in Production

1. Set `NUXT_ADMIN_SECRET_KEY` in your Cloudflare Pages environment:

   ```bash
   # Generate a secure key
   openssl rand -hex 32
   ```

2. Call the endpoint with the secret key:

   **Via query parameter:**

   ```bash
   curl -X POST "https://your-app.pages.dev/api/__seed?key=YOUR_SECRET_KEY"
   ```

   **Via header:**

   ```bash
   curl -X POST -H "x-admin-secret: YOUR_SECRET_KEY" https://your-app.pages.dev/api/__seed
   ```

> ⚠️ **Security Note:** These endpoints are powerful and should only be used for demo/staging environments. Never expose the secret key publicly.

## 🗃️ Database Migrations

### Automatic Table Creation

On first deployment, the `users` table is automatically created when accessing `/api/auth/check` or `/api/auth/setup`. No manual migration is required for initial setup.

### Manual Migration Endpoint

For applying all database migrations manually, use the protected `/api/__migrate` endpoint:

**In development:**

```bash
curl http://localhost:3000/api/__migrate
```

**In production:**

1. Set `NUXT_MIGRATE_SECRET` environment variable in Cloudflare Pages
2. Call the endpoint with the secret header:

```bash
curl -H "x-migrate-secret: YOUR_SECRET" https://your-app.pages.dev/api/__migrate
```

### Using Wrangler (Alternative)

You can also apply migrations directly using Wrangler:

```bash
npx wrangler d1 execute openstock-db --remote --file=migrations/XXXX_migration.sql --yes
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [NuxtHub Documentation](https://hub.nuxt.com/docs)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
