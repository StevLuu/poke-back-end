require("dotenv").config();
const { urlencoded } = require('express');
const express = require('express')
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require ('morgan')
const app = express();



const pokeController = require('./controllers/pokeController')
const userController = require('./controllers/userController');

const mongoURI = process.env.MONGO_URI
// Configuration
const db = mongoose.connection;

// Connect to Mongo
mongoose.connect( process.env.MONGO_URI );

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', process.env.MONGO_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
app.use(morgan('short'))
app.use(cors())
app.use(urlencoded({extended: true}))
app.use(express.json())

//USER CONTROLLER
app.use('/users', userController)
app.use('/pokes', pokeController)
app.get('/', (req, res)=>{
    res.send("hello, world")
})



const port = process.env.PORT || 3001
app.listen(port, ()=>{
    console.log('app running')
})

