# Task Manager API

A simple, robust REST API for managing tasks. Built with Node.js, Express, and MongoDB.

It handles user authentication (JWT) and ensures data isolation—users can only create, read, update, or delete their own tasks.

## Architecture & Flow

The API follows a standard MVC pattern. Authentication is handled via stateless JWTs.

[Image of JWT authentication flow diagram]

## Tech Stack

* **Node.js & Express** - Server & Routing
* **MongoDB & Mongoose** - Database & ODM
* **JsonWebToken (JWT)** - Authentication
* **BcryptJS** - Password security

## Getting Started

### 1. Setup

Clone the repo and install dependencies:

```bash
git clone <repository-url>
cd task-management-backend
npm install

# Development (with nodemon)
npm run dev

# Production
npm start