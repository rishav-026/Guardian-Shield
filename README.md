🛡️ GuardianShield - AI-Powered Fraud Detection for UPI Payments
License: MITPython 3.9+React 18FastAPI

Real-time behavioral AI that stops UPI fraud before transactions complete

GuardianShield is an advanced fraud detection system that protects users from social engineering scams by analyzing behavioral patterns, detecting phone activity, and making split-second decisions—all in under 200 milliseconds.

🎯 The Problem
₹34,000 crores lost to UPI fraud annually in India
87,000 fraud attempts every day
76% of UPI fraud is social engineering (scam calls, phishing)
Traditional systems detect fraud AFTER money is gone (24-72 hours later)
Current AI cannot detect behavioral fraud when users authorize transactions themselves
💡 Our Solution
GuardianShield detects fraud BEFORE transactions complete by:

Behavioral Baseline Learning - Learns individual user spending patterns
Real-Time Analysis - Analyzes transactions in <200ms before PIN entry
Social Engineering Detection - Detects phone activity + scam patterns
Three-Tier Decisions - Safe, Challenge, or Block based on risk level
Context-Aware AI - Understands emergencies vs. fraud attempts
✨ Key Features
🔍 Advanced Detection
Dual AI system (XGBoost + Isolation Forest)
29 behavioral features analyzed per transaction
94% accuracy, 96% recall rate
Phone activity signal integration
Merchant reputation scoring
⚡ Real-Time Protection
<200ms average response time
Blocks fraud before PIN screen
No user friction for normal transactions
Seamless API integration
📊 Analytics Dashboard
Real-time fraud monitoring
Transaction risk trends
Merchant intelligence
User risk profiles
Visual fraud patterns
🎨 Demo UPI App
Simulated payment experience
Live fraud detection demonstration
Educational fraud scenarios
Interactive risk visualization
🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐ │ FRONTEND │ │ ┌─────────────────┐ ┌─────────────────┐ │ │ │ Dashboard │ │ Demo UPI App │ │ │ │ (Analytics) │ │ (Simulation) │ │ │ └────────┬────────┘ └────────┬────────┘ │ │ │ │ │ │ └───────────┬───────────────┘ │ │ │ │ └───────────────────────┼─────────────────────────────────────┘ │ REST API ┌───────────────────────┼─────────────────────────────────────┐ │ ▼ │ │ BACKEND (FastAPI) │ │ ┌──────────────────────────────────────────────────────┐ │ │ │ Fraud Detection Engine │ │ │ │ - Feature Extraction │ │ │ │ - ML Model Inference (Ensemble) │ │ │ │ - Risk Scoring │ │ │ │ - Decision Logic │ │ │ └──────────────────────────────────────────────────────┘ │ │ │ │ │ │ ▼ ▼ │ │ ┌─────────────────┐ ┌─────────────────┐ │ │ │ ML Models │ │ Supabase DB │ │ │ │ - XGBoost │ │ - User Data │ │ │ │ - Random Forest│ │ - Baselines │ │ │ │ - Gradient Boost│ │ - Transactions │ │ │ │ - Isolation │ │ - Merchant Info│ │ │ └─────────────────┘ └─────────────────┘ │ └─────────────────────────────────────────────────────────────┘

text

🚀 Quick Start
Prerequisites
Python 3.9+
Node.js 18+
Supabase account (free tier works)
Git
