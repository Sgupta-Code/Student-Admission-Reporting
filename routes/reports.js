const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Counselor = require('../models/Counselor');
const Interaction = require('../models/Interaction');
const moment = require('moment');
const {Parser} = require('json2csv');

const buildDataFilter = (from, to) => {
    const filter = {};
    if(from || to){
        filter.createdAt = {};
        if(from) filter.createdAt.$gte = new Date(from);
        if(to) filter.createdAt.$lte = new Date(to);
    }
    return filter;
};

//1. Funnel report API
router.get('/funnel',async (req,res) => {
    try{
        const {from, to , source} = req.query;

        let matchFilter = buildDataFilter(from,to);
        if(source) matchFilter.source = source;

        const pipeline = [
            { $match: matchFilter},
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1}
                }
            }
        ];

        const statusData = await Lead.aggregate(pipeline);

        //Initialize status counts
        const statusCounts = {
            new: 0,
            contacted: 0,
            demoed: 0,
            admitted: 0,
            rejected: 0
        };

        //Fill in actual counts
        statusData.forEach(item => {
            statusCounts[item._id] = item.count;
        });

        // Calculate conversion rates
        const totalLeads = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
        const conversions = {
            'new_to_contacted': statusCounts.contacted > 0 ? 
                ((statusCounts.contacted + statusCounts.demoed + statusCounts.admitted) / totalLeads * 100).toFixed(2) : 0,
            'contacted_to_demoed': statusCounts.contacted > 0 ? 
                ((statusCounts.demoed + statusCounts.admitted) / (statusCounts.contacted + statusCounts.demoed + statusCounts.admitted) * 100).toFixed(2) : 0,
            'demoed_to_admitted': statusCounts.demoed > 0 ? 
                (statusCounts.admitted / (statusCounts.demoed + statusCounts.admitted) * 100).toFixed(2) : 0
        };

        res.json({
            totalLeads,
            statusBreakdown: statusCounts,
            conversionRates: conversions,
            filters: {from, to, source}
        });

    } catch (error){
        res.status(500).json({error: error.message});    
    }
});

