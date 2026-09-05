#!/bin/bash
# RONITO Backend Setup Script

echo "🚀 Setting up RONITO Backend..."

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -q --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  1. source venv/bin/activate"
echo "  2. python main.py"
echo ""
echo "API will be available at http://localhost:8000"
