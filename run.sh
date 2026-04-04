#!/bin/bash

echo "Starting Module Federation Concept..."

# Kill existing processes on ports 3000 and 8000
echo "Killing existing processes on ports 3000 and 8000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
sleep 1

# Start Laravel API
echo "Starting Laravel API on port 8000..."
cd "$(dirname "$0")/bff-mf" && php artisan serve --port=8000 &
LARAVEL_PID=$!

# Wait for Laravel to start
sleep 2

# Start React Host
echo "Starting React Host on port 3000..."
cd "$(dirname "$0")/apps-mf/host" && npm run dev &
REACT_PID=$!

echo ""
echo "Services started:"
echo "  - Laravel API: http://localhost:8000"
echo "  - React Host: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
# shellcheck disable=SC2064
trap "kill $LARAVEL_PID $REACT_PID 2>/dev/null; exit" INT TERM
wait