# Dockerfile for VITAL RED Gmail Integration
# Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    TZ=America/Bogota

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # Essential build tools
    gcc \
    g++ \
    make \
    # PostgreSQL client
    postgresql-client \
    # Image processing
    tesseract-ocr \
    tesseract-ocr-spa \
    tesseract-ocr-eng \
    # Image libraries
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    # PDF processing
    poppler-utils \
    # Network tools
    curl \
    wget \
    # Text processing
    antiword \
    unrtf \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/credentials \
             /app/logs \
             /app/temp \
             /app/processed \
             /app/attachments && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Expose port
EXPOSE 8001

# Default command
CMD ["python", "main_service.py"]
