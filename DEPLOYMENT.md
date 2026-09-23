# Zippy E-Commerce Project - Deployment Guide

This guide provides step-by-step instructions for deploying the **Zippy E-Commerce Platform** across **Vercel** (Frontend), **Render** (Backend Web Service), and **Neon** (Serverless PostgreSQL Database) or **MongoDB Atlas**.

---

## Architecture Overview

```
 ┌────────────────────────┐
 │   Zippy React Frontend │  ==> Deployed on Vercel
 │ (zippy-frontend-main)  │
 └───────────┬────────────┘
             │ HTTP / WebSockets
             ▼
 ┌────────────────────────┐
 │   Zippy Express API    │  ==> Deployed on Render
 │  (zippy-backend-main)  │      (Node.js + Socket.io)
 └───────────┬────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
 ┌──────────┐  ┌──────────────┐
 │ Cloudinary│  │ Neon Postgres│ / MongoDB Atlas
 └──────────┘  └──────────────┘
```

---

## Step 1: Deploy Backend to Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing `zippy-backend-main`.
4. Configure the service details:
   - **Name**: `zippy-backend`
   - **Region**: Select closest to your users (e.g. Singapore or Frankfurt)
   - **Root Directory**: `zippy-backend-main`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
5. Add the following **Environment Variables**:
   - `PORT`: `8080`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/zippy` (or your database URI)
   - `DATABASE_URL`: `postgresql://<user>:<password>@<neon-host>/zippy?sslmode=require` (for Neon DB)
   - `CLOUDINARY_CLOUD_NAME`: `duhokqw0j`
   - `CLOUDINARY_API_KEY`: `736999584845369`
   - `CLOUDINARY_API_SECRET`: `rVgkQtDvgghhadMoQNoxuiw4bUI`
   - `RAZORPAY_KEY_ID`: `rzp_test_T4Zw9v5VFk4BbP`
   - `RAZORPAY_KEY_SECRET`: `Hi0pRW0yRzCHPGpt4S6tknhe`
   - `FRONTEND_URL`: `https://zippy-frontend.vercel.app` (Your Vercel URL)
6. Click **Create Web Service**. Save the generated URL (e.g., `https://zippy-backend.onrender.com`).

---

## Step 2: Set Up Database on Neon (Serverless PostgreSQL) / MongoDB Atlas

### Option A: Neon Serverless PostgreSQL
1. Log into [Neon Console](https://console.neon.tech).
2. Create a new project named **zippy-db**.
3. Copy the PostgreSQL connection string:
   `postgresql://<user>:<password>@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Set `DATABASE_URL` in your Render backend Environment Variables.

### Option B: MongoDB Atlas
1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a cluster and copy the connection string.
3. Set `MONGO_URI` in your Render backend Environment Variables.

---

## Step 3: Deploy Frontend to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository containing `zippy-frontend-main`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `zippy-frontend-main`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: `https://zippy-backend.onrender.com` (Your Render backend URL)
6. Click **Deploy**.

---

## Verification & Health Check

- **Backend Health Check**: Visit `https://zippy-backend.onrender.com/health` (should return `{ "status": "ok" }`).
- **Frontend App**: Visit your Vercel deployment URL to ensure product listing, login/register, live search, cart, and Razorpay checkout function seamlessly.
