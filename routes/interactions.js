const express = require('express');
const router = express.Router();
const Interaction = require('../models/Interaction');
const { validateInteraction } = require('../middleware/validation');

// create a new interaction
router.post('/', validateInteraction, async(req, res) => {
    try{
        const interaction = new Interaction(req.body);
        await interaction.save();
        res.status(201).json(interaction);
    } catch(error){
        res.status(400).json({error: error.message});
    }
});

// get interactions for a lead
router.get('/lead/:leadId', async(req, res) =>{
    try{
        const interactions = await Interaction.find({ leadId: req.params.leadId})
            .populate('counselorId', 'name region')
            .sort({ timestamp: -1});
        res.json(interactions);
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;