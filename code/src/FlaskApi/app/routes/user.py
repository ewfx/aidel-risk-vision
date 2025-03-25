from flask import Blueprint, render_template

bp = Blueprint('main', __name__)

@bp.route('/hello')
def home():
    return "Hello World!!!"