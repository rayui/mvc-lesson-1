#!/bin/bash
rm -rf public/docs
docco *.js
docco modules/*.js
docco public/js/*.js
mv docs public
