"""Preview local sem dependências: python scripts/preview-local.py"""
from argparse import ArgumentParser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(302)
            self.send_header("Location", "/executar-editorial/index.html")
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

if __name__ == "__main__":
    parser = ArgumentParser(description="EXECUTAR preview local")
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(ROOT / "public"))
    print(f"EXECUTAR: http://localhost:{args.port}/ — Ctrl+C encerra", flush=True)
    try:
        ThreadingHTTPServer(("127.0.0.1", args.port), handler).serve_forever()
    except KeyboardInterrupt:
        print("\nPreview encerrado.")
