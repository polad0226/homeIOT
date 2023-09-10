# standard roots go here

from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route('/')
def home(): #function ran when gone to home route 
    return render_template("home.html")


@views.route('/data')
def data(): 
    return render_template("data.html")

@views.route('/controls')
def controls(): 
    return render_template("controls.html")


@views.route('/about')
def about(): 
    return render_template("about.html")

@views.route('/irritants')
def irritants(): 
    return render_template("irritants.html")