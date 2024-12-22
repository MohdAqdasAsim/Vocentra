from flask import Flask

def create_app():
    app = Flask(__name__)
    with app.app_context():
        from .routes import api_bp
        app.register_blueprint(api_bp)
    return app