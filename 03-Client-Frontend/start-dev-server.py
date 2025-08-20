#!/usr/bin/env python3
"""
Simple Development Server for VITAL RED Frontend
Hospital Universitaria ESE
"""

import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class VitalRedHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def do_GET(self):
        """Handle GET requests with SPA routing"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # If no path or path is a route, serve index.html
        if not path or not os.path.exists(path) or not '.' in os.path.basename(path):
            path = 'index.html'
        
        # Check if file exists
        if os.path.exists(path):
            self.path = '/' + path
            return super().do_GET()
        else:
            # Serve index.html for SPA routing
            self.path = '/index.html'
            return super().do_GET()
    
    def end_headers(self):
        """Add CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

def start_server():
    """Start the development server"""
    PORT = 5173
    
    print("=" * 80)
    print("🌐 VITAL RED Frontend Development Server")
    print("Hospital Universitaria ESE")
    print("=" * 80)
    
    # Change to the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Setup MIME types
    mimetypes.add_type('application/javascript', '.js')
    mimetypes.add_type('application/javascript', '.mjs')
    mimetypes.add_type('text/css', '.css')
    mimetypes.add_type('application/json', '.json')
    
    try:
        with socketserver.TCPServer(("", PORT), VitalRedHandler) as httpd:
            print(f"🚀 Servidor iniciado en: http://localhost:{PORT}")
            print(f"📁 Directorio: {os.getcwd()}")
            print(f"🔗 Backend API: http://localhost:8003")
            print(f"🔑 Login: admin@hospital-ese.com / admin123")
            print("-" * 80)
            print("Presione Ctrl+C para detener el servidor")
            print("-" * 80)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    start_server()
