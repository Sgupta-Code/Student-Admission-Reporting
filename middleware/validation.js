const validateLead = (req, res, next) => {
    const { name, email, phone, source } = req.body;
    
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name is required and must be at least 2 characters' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
        return res.status(400).json({ error: 'Valid phone number is required' });
    }
    
    const validSources = ['organic', 'ads', 'referral'];
    if (!source || !validSources.includes(source)) {
        return res.status(400).json({ error: 'Source must be organic, ads, or referral' });
    }
    
    next();
};

const validateCounselor = (req, res, next) => {
    const { name, region } = req.body;
    
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Counselor name is required' });
    }
    
    if (!region || region.trim().length < 2) {
        return res.status(400).json({ error: 'Region is required' });
    }
    
    next();
};

const validateInteraction = (req, res, next) => {
    const { leadId, counselorId, interactionType } = req.body;
    
    if (!leadId) {
        return res.status(400).json({ error: 'Lead ID is required' });
    }
    
    if (!counselorId) {
        return res.status(400).json({ error: 'Counselor ID is required' });
    }
    
    const validTypes = ['call', 'demo', 'followup', 'email'];
    if (!interactionType || !validTypes.includes(interactionType)) {
        return res.status(400).json({ error: 'Invalid interaction type' });
    }
    
    next();
};

module.exports = {
    validateLead,
    validateCounselor,
    validateInteraction
};