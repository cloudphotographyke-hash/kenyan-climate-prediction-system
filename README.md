# Kenyan Climate & Weather Prediction System

An AI-powered weather forecasting system that predicts weather patterns across Kenya based on El Nino and La Nina (ENSO) conditions, environmental indicators, and machine learning models.

## System Overview

This system combines climate science, machine learning, and real-time weather analytics to help predict how El Nino and La Nina conditions may affect weather patterns across Kenya's 47 counties and major towns.

### Key Features

- **Climate Intelligence**: Real-time ENSO monitoring with ONI (Oceanic Nino Index) tracking
- **ML-Powered Predictions**: Random Forest, Gradient Boosting, and Logistic Regression models
- **Location-Based Forecasts**: Support for all Kenyan counties and towns
- **Risk Assessment**: Drought, flood, and extreme weather risk analysis
- **Interactive Dashboards**: Grafana analytics with climate monitoring
- **Real-time Alerts**: Climate alert system with subscription management
- **Historical Analysis**: Weather trend comparison and anomaly detection

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React/    │────▶│    Nginx    │────▶│   FastAPI   │
│   Next.js   │     │  (Reverse   │     │   Backend   │
│  Frontend   │◀────│   Proxy)    │◀────│   (Port    │
│  (Vercel)   │     │             │     │    8000)    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐            │
                    │   Grafana   │◀───────────┤
                    │  (Port     │            │
                    │   3001)     │            │
                    └─────────────┘            │
                                               │
                    ┌─────────────┐     ┌────┴──────┐
                    │    ML       │◀────│  Aiven    │
                    │   Service   │     │ PostgreSQL │
                    │  (Port      │     │            │
                    │   5001)     │     └────────────┘
                    └─────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** with React 18
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Framer Motion** for animations
- **Lucide React** for icons
- Deployed on **Vercel**

### Backend
- **FastAPI** (Python) for REST API
- **Uvicorn** ASGI server
- **AsyncPG** for async PostgreSQL
- **Redis** for caching
- **APScheduler** for background tasks

### Machine Learning
- **Scikit-Learn**: Random Forest, Gradient Boosting, Logistic Regression
- **NumPy & Pandas** for data processing
- **Joblib** for model serialization
- Automated retraining every Saturday at 12:00 PM

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **Nginx** as reverse proxy and load balancer
- **Grafana** for analytics dashboards
- **Aiven PostgreSQL** for cloud database
- **Redis** for caching layer

## Project Structure

```
kenyan-climate-prediction-system/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   │   ├── LocationSearch.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   ├── ENSOIndicator.tsx
│   │   │   ├── RiskAssessment.tsx
│   │   │   ├── PredictionChart.tsx
│   │   │   └── SeasonalOutlook.tsx
│   │   └── lib/
│   │       └── api.ts        # API client
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routes/           # API endpoints
│   │   │   ├── weather.py
│   │   │   ├── climate.py
│   │   │   ├── predictions.py
│   │   │   ├── locations.py
│   │   │   ├── alerts.py
│   │   │   └── analytics.py
│   │   ├── services/         # Business logic
│   │   │   ├── enso_service.py
│   │   │   ├── climate_service.py
│   │   │   ├── ml_service.py
│   │   │   ├── database.py
│   │   │   ├── cache.py
│   │   │   ├── scheduler.py
│   │   │   └── analytics_service.py
│   │   ├── models/           # Pydantic models
│   │   └── utils/
│   │       └── kenya_locations.py
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── ml-service/              # ML training & prediction service
│   ├── services/
│   │   ├── data_loader.py
│   │   ├── model_trainer.py
│   │   └── predictor.py
│   ├── models/              # Trained model files
│   ├── data/                # Training datasets
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── nginx/                   # Nginx configuration
│   └── nginx.conf
│
├── grafana/                 # Grafana dashboards
│   ├── dashboards/
│   │   └── kenya-climate-dashboard.json
│   └── provisioning/
│       ├── datasources/
│       └── dashboards/
│
├── database/                # Database initialization
│   └── init/
│       └── 01_init.sql
│
├── docker-compose.yml
├── .env
└── .env.example
```

## API Endpoints

