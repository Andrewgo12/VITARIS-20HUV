#!/usr/bin/env python3
"""
VITAL RED Simple Server - Garantizado Funcional
Hospital Universitaria ESE
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import mysql.connector
from datetime import datetime
import urllib.parse
import threading
import time

class VitalRedHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Manejar peticiones GET"""
        try:
            if self.path == '/':
                self.send_json_response({
                    "message": "VITAL RED API - Hospital Universitaria ESE",
                    "status": "running",
                    "version": "1.0.0",
                    "timestamp": datetime.now().isoformat(),
                    "server": "simple",
                    "gmail_extractor": "kevinrlinze@gmail.com"
                })
            
            elif self.path == '/health':
                health_data = self.get_health_status()
                self.send_json_response(health_data)
            
            elif self.path == '/api/users':
                users_data = self.get_users()
                self.send_json_response(users_data)
            
            elif self.path == '/api/medical-cases':
                cases_data = self.get_medical_cases()
                self.send_json_response(cases_data)
            
            elif self.path == '/api/gmail-extractor/status':
                gmail_status = self.get_gmail_status()
                self.send_json_response(gmail_status)
            
            elif self.path == '/api/notifications':
                notifications = self.get_notifications()
                self.send_json_response(notifications)
            
            else:
                self.send_error(404, "Endpoint no encontrado")
                
        except Exception as e:
            self.send_error(500, f"Error del servidor: {str(e)}")
    
    def do_POST(self):
        """Manejar peticiones POST"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            if self.path == '/api/auth/login':
                try:
                    data = json.loads(post_data.decode('utf-8'))
                    login_result = self.handle_login(data)
                    self.send_json_response(login_result)
                except json.JSONDecodeError:
                    self.send_error(400, "JSON inválido")
            
            elif self.path == '/api/gmail-extractor/start':
                try:
                    data = json.loads(post_data.decode('utf-8')) if post_data else {}
                    extraction_result = self.start_extraction(data)
                    self.send_json_response(extraction_result)
                except json.JSONDecodeError:
                    extraction_result = self.start_extraction({})
                    self.send_json_response(extraction_result)
            
            else:
                self.send_error(404, "Endpoint no encontrado")
                
        except Exception as e:
            self.send_error(500, f"Error del servidor: {str(e)}")
    
    def do_OPTIONS(self):
        """Manejar peticiones OPTIONS para CORS"""
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()
    
    def send_cors_headers(self):
        """Enviar headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    def send_json_response(self, data, status_code=200):
        """Enviar respuesta JSON"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        
        json_data = json.dumps(data, ensure_ascii=False, default=str)
        self.wfile.write(json_data.encode('utf-8'))
    
    def get_db_connection(self):
        """Obtener conexión a base de datos"""
        try:
            return mysql.connector.connect(
                host="localhost",
                port=3306,
                user="root",
                password="",
                database="vital_red"
            )
        except Exception as e:
            print(f"Error de BD: {e}")
            return None
    
    def get_health_status(self):
        """Obtener estado de salud"""
        try:
            connection = self.get_db_connection()
            if not connection:
                return {
                    "status": "unhealthy",
                    "database": "disconnected",
                    "timestamp": datetime.now().isoformat()
                }
            
            cursor = connection.cursor()
            
            # Verificar tablas
            tables_status = {}
            tables = ['users', 'medical_cases', 'extracted_emails', 'notifications']
            
            for table in tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table}")
                    count = cursor.fetchone()[0]
                    tables_status[table] = count
                except:
                    tables_status[table] = "error"
            
            cursor.close()
            connection.close()
            
            return {
                "status": "healthy",
                "database": "connected",
                "tables": tables_status,
                "gmail_extractor": {
                    "configured_email": "kevinrlinze@gmail.com",
                    "status": "ready"
                },
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def handle_login(self, credentials):
        """Manejar login"""
        email = credentials.get("email")
        password = credentials.get("password")
        
        if email == "admin@hospital-ese.com" and password == "admin123":
            return {
                "success": True,
                "token": f"jwt_token_admin_{datetime.now().timestamp()}",
                "user": {
                    "id": 1,
                    "email": email,
                    "name": "Administrador Sistema",
                    "role": "admin",
                    "username": "admin"
                }
            }
        else:
            return {
                "success": False,
                "message": "Credenciales inválidas"
            }
    
    def get_users(self):
        """Obtener usuarios"""
        try:
            connection = self.get_db_connection()
            if not connection:
                return {"users": [], "total": 0, "error": "Sin conexión BD"}
            
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                SELECT id, username, email, first_name, last_name, role, 
                       is_active, created_at
                FROM users 
                ORDER BY created_at DESC
            """)
            users = cursor.fetchall()
            
            cursor.close()
            connection.close()
            
            return {
                "users": users,
                "total": len(users),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"users": [], "total": 0, "error": str(e)}
    
    def get_medical_cases(self):
        """Obtener casos médicos"""
        try:
            connection = self.get_db_connection()
            if not connection:
                return {"cases": [], "total": 0, "error": "Sin conexión BD"}
            
            cursor = connection.cursor(dictionary=True)
            try:
                cursor.execute("""
                    SELECT mc.*, u.first_name, u.last_name 
                    FROM medical_cases mc
                    LEFT JOIN users u ON mc.assigned_evaluator_id = u.id
                    ORDER BY mc.received_date DESC
                    LIMIT 50
                """)
                cases = cursor.fetchall()
            except:
                cases = []
            
            cursor.close()
            connection.close()
            
            return {
                "cases": cases,
                "total": len(cases),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"cases": [], "total": 0, "error": str(e)}
    
    def get_gmail_status(self):
        """Obtener estado de Gmail Extractor"""
        return {
            "status": "ready",
            "configured_email": "kevinrlinze@gmail.com",
            "total_sessions": 0,
            "total_emails_extracted": 0,
            "capabilities": [
                "Email extraction with Selenium",
                "AI analysis with Gemini",
                "Attachment processing",
                "Batch processing up to 300 emails"
            ]
        }
    
    def start_extraction(self, config):
        """Iniciar extracción"""
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return {
            "success": True,
            "session_id": session_id,
            "message": "Extracción iniciada correctamente",
            "config": {
                "email": "kevinrlinze@gmail.com",
                "max_emails": config.get("max_emails", 50),
                "enable_ai": config.get("enable_ai", False)
            }
        }
    
    def get_notifications(self):
        """Obtener notificaciones"""
        return {
            "notifications": [],
            "total": 0,
            "unread": 0
        }
    
    def log_message(self, format, *args):
        """Personalizar logging"""
        print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - {format % args}")

def run_server():
    """Ejecutar servidor"""
    server_address = ('', 8003)
    httpd = HTTPServer(server_address, VitalRedHandler)
    
    print("=" * 80)
    print("🏥 VITAL RED Simple Server")
    print("🚀 Servidor iniciado en http://localhost:8003")
    print("🔍 Health Check: http://localhost:8003/health")
    print("📧 Gmail Extractor configurado para: kevinrlinze@gmail.com")
    print("🔑 Login: admin@hospital-ese.com / admin123")
    print("=" * 80)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        httpd.shutdown()

if __name__ == "__main__":
    run_server()
