from flask import Blueprint
from .user import bp as user_bp
from .upload import bp as upload_bp

def register_routes(app):
    # app.register_blueprint(user_bp, url_prefix='/users')
    app.register_blueprint(upload_bp, url_prefix='/upload')

__all__ = ['register_routes']