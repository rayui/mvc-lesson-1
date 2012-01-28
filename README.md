# A simple lesson focussing on client side MVC in javascript

## To install all the requirements:

* Download and install node.js
* Download and install npm
* npm install underscore
* npm install express
* npm install jade
* npm install optimist
* npm install docco

Docco requires Pygments. On Debian based systems you can install this with the following command:

sudo aptitude install python-pygments

## To generate the documentation do this:

* chmod u+x doc-generator.sh
* ./doc-generator.sh

## To start the server:

* node js/app.js

## To access the app:

* http://localhost:8000

## To access the docs:

* http://localhost:8000/docs

## Heroku ready!

* Set up a new Heroku app 
* git push heroku master 
