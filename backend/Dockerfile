# Backend Dockerfile
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy dependencies first (better build caching)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose Flask port
EXPOSE 5000

# Run Flask app
CMD ["python3", "app.py"]
