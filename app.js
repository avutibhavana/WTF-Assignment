const express = require("express");
const app = express();
require('dotenv').config()
const connection = require('./db');
const userRoutes=require("./userRoutes")
const cors = require('cors');

connection();

app.use(cors())
app.use(express.json())


app.use("/",userRoutes)

const port = process.env.PORT || 3000;

app.listen(port,()=> console.log('3000 port is running'))