### Weather
- `GET /api/weather/current/{location}` - Current weather conditions
- `GET /api/weather/forecast/{location}?days=7` - Weather forecast
- `GET /api/weather/historical/{location}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Historical data

### Climate
- `GET /api/climate/enso/current` - Current ENSO status
- `GET /api/climate/enso/history?years=10` - Historical ENSO data
- `GET /api/climate/enso/impact/{location}` - ENSO impact for location
- `GET /api/climate/seasonal/{location}` - Seasonal outlook
- `GET /api/climate/anomalies/{location}?period=1y` - Climate anomalies

### Predictions
- `GET /api/predictions/rainfall/{location}?months=3` - Rainfall prediction
- `GET /api/predictions/drought/{location}` - Drought risk assessment
- `GET /api/predictions/flood/{location}` - Flood risk assessment
- `GET /api/predictions/temperature/{location}?months=3` - Temperature prediction
- `GET /api/predictions/comprehensive/{location}` - All predictions combined
- `POST /api/predictions/retrain` - Trigger model retraining

### Locations
- `GET /api/locations/search?q={query}` - Location search with autocomplete
- `GET /api/locations/all` - All locations
- `GET /api/locations/regions` - Climate regions
- `GET /api/locations/{location}` - Location details

### Alerts
- `GET /api/alerts/active` - Active climate alerts
- `GET /api/alerts/history/{location}` - Alert history
- `POST /api/alerts/subscribe` - Subscribe to alerts

## Setup & Deployment

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)
- Aiven PostgreSQL account (or local PostgreSQL)

### Environment Configuration

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

2. Update the following variables:
```env
# Database (Aiven PostgreSQL)
AIVEN_PG_HOST=your-host.aivencloud.com
AIVEN_PG_PORT=25060
AIVEN_PG_DATABASE=kenyan_climate_db
AIVEN_PG_USER=avnadmin
AIVEN_PG_PASSWORD=your-password

# API Keys
NOAA_API_KEY=your-noaa-api-key

# Backend
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# Grafana
GF_SECURITY_ADMIN_PASSWORD=secure-password
```

### Docker Deployment

1. Start all services:
```bash
docker-compose up -d
```

2. Access services:
- Frontend: http://localhost (via Nginx)
- API Docs: http://localhost/api/docs
- Grafana: http://localhost/grafana (admin/admin123)

3. View logs:
```bash
docker-compose logs -f backend
docker-compose logs -f ml-service
```

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**ML Service:**
```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Machine Learning Models

### Model Types
1. **Random Forest Regressor** - Rainfall prediction
2. **Gradient Boosting Regressor** - Temperature prediction
3. **Random Forest Classifier** - Drought risk classification
4. **Logistic Regression** - Flood probability

### Features Used
- Geographic: latitude, longitude, elevation
- Temporal: month, season, year
- ENSO: ONI value, ENSO phase, SST anomaly
- Historical: previous rainfall, temperature trends
- Climate zone: region-specific averages

### Training Schedule
- **Automatic**: Every Saturday at 12:00 PM (cron: `0 12 * * 6`)
- **Manual**: POST `/api/predictions/retrain`
- **Trigger**: New data availability or model performance degradation

## Climate Data Sources

- **Open-Meteo API**: Current weather and forecasts
- **NOAA CPC**: ENSO/ONI data and climate indices
- **Kenya Meteorological Department**: Historical weather data
- **ICPAC**: Regional climate outlooks

## ENSO Impact on Kenya

### El Nino Effects
- **OND Season**: Above-normal rainfall, flooding risk in Coastal, Western, Central Highlands
- **JJAS Season**: Depressed rainfall in northern/western regions
- **Temperature**: Warmer conditions, increased evapotranspiration
- **Historical**: 2023-2024 El Nino caused extreme rainfall across 46 counties

### La Nina Effects
- **OND Season**: Below-normal rainfall, drought in Eastern, North Eastern, Turkana
- **JJAS Season**: Enhanced rainfall in northern/western regions
- **Temperature**: Cooler conditions, potential frost in highlands
- **Historical**: 2020-2023 La Nina caused severe drought, 23M people faced hunger

### Neutral Conditions
- Near-normal rainfall expected
- Standard agricultural practices recommended
- Monitor for Indian Ocean Dipole (IOD) effects

## Grafana Dashboards

### Available Dashboards
1. **Main Climate Dashboard**
   - Prediction accuracy gauges
   - Rainfall prediction trends
   - Active alerts counter
   - Top searched locations
   - Model performance metrics
   - API request volume

### Access
- URL: http://localhost/grafana
- Default credentials: admin/admin123
- Datasource: PostgreSQL (pre-configured)

## Monitoring & Logging

### Application Logs
- Backend: `./logs/app.log`
- ML Service: `./logs/ml.log`
- Nginx: `/var/log/nginx/`

### Health Checks
- Backend: `GET /health`
- ML Service: `GET /health`
- Database: PostgreSQL health check in Docker Compose

## Security

- Environment variables for sensitive data
- CORS configuration for frontend domains
- Rate limiting via Nginx (10 req/s for API)
- SSL-ready Nginx configuration (uncomment HTTPS block)
- Input validation via Pydantic models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Email: support@kenyaclimate.org

## Acknowledgments

- Kenya Meteorological Department for climate data
- NOAA Climate Prediction Center for ENSO data
- ICPAC for regional climate outlooks
- Open-Meteo for weather API

---

**Built with climate science and machine learning for Kenya's resilience.**
# kenyan-climate-prediction-system-v1.0
# kenyan-climate-prediction-system
