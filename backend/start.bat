@echo off
echo Starting EnzoIA Backend Server...
python -m uvicorn api:app --host 0.0.0.0 --port 8001 --reload
pause
