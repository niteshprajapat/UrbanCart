import express from 'express';
import dotenv from 'dotenv';

dotenv.config({});


const app = express();
const port = 5000;

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is UP for UrbanCart!"
    })
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})