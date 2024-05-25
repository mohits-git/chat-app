## Chat App

A simple realtime chat application with React, Socket.io, express and Mongo.

With Chat App you can login, search friends with their emails and just start chatting.

## Teck Stack: 
- React
- Socket.io
- Express / Node
- MongoDB
- JWT

## Get Started
```bash
git clone https://github.com/mohits-git/chat-app.git
```
#### For Server:-
```bash
cd server
npm intall
```
Create `.env` file and add env's: 
```
FRONTEND_URL="http://localhost:5173"
FRONTEND_DOMAIN="localhost:5173"
PORT=8080
MONGODB_URI=
JWT_SECRET_KEY=
```
Run the development server:
```bash
npm run dev # with nodemon installed on your machine
# or
node index.js
```
#### For Client:-
```bash
cd client
npm intall
```
Create `.env` file and add env's: 
```
VITE_BACKEND_URL="http://localhost:8080"
VITE_CLOUDINARY_CLOUD_NAME= 
```
Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the project running.
