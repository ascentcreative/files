const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.scripts([
                'assets/*.js',
                'assets/vendor/lightbox2/*.js'
            ], 
            'assets/dist/js/ascent-files-bundle.js', 
            'assets/dist/js'
            )
    .styles([
                'assets/*.css',
                'assets/vendor/lightbox2/*.css'
            ], 
                'assets/dist/css/ascent-files-bundle.css', 
                'assets/dist/css'
                );
   
