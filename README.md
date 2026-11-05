InterviewAI

InterviewAI is a simple interview-practice app that asks role-based questions and uses Gemini to generate feedback on your answers.

Features

- Practice interview questions for different job roles
- Get AI-generated feedback on answers
- View saved feedback after refreshing the page

Requirements

- Node.js and npm
- A Gemini API key

Setup

1. Install backend dependencies

Open a terminal in the project folder:

cd server
npm install

Create a ".env" file inside "server" and add your Gemini API key using the environment-variable name already used in "server.js". Do not commit or share this file.

2. Install frontend dependencies

Open a second terminal:

cd client
npm install

Run the app

Start the backend

In one terminal:

cd server
npm start

Start the frontend

In another terminal:

cd client
npm run dev

Open the local URL printed by Vite in your browser.

Notes

- Keep both the backend and frontend terminals running while using the app.
- Interview feedback is saved in the browser's local storage.
- Never share your API key or commit your ".env" file.