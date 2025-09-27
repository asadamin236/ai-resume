import express from 'express';
import cors from 'cors';
import "dotenv/config";
import { connectDB } from './config/db.js';
import userRouter from './routes/UserRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import resumeRouter from './routes/ResumeRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());

//connectDB
connectDB()
//middleware
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/resume', resumeRouter);
app.use(
  "/upload",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.set("Access-Control-Allow-Origin", "*");
    }
  })
)
app.get('/', (req, res) => {
    res.send('API Working Properly');
});

app.listen(PORT, ()=> {
  console.log("Server start on port", PORT);
})

