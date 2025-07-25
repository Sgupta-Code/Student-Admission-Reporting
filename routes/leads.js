const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// create a new lead
router.post('/', async (req, res) =>{
    try{
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    } catch(error){
        res.status(400).json({error: error.message});
    }
});


//get all leads
router.get('/', async(req, res) =>{
    try{
        const leads = await Lead.find().populate('counselorId', 'name region');
        res.json(leads);
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

//update the lead status
router.patch('/:id/status', async(req,res) =>{
    try{
        const {status} = req.body;
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            {status},
            {new: true}
        );
        res.json(lead);
    } catch(error){
        res.status(400).json({error: error.message});
    }
});

module.exports = router;