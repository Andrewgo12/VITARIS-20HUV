#!/usr/bin/env python3
"""
Simple FastAPI Server for VITAL RED Testing
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="VITAL RED API",
    description="Sistema de Gestión Médica - Hospital Universitaria ESE",
    version="2.0.0"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "VITAL RED API - Hospital Universitaria ESE",
        "version": "2.0.0",
        "status": "running",
        "timestamp": datetime.utcnow()
    }

@app.get("/health")
async def health():
    try:
        # Test database connection
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        conn.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "users": user_count,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow()
        }

@app.get("/api/statistics")
async def statistics():
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        cursor = conn.cursor()
        
        # Get counts
        cursor.execute("SELECT COUNT(*) FROM users")
        users = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM patient_records")
        patients = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM email_messages")
        emails = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM medical_referrals")
        referrals = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "total_users": users,
            "total_patients": patients,
            "total_emails": emails,
            "total_referrals": referrals,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/auth/login")
async def login(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    
    # Simple demo authentication
    demo_users = {
        "admin@hospital-ese.com": {
            "id": 1,
            "name": "Administrador Sistema",
            "role": "administrator",
            "password": "admin123"
        },
        "evaluador@hospital-ese.com": {
            "id": 2,
            "name": "Dr. Evaluador Médico",
            "role": "medical_evaluator",
            "password": "evaluator123"
        }
    }
    
    user = demo_users.get(email)
    if user and user["password"] == password:
        return {
            "access_token": "demo-token-123",
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "email": email,
                "name": user["name"],
                "role": user["role"]
            }
        }
    else:
        return {"error": "Invalid credentials"}

@app.get("/api/emails")
async def get_emails():
    """Get emails endpoint"""
    return {
        "emails": [],
        "total": 0,
        "message": "No emails found"
    }

@app.get("/api/patients")
async def get_patients():
    """Get patients endpoint"""
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id, document_number, full_name, age, gender FROM patient_records LIMIT 10")
        patients = cursor.fetchall()
        conn.close()

        patient_list = []
        for patient in patients:
            patient_list.append({
                "id": patient[0],
                "document": patient[1],
                "name": patient[2],
                "age": patient[3],
                "gender": patient[4]
            })

        return {
            "patients": patient_list,
            "total": len(patient_list)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/referrals")
async def get_referrals():
    """Get medical referrals endpoint"""
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id, referral_number, referral_type, priority_level, status FROM medical_referrals LIMIT 10")
        referrals = cursor.fetchall()
        conn.close()

        referral_list = []
        for referral in referrals:
            referral_list.append({
                "id": referral[0],
                "number": referral[1],
                "type": referral[2],
                "priority": referral[3],
                "status": referral[4]
            })

        return {
            "referrals": referral_list,
            "total": len(referral_list)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/medical-cases")
async def get_medical_cases():
    """Get medical cases endpoint"""
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id, patient_name, patient_document, diagnosis, urgency, status FROM medical_cases LIMIT 10")
        cases = cursor.fetchall()
        conn.close()

        case_list = []
        for case in cases:
            case_list.append({
                "id": case[0],
                "patientName": case[1],
                "patientDocument": case[2],
                "diagnosis": case[3],
                "urgency": case[4],
                "status": case[5]
            })

        return {
            "cases": case_list,
            "total": len(case_list)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/users")
async def get_users():
    """Get users endpoint"""
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, name, role, is_active FROM users")
        users = cursor.fetchall()
        conn.close()

        user_list = []
        for user in users:
            user_list.append({
                "id": user[0],
                "email": user[1],
                "name": user[2],
                "role": user[3],
                "isActive": bool(user[4])
            })

        return {
            "users": user_list,
            "total": len(user_list)
        }
    except Exception as e:
        return {"error": str(e)}

def main():
    print("🏥 VITAL RED Simple API Server")
    print("Hospital Universitaria ESE")
    print("=" * 50)
    print("🚀 Iniciando servidor en puerto 8001...")
    print("🌐 Endpoints disponibles:")
    print("   - http://localhost:8001/")
    print("   - http://localhost:8001/health")
    print("   - http://localhost:8001/api/statistics")
    print("   - http://localhost:8001/docs")
    print("=" * 50)
    
    uvicorn.run(
        "simple_server:app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        log_level="info"
    )

if __name__ == "__main__":
    main()
