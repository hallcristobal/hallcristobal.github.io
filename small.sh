browserify $1.js -o $1.bundle.js -t [ babelify --presets [ @babel/preset-env ] --plugins [ @babel/plugin-proposal-class-properties ] ]
uglifyjs -c -m -o $1.bundle.min.js $1.bundle.js
