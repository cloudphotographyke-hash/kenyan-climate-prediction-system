FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for scikit-learn and other packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    gfortran \
    libopenblas-dev \
    liblapack-dev \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install all Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    fastapi==0.104.1 \
    uvicorn[standard]==0.24.0 \
    asyncpg==0.29.0 \
    redis==5.0.1 \
    httpx==0.25.1 \
    python-dotenv==1.0.0 \
    scikit-learn==1.3.2 \
    numpy==1.24.3 \
    pandas==2.1.3 \
    joblib==1.3.2 \
    apscheduler==3.10.4 \
    pydantic==2.5.0 \
    python-multipart==0.0.6

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
