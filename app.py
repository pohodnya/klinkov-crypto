import socketserver
from http.server import BaseHTTPRequestHandler

def some_function():
    print("some_function got called")

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/test':
            # Insert your code here
            some_function()

        self.send_response(200)

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("", 8085), MyHandler)
httpd.serve_forever()
