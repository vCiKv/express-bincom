# Technical Interview for Bincom

## Express(backend) && React + TypeScript + Vite(frontend)

## Setup

### Database

using any sql service/server of your choice create database `bincomphptest`
open `./database.sql` run the code on your sql server __(if code fails remove comments and try again)__
update database connection information

#### not using .env

in `db.js`

```js
const pool = mysql.createPool({
  host: "your host",
  user: "your user",
  password: "your password",
  database: "bincomphptest",
});
```

#### using .env

create `.env` in the root folder

```env
DB_HOST="your host"
DB_USER="your user"
DB_PASSWORD="your password"
DB_DATABASE="bincomphptest"
PORT=5000
```

in `db.js`

```js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
```

### Package Manager

get on your package manager

* pnpm (recommend)
* npm

#### using pnpm

* install packages

```bash
  pnpm install
  cd client
  pnpm install
```

* confirm or update `./package.json` in the root of the project

```json
"scripts": {
  "start-server": "nodemon server.js",
  "dev-client": "pnpm --filter client dev",
  "start": "concurrently \"pnpm run start-server\" \"pnpm run dev-client\"",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

* start server

```bash
pnpm start
```

#### using npm

* install packages

```bash
  npm install
  cd client
  npm install
```

* confirm or update `./package.json` in the root of the project

```json
"scripts": {
  "start-server": "nodemon server.js",
  "dev-client": "npm run dev --filter client",
  "start": "concurrently \"npm run start-server\" \"npm run dev-client\"",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

* start server

```bash
npm run start
```

### Open App

Navigate to [http://localhost:5173/](http://localhost:5173/) on your browser
