require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const cors = require("cors");
const { broadcastActivity } = require('./controllers/activityController');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const topChartsRoutes = require('./routes/topCharts');
const googleRoute = require('./routes/googleRoutes');
const session = require('express-session');


require('./config/passportConfig'); // For OAuth

// Configure CORS to allow requests from your frontend
const corsOptions = {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies to be sent
};

const app = express();
app.use(cookieParser())
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors(corsOptions));


// Session setup
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'defaultSecret', // Use an environment variable for the secret
      resave: false, // Prevents session resaving if nothing has changed
      saveUninitialized: false, // Prevents saving uninitialized sessions
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
        httpOnly: true, // Prevents client-side access to the cookie
        maxAge: 1000 * 60 * 60 * 24, // Set the expiration time (1 day in this example)
      },
    })
  );




// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/user', userRoutes);
app.use('/api/topCharts', topChartsRoutes);
app.use('/api/google', googleRoute);


// DB Connection
connectDB();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log('Received message:', message);
        // You can broadcast the message or handle other logic here
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Attach the WebSocket server to our broadcast function
broadcastActivity.wss = wss;




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));