// 2. Counselor Performance API
router.get('/counselor-performance', async (req, res) => {
  try {
    const { region, from, to } = req.query;
    
    let counselorFilter = {};
    if (region) counselorFilter.region = region;

    // Build date filter for leads
    let leadDateFilter = {};
    if (from || to) {
      leadDateFilter.createdAt = {};
      if (from) leadDateFilter.createdAt.$gte = new Date(from);
      if (to) leadDateFilter.createdAt.$lte = new Date(to);
    }

    const counselors = await Counselor.find(counselorFilter);
    const performance = [];

    for (const counselor of counselors) {
      // Get leads handled by this counselor
      const leadFilter = { ...leadDateFilter, counselorId: counselor._id };
      const leadsHandled = await Lead.countDocuments(leadFilter);
      
      // Get interactions by this counselor
      const interactionFilter = { 
        counselorId: counselor._id
      };
      
      // Add date filter for interactions if provided
      if (from || to) {
        interactionFilter.timestamp = {};
        if (from) interactionFilter.timestamp.$gte = new Date(from);
        if (to) interactionFilter.timestamp.$lte = new Date(to);
      }

      const interactions = await Interaction.find(interactionFilter);
      const demos = interactions.filter(i => i.interactionType === 'demo').length;
      const totalDuration = interactions.reduce((sum, i) => sum + (i.duration || 0), 0);
      const avgTimeSpent = interactions.length > 0 ? (totalDuration / interactions.length).toFixed(2) : 0;

      // Get admitted leads
      const admittedLeads = await Lead.countDocuments({
        ...leadFilter,
        status: 'admitted'
      });

      performance.push({
        counselor: {
          id: counselor._id,
          name: counselor.name,
          region: counselor.region
        },
        totalLeadsHandled: leadsHandled,
        demosGiven: demos,
        totalInteractions: interactions.length,
        averageTimeSpent: parseFloat(avgTimeSpent),
        leadsConverted: admittedLeads,
        conversionRate: leadsHandled > 0 ? ((admittedLeads / leadsHandled) * 100).toFixed(2) : 0
      });
    }

    res.json({
      performance: performance.sort((a, b) => b.leadsConverted - a.leadsConverted),
      filters: { region, from, to }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Drop-off Report
router.get('/dropoffs', async (req, res) => {
  try {
    const rejectedLeads = await Lead.find({ status: 'rejected' })
      .populate('counselorId', 'name region')
      .lean();

    const dropoffAnalysis = [];

    for (const lead of rejectedLeads) {
      // Get last interaction for this lead
      const lastInteraction = await Interaction.findOne({ leadId: lead._id })
        .sort({ timestamp: -1 })
        .populate('counselorId', 'name');

      // Categorize reason for dropoff
      let dropoffReason = 'unknown';
      if (!lastInteraction) {
        dropoffReason = 'no_interaction';
      } else {
        const daysSinceLastInteraction = moment().diff(moment(lastInteraction.timestamp), 'days');
        if (daysSinceLastInteraction > 7) {
          dropoffReason = 'inactivity';
        } else if (lastInteraction.interactionType !== 'demo') {
          dropoffReason = 'no_demo';
        } else {
          dropoffReason = 'post_demo';
        }
      }

      dropoffAnalysis.push({
        lead: {
          id: lead._id,
          name: lead.name,
          email: lead.email,
          source: lead.source,
          createdAt: lead.createdAt
        },
        counselor: lead.counselorId,
        lastInteraction: lastInteraction ? {
          type: lastInteraction.interactionType,
          timestamp: lastInteraction.timestamp,
          notes: lastInteraction.notes
        } : null,
        dropoffReason
      });
    }

    // Group by dropoff reason
    const groupedDropoffs = dropoffAnalysis.reduce((acc, curr) => {
      if (!acc[curr.dropoffReason]) {
        acc[curr.dropoffReason] = [];
      }
      acc[curr.dropoffReason].push(curr);
      return acc;
    }, {});

    res.json({
      totalRejectedLeads: rejectedLeads.length,
      dropoffReasons: Object.keys(groupedDropoffs).map(reason => ({
        reason,
        count: groupedDropoffs[reason].length,
        percentage: ((groupedDropoffs[reason].length / rejectedLeads.length) * 100).toFixed(2)
      })),
      detailedDropoffs: groupedDropoffs
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Time-Based Lead Report
router.get('/lead-buckets', async (req, res) => {
  try {
    const { interval = 'weekly' } = req.query;
    
    const pipeline = [
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            ...(interval === 'weekly' ? 
              { week: { $week: '$createdAt' } } : 
              { month: { $month: '$createdAt' } }
            )
          },
          totalLeads: { $sum: 1 },
          admittedLeads: {
            $sum: {
              $cond: [{ $eq: ['$status', 'admitted'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          ...(interval === 'weekly' ? { '_id.week': 1 } : { '_id.month': 1 })
        }
      },
      {
        $project: {
          period: {
            $concat: [
              { $toString: '$_id.year' },
              interval === 'weekly' ? 
                { $concat: ['-W', { $toString: '$_id.week' }] } :
                { $concat: ['-', { $toString: '$_id.month' }] }
            ]
          },
          totalLeads: 1,
          admittedLeads: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              { $multiply: [{ $divide: ['$admittedLeads', '$totalLeads'] }, 100] },
              0
            ]
          }
        }
      }
    ];

    const buckets = await Lead.aggregate(pipeline);

    res.json({
      interval,
      buckets: buckets.map(bucket => ({
        period: bucket.period,
        totalLeads: bucket.totalLeads,
        admittedLeads: bucket.admittedLeads,
        conversionRate: parseFloat(bucket.conversionRate.toFixed(2))
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//5. export to CSV
router.get('/export/:reportType', async (req, res) => {
    try{
        const {reportType} = req.params;
        let data, fields;

        switch(reportType) {
            case 'funnel':
                const funnelResponse = await fetch(`${req.protocol}://${req.get('host')}/api/report/funnel${req.url.split('?')[1] ? '?' + req.url.split('?')[1] : ''}`);
                const funnelData = await funnelResponse.json();
                data = Object.entries(funnelData.statusBreakdown).map(([status, count]) => ({status,count}));
                fields = ['status', 'count'];
                break;

            default:
                return res.status(400).json({error: 'Invalid report type'});
        }

        const json2csv = new Parser({ fields});
        const csv = json2csv.parse(data);

        res.header('Content_Type', 'text/csv');
        res.attachment(`${reportType}-report.csv`);
        res.send(csv);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;
