# Double Feature

## Description

Double Feature is a movie themed game where the player needs to make connections between movies based on the cast.

### Background

In the project, we were allowed to create anything and started without any existing code.
Due to the Easter longweekend, we worked on a reduced timeframe having just 8 days to complete
the project from initial planning to deployment and presenting.

### Structure

This repo contains two applications:

- A frontend React App
- A backend api using JS

These two applications communicates through HTTP requests, passing JSON data  
between each other, and need to be run separately.

### Try It Yourself!

[Link to Render](https://doublefeaturefrontendweb.onrender.com/)
Give it a minute to load - Free-Tier deployments shut down with inactivity
If the Initial Movie hasn't loaded when you start, click the logo, return to the homepage, count to 10, then try again :)

### Features

- Dark mode/light mode
- Audio on/off
- How to Play modal
- Difficulty selector (easy/hard)
  - Easy mode: always shows cast, 30 second timer
  - Hard mode: only shows cast on first film, 20 second timer
- Start game button
- Fetches initial film from API
- Input box for player to name a movie with overlapping cast member
- Auto complete dropdown box
- Dropdown box can be navigated using keyboard arrows and enter or trackpad/mouse
- Timer to track turn length
- End of game modal to show score and play again button
- Can navigate back to home page using logo

## Project History

**Group Project Phase:**
The core game functionality was developed as a collaborative group project, including:

- Movie selection and guessing mechanics
- TMDB API integration for movie data
- Basic game interface and components
- React + Vite setup with ESLint configuration

**Solo Development Phase:**
After the group project concluded, I continued development solo and added:

- User authentication system (login/signup)
- High scores tracking and leaderboard
- User profile management
- Database integration with PostgreSQL and Prisma
- Backend API with Express.js
- Deployment configuration for Render

## Tech Stack

### Frontend

- React with Vite
- JavaScript (ES6+)
- CSS3 for styling
- Fetch API for HTTP requests

### Backend

- Node.js with Express.js
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcrypt for password hashing

### External APIs

- The Movie Database (TMDB) API for movie data

### Deployment

- Render.com for both frontend, backend, and database hosting

## Features

### Core Game (Group Project)

- Random movie selection from TMDB
- Cast-based movie guessing
- Interactive game interface
- Movie search functionality

### Authentication & Scores (Solo Development)

- User registration and login
- Secure password hashing
- JWT-based authentication
- Personal high scores tracking
- Global leaderboard
- Score persistence across sessions

### Documentation

[Documentation of our applications can be found here.](./docs)

There is documentation for the [frontend](./docs/frontend_routes).

### Card wall

We developed this project with an **agile** workflow, working in week-long sprints and using  
a Trello board to track our tasks and help plan sprints.

Link to our Trello board: https://trello.com/b/M94bAVBI/final-project-double-feature

## Installation

### Install Node.js

If you haven't already, make sure you have node and NVM installed.

1. Install Node Version Manager (NVM)
   ```
   brew install nvm
   ```
   Then follow the instructions to update your `~/.bash_profile`.
2. Open a new terminal
3. Install the latest version of [Node.js](https://nodejs.org/en/), (`20.5.0` at
   time of writing).
   ```
   nvm install 20
   ```

### Set up the project

1. Fork this repository
2. Rename the fork
3. Clone the fork to their local machine
4. Install dependencies for both the `frontend` and `backend` applications:
   ```
   npm install
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

### Setting up environment variables.

We need to create two `.env` files, one in the frontend and one in the backend.

#### Frontend

Create a file `frontend/.env` with the following contents:

```
VITE_BACKEND_URL="http://localhost:3001"
```

#### Backend

Create a file `backend/.env` with the following contents:

```
DATABASE_URL="postgresql://username:password@localhost:5432/doublefeature"
TMDB_API_KEY="your_tmdb_api_key_here"
```

For an explanation of these environment variables, see the documentation.

### How to run the servers and use the app

1. Start both the frontend and backend applications from the root directory:

```
npm run dev
```

This will start both the frontend (React app) and backend (API server) concurrently.

Alternatively, you can start them separately:

2a. Start the backend server (in the `backend` directory):

```
cd backend
npm run dev
```

2b. Start the frontend application (in the `frontend` directory):

In a new terminal session...

```
cd frontend
npm run dev
```

3. Set up the database (in the `backend` directory):

```
cd backend
createdb doublefeature
npx prisma migrate dev --name initial_setup
```

You should now be able to open your browser and go to the application URL shown in the terminal (typically `http://localhost:5173` or `http://localhost:5174`) to get to the homepage and start exploring the application.

## Authors and acknowledgment

This project was initially created by:

[Kate Bancroft](https://github.com/KI-22)
[Fliss Douglas](https://github.com/flissd1795)
[Alister Ko](https://github.com/alistershko)
[Etienne Le Goater](https://github.com/Elegoater)
[Ben Loveday](https://github.com/StrawberryScot)
[Emily Sadler](https://github.com/EmiSadler)
[Louis Tse](https://github.com/Louistwt)

```

```
