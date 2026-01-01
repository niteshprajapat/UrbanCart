import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config({});
connectDB();

const app = express();
const port = process.env.PORT || 5000;


// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// routes middleware 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);


app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is UP for UrbanCart!"
    })
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})



