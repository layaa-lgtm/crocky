"""Serve the existing frontend and AI adapter locally in one command."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from pathlib import Path
import argparse
from ai_service import AIHandler

if __name__ == '__main__':
    root = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8000)
    parser.add_argument('--api-port',type=int,default=8001)
    args = parser.parse_args()
    api = ThreadingHTTPServer(('127.0.0.1',args.api_port),AIHandler)
    Thread(target=api.serve_forever,daemon=True).start()
    web = ThreadingHTTPServer(('127.0.0.1',args.port),partial(SimpleHTTPRequestHandler,directory=str(root)))
    print(f'Open http://127.0.0.1:{args.port} — press Ctrl+C to stop.')
    try: web.serve_forever()
    except KeyboardInterrupt: pass
    finally: api.shutdown(); web.server_close()
