# E-Commerce REST API - NestJS + Prisma + PostgresSQL

Production-ready REST API for managing users, products, orders and payments.

## Key Features

- JWT Authentication with Refresh Token
- Role-based Access Control (Admin / Customer)
- Products CRUD with Filtering & Pagination
- Orders Management with Multi-Item Support
- Payments Integration with Status Control
- Admin Dashboard Stats & Reports

## Tech Stack

- NestJS - Backend Framework
- Prisma ORM - Database Access Layer
- PostgresSQL - Database
- JWT - Authentication
- Swagger - API Documentation

```bash
git clone https://github.com/mhammadshami/ecommerce-api.git
cd ecommerce-api
npm install 
npm run start:dev
```

## Environment Variables

DATABASE_URL=
JWT_SECRET=

## API Documentation

Swagger: http://localhost:3000/api-docs