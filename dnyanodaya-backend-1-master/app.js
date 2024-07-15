const express = require('express');
const cors = require('cors');
const app = express();
const studentRoute = require('./api/routes/student');
const userRoute = require('./api/routes/user');
const attendanceRoute = require('./api/routes/attendanceRoutes');
const facultyRoute = require('./api/routes/faculty');
const HeadphonecorouselRoute = require('./api/routes/headphoneCor');
const productRoutes = require('./api/routes/Product');
const headphoneUserRoutes = require('./api/routes/headphoneUser');
const categoryRoutes = require('./api/routes/Category'); 
const credenceRoutes = require('./api/routes/Credence'); 
const cartRoutes = require('./api/routes/Cart'); 
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');

// Define the allowed origins
const allowedOrigins = ['https://ecommerce-headphone-delta.vercel.app','http://localhost:3000', 'https://dnyanodaya-frontend.vercel.app'];

// Use async/await for the database connection
async function connectDb() {
    console.log("inside connectdb");
    try {
        await mongoose.connect('mongodb+srv://narendrakandalkar:narendra@dnyanodaya.jvvxor2.mongodb.net/dnyanodaya?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database...");
    } catch (error) {
        console.error("Connection to database failed:", error.message);
    }
}

connectDb();

// Move the event listeners after the connection is established
mongoose.connection.on('error', err => {
    console.error('Connection failed:', err.message);
});

mongoose.connection.on('connected', () => {
    console.log('Connected with the database...');
});

// Configure CORS middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        exposedHeaders: ['Authorization'], // Expose additional headers if needed
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific request headers
        optionsSuccessStatus: 204,
    })
);

app.use(fileupload({ useTempFiles: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use("/user", userRoute);
app.use('/attendance', attendanceRoute);
app.use('/headphone-corousel', HeadphonecorouselRoute);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/ntune-user',headphoneUserRoutes)
app.use('/api/cart', cartRoutes);
app.use('/api/credence-routes', credenceRoutes);


app.use((req, res, next) => {
    res.status(404).json({
        message: 'Bad request'
    });
});

app.use((req, res, next) => {
    res.status(200).json({
        message: 'app is running'
    });
});

module.exports = app;
