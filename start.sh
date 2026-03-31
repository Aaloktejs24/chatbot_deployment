#!/bin/bash

echo "📦 Installing all dependencies..."
npm run setup

echo "🏗 Building frontend..."
npm run build

echo "🚀 Starting server..."
npm start
