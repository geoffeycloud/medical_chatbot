@echo off
echo Starting Medical Chatbot...
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist "venv\Lib\site-packages\flask" (
    echo Installing dependencies...
    pip install -r requirements.txt
)

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo ⚠️  No .env file found!
    echo Please run setup.py first to configure your API key:
    echo python setup.py
    echo.
    pause
    exit /b 1
)

REM Start the application
echo.
echo 🚀 Starting Medical Chatbot...
echo Open your browser to: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python run.py

pause
