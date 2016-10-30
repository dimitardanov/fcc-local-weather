#!/bin/bash

# copy Bootstrap SCSS files
cp -r node_modules/bootstrap-sass/assets/stylesheets/bootstrap/ src/scss/vendors/;
cp node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss src/scss/vendors;

# copy Bootstrap fonts
cp -r node_modules/bootstrap-sass/assets/fonts/bootstrap src/fonts/;


# replace .gitignore
cp sprouts/.gitignore .gitignore

# replace README.md
cp sprouts/README.md README.md

# remove license info
rm LICENSE
