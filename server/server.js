import express from "express";
import { readdirSync } from "fs";
const morgan = require("morgan");
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();

//db connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("DB Connection Error: ", err));

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// route middleware
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
