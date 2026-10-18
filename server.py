"""Servidor local sin dependencias. Abre el navegador solo después de enlazar el puerto."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        from urllib.parse import unquote, urlsplit
        if any(part.startswith('.') for part in unquote(urlsplit(self.path).path).split('/') if part):
            self.send_error(403)
            return
        super().do_GET()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--open', action='store_true')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    handler = partial(Handler, directory=str(Path(__file__).resolve().parent))
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    except OSError as error:
        print(f'No se pudo iniciar el servidor: {error}. Cierra el servidor anterior o libera el puerto.')
        raise SystemExit(1) from error
    url = f'http://127.0.0.1:{args.port}'
    print(f'Juego disponible en {url}. Cierra con Ctrl+C.')
    if args.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
