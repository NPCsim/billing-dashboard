# LogiEdge Billing Platform

A modern, full-stack B2B interface built securely upon the PERN stack supporting highly interactive React Point-Of-Sale logic, seamless Invoice querying, and responsive Postgres aggregation arrays.

## 🔹 Project Overview
LogiEdge serves as an intelligent invoicing generator and repository explicitly routing `Grand Totals`, customized item cart arrays, distinct regional 18% GST vs 0% GST logic calculations via backend, and historical receipts indexed into an aggregated Read-Only Dashboard representation.

## 🔹 Tech Stack
- **Frontend**: React, Vite, Material UI (MUI), React Router
- **Backend Core**: Node.js, Express.js
- **Database Architecture**: PostgreSQL
- **Middleware**: CORS, DotEnv

## 🔹 Core Features Mapped
- **Dynamic 5-Route Master Entity Network:** Easily register active clients via explicit Form inputs bound across DB tables while flagging entities natively utilizing `Active`/`In-Active` chips.
- **Strict Billing Module POS Execution:** Shopping Cart UI fully decoupled from index architectures allowing infinite dynamic Line Items, specific quantity adjustments `(+)` and `(-)`, and localized calculations prior to executing backend `POST` commands.
- **Postgres Search Aggregations:** Native String mapping unifies relational Line Items safely bridging `Item_Invoices` cleanly to the API endpoints safely reducing REST bloat.

## 🔹 Local Setup Instructions
If evaluating locally, leverage the pre-written compilation binaries shipped identically within the repository:
1. Double-click `setup.bat` locally.
2. Ensure Docker or a valid PostgreSQL environment is running with matching parameters against `backend/.env`. Wait for the Database Seed tables to execute cleanly automatically generating the 12 master records correctly.
3. Once running, explore `localhost:5173`. 

## 🔹 Deployment Targets (Vercel & Render) 
The platform handles explicit cloud endpoints matching `process.env.DATABASE_URL` routing strictly.
- **Frontend App Live Application**: [Vercel Deployment Network](https://vercel.com)
- **Backend API Servers Live Host**: [Render API Routing Endpoint](https://render.com)
