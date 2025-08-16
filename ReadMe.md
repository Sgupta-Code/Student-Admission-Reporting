# Student Admission Funnel & Reporting System

A comprehensive backend system for managing student leads, counselor interactions, and admission tracking with detailed reporting capabilities.

## 🚀 Features

- **Lead Management**: Track student leads from initial contact to admission
- **Counselor Performance**: Monitor counselor interactions and conversion rates
- **Advanced Reporting**: Generate funnel analysis, dropoff reports, and time-based analytics
- **Input Validation**: Comprehensive data validation for all endpoints
- **Health Monitoring**: System health check endpoint for monitoring
- **Export Functionality**: Export reports to CSV format

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Additional**: Moment.js for date handling, json2csv for exports

## 📊 API Endpoints

### Health Check
- `GET /health` - System health status

### Lead Management
- `POST /api/leads` - Create new lead (with validation)
- `GET /api/leads` - Get all leads
- `PATCH /api/leads/:id/status` - Update lead status

### Counselor Management
- `POST /api/counselors` - Create new counselor (with validation)
- `GET /api/counselors` - Get all counselors

### Interaction Tracking
- `POST /api/interactions` - Log new interaction (with validation)
- `GET /api/interactions/lead/:leadId` - Get interactions for a lead

### Reporting
- `GET /api/report/funnel` - Funnel analysis with conversion rates
- `GET /api/report/counselor-performance` - Counselor performance metrics
- `GET /api/report/dropoffs` - Rejected leads analysis
- `GET /api/report/lead-buckets` - Time-based lead analysis
- `GET /api/report/export/:reportType` - Export reports to CSV

## 🔧 Setup Instructions

1. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd admission-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file:
   ```
   MONGODB__URI=mongodb://localhost:27017/admission_system
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service
   # Run seed script
   node scripts/seedData.js
   ```

5. **Start Server**
   ```bash
   npm start
   ```

## 📈 Sample API Usage

### Create a Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "source": "organic"
  }'
```

### Get Funnel Report
```bash
curl "http://localhost:3000/api/report/funnel?from=2024-01-01&to=2024-12-31&source=ads"
```

## 🏗 Project Structure

```
├── models/          # Database schemas
├── routes/          # API route handlers  
├── middleware/      # Custom middleware (validation, etc.)
├── scripts/         # Database seed scripts
├── server.js        # Main application file
└── README.md        # Project documentation
```

## 🔍 Recent Enhancements

- ✅ Added comprehensive input validation
- ✅ Implemented health check endpoint
- ✅ Enhanced report responses with metadata
- ✅ Improved error handling and user feedback
- ✅ Added business insights to reports

## 📊 Business Metrics Available

- Lead conversion rates by stage
- Counselor performance analytics
- Dropoff analysis with categorization
- Time-based admission trends
- Source-wise lead analysis

---

Built with ❤️ for efficient student admission management