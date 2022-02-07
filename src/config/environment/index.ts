import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8080;

const env = {
  development: process.env.NODE_ENV === 'development',
  test: process.env.NODE_ENV === 'test',
  staging: process.env.NODE_ENV === 'staging',
  production: process.env.NODE_ENV === 'production',
}

const mongo = {
  url: process.env.DATABASE_URL
}

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET

const frontendDevURL = process.env.FRONTEND_DEV_URL
const frontendProdURL = process.env.FRONTEND_PROD_URL
const apolloStudioURL = process.env.APOLLO_STUDIO_URL

const backendDevURL = process.env.BACKEND_DEV_URL
const backendProdURL = process.env.BACKEND_PROD_URL

export { port, env, mongo, jwtAccessSecret, jwtRefreshSecret, frontendDevURL, frontendProdURL, apolloStudioURL, backendDevURL, backendProdURL };