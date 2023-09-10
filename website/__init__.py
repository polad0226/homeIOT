from flask import Flask

def create_app():
    app = Flask(__name__ ,static_folder='static')
    app.config['SECRET_KEY'] = 'team1'

    from .views import views #imports blueprints

    app.register_blueprint(views, url_prefix='/') #register blueprints with flask app

    return app