requirejs.config({
    baseUrl: 'js',
    paths: {
        main:   '../main',
        lib:    'lib',
        jquery: 'lib/jquery-1.12.4.min'
    }
});

requirejs(['main'], function(main){
    main.init();
});

