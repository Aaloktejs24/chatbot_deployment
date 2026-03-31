#!/bin/bash

echo "Installing backend packages..."
cd backend && npm install && cd ..

echo "Installing frontend packages..."
cd frontend && npm install && cd ..

echo "Starting app with Docker..."
docker-compose up --build -d

echo "Done! Open http://localhost:3000"
