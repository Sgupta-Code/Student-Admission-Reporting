const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Counselor = require('../models/Counselor');
const Interaction = require('../models/Interaction');

mongoose.connect('mongodb://localhost:27017/admission_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await Lead.deleteMany({});
    await Counselor.deleteMany({});
    await Interaction.deleteMany({});

    console.log('Creating counselors...');
    const counselors = await Counselor.create([
      { name: 'Amit Sharma', region: 'North' },
      { name: 'Priya Reddy', region: 'South' },
      { name: 'Rahul Das', region: 'East' },
      { name: 'Neha Verma', region: 'West' }
    ]);

    console.log(`Created ${counselors.length} counselors`);

    console.log('Creating leads...');
    const leads = [];
    const sources = ['organic', 'ads', 'referral'];
    const statuses = ['new', 'contacted', 'demoed', 'admitted', 'rejected'];
    const leadNames = [
      'Rohan Mehta', 'Sneha Kapoor', 'Ankit Joshi', 'Divya Nair', 'Kunal Singh',
      'Isha Agarwal', 'Varun Rao', 'Meena Sharma', 'Arjun Yadav', 'Pooja Jain'
    ];

    for (let i = 0; i < 50; i++) {
      const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const counselor = counselors[i % counselors.length];
      const name = leadNames[i % leadNames.length];
      const email = name.toLowerCase().replace(' ', '.') + i + '@gmail.com';

      const lead = await Lead.create({
        name,
        email,
        phone: `+91${9000000000 + i}`,
        source: sources[i % sources.length],
        createdAt: randomDate,
        counselorId: counselor._id,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });

      leads.push({ ...lead._doc, counselorId: counselor._id }); // Ensure counselorId is stored
    }

    console.log(`Created ${leads.length} leads`);

    console.log('Creating interactions...');
    const interactionTypes = ['call', 'demo', 'followup', 'email'];
    let totalInteractions = 0;

    for (const lead of leads) {
      const numInteractions = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < numInteractions; j++) {
        const interactionDate = new Date(lead.createdAt.getTime() + j * 24 * 60 * 60 * 1000);

        await Interaction.create({
          leadId: lead._id,
          counselorId: lead.counselorId,
          interactionType: interactionTypes[j % interactionTypes.length],
          timestamp: interactionDate,
          notes: `${interactionTypes[j % interactionTypes.length]} interaction with ${lead.name}`,
          duration: Math.floor(Math.random() * 45) + 15
        });

        totalInteractions++;
      }
    }

    console.log(`Created ${totalInteractions} interactions`);

    console.log('\n Sample data seeded successfully!');
    console.log('Summary:');
    console.log(`   - ${counselors.length} counselors`);
    console.log(`   - ${leads.length} leads`);
    console.log(`   - ${totalInteractions} interactions`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  seedData();
});
