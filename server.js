const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reportRoutes = require('./routes/reports.js');
const leadRoutes = require('./routes/leads.js');
const counselorRoutes = require('./routes/counselors.js');
const interactionRoutes = require('./routes/interactions.js');

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());

//Database connection using mongoose
mongoose.connect(process.env.MONGODB__URI || 'mongodb://localhost:27017/admission_system',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected',() =>{
    console.log('connected to Database');
});

mongoose.connection.on('error', (err)=>{
    console.error('MongoDB connection error:', err);
});

//Routes
app.use('/api/report', reportRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/interactions', interactionRoutes);

app.get('/', (req,res) => {
    res.json({message: 'Student Admission Reporting System API'});
});

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;