# Student Admission Funnel & Reporting System

A backend system to manage student leads, counselor interactions, and admission tracking with detailed reporting capabilities.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/admission_system
PORT=3000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Generate Sample Data
```bash
npm run seed
```

### 5. Start Server
```bash
npm run dev
```
Server runs at: `http://localhost:3000`

## 📁 Project Structure
```
├── server.js              # Main app
├── models/                # Database models
│   ├── Lead.js
│   ├── Counselor.js
│   └── Interaction.js
├── routes/                # API routes
│   ├── reports.js         # Report APIs
│   ├── leads.js
│   ├── counselors.js
│   └── interactions.js
└── scripts/
    └── seedData.js        # Sample data
```

## 📊 API Endpoints

### 1. Funnel Report
**GET** `/api/report/funnel`

Shows lead conversion through different stages.

**Query Parameters:**
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)  
- `source` - Lead source (organic/ads/referral)

**Example Response:**
```json
{
  "totalLeads": 50,
  "statusBreakdown": {
    "new": 10,
    "contacted": 15,
    "demoed": 12,
    "admitted": 8,
    "rejected": 5
  },
  "conversionRates": {
    "new_to_contacted": "80.00",
    "contacted_to_demoed": "71.43",
    "demoed_to_admitted": "37.50"
  }
}
```

### 2. Counselor Performance
**GET** `/api/report/counselor-performance`

Shows performance metrics for each counselor.

**Query Parameters:**
- `region` - Filter by region
- `from` - Start date
- `to` - End date

**Example Response:**
```json
{
  "performance": [
    {
      "counselor": {
        "name": "Amit Sharma",
        "region": "North"
      },
      "totalLeadsHandled": 12,
      "demosGiven": 5,
      "totalInteractions": 14,
      "averageTimeSpent": 34.25,
      "leadsConverted": 4,
      "conversionRate": "33.33"
    }
  ]
}
```

---

### 3. Drop-off Report
**GET** `/api/report/dropoffs`

Lists rejected leads with reasons for dropping off.

**Example Response:**
```json
{
  "totalRejectedLeads": 10,
  "dropoffReasons": [
    {
      "reason": "no_demo",
      "count": 8,
      "percentage": "53.33"
    },
    {
      "reason": "inactivity",
      "count": 4,
      "percentage": "26.67"
    }
  ]
}
```

---

### 4. Time-Based Lead Report
**GET** `/api/report/lead-buckets`

Shows leads grouped by time periods.

**Query Parameters:**
- `interval` - weekly or monthly (default: weekly)

**Example Response:**
```json
{
  "interval": "monthly",
  "buckets": [
    {
      "period": "2024-1",
      "totalLeads": 25,
      "admittedLeads": 8,
      "conversionRate": 32.00
    }
  ]
}
```

## Testing APIs

### Using Browser
Open these URLs in your browser:

1. **Funnel Report:**
   `http://localhost:3000/api/report/funnel`

2. **Counselor Performance:**
   `http://localhost:3000/api/report/counselor-performance`

3. **Drop-offs:**
   `http://localhost:3000/api/report/dropoffs`

4. **Lead Buckets:**
   `http://localhost:3000/api/report/lead-buckets`

### Using Postman
1. Create new GET requests for each endpoint above
2. Add query parameters (like `from`, `to`, `region`, etc.)
3. Send requests to test functionality

---

## 🧬 Data Models

### Lead
```javascript
{
  name: String,
  email: String,
  phone: String,
  source: "organic" | "ads" | "referral",
  counselorId: ObjectId,
  status: "new" | "contacted" | "demoed" | "admitted" | "rejected"
}
```

### Counselor
```javascript
{
  name: String,
  region: String
}
```

### Interaction
```javascript
{
  leadId: ObjectId,
  counselorId: ObjectId,
  interactionType: "call" | "demo" | "followup" | "email",
  timestamp: Date,
  notes: String,
  duration: Number
}
```

## Key Features

✅ **Funnel Analysis** - Track lead conversion through stages  
✅ **Performance Metrics** - Monitor counselor effectiveness  
✅ **Drop-off Analysis** - Understand rejection reasons  
✅ **Time-based Reports** - Weekly/monthly lead trends  
✅ **CSV Export** - Download reports as spreadsheets  
✅ **Date Filtering** - Filter reports by date ranges  
✅ **Source Filtering** - Analyze by lead source  

## 🧪 Sample Data

After running `npm run seed`, you'll have:
- 4 counselors across different regions
- 50 sample leads with various statuses
- ~100+ interactions between counselors and leads
- Data randomly spread over the past 30 days

---

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`

**Port Already in Use:**
- Change PORT in `.env` file
- Or stop process using port 3000

**Empty Reports:**
- Run `npm run seed` to generate sample data
- Check if MongoDB has data

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Moment.js** - Date handling

## Assignment Requirements Met

✅ All 4 required report APIs implemented  
✅ MongoDB data models with proper relationships  
✅ Express.js with clean routing structure  
✅ Performance-optimized queries using aggregation  
✅ CSV export functionality (bonus)  
✅ Comprehensive documentation with examples