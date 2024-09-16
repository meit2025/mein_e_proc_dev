<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>

        <link href="{{asset('assets/media/app/apple-touch-icon.png')}}" rel="apple-touch-icon" sizes="180x180"/>
        <link href="assets/media/app/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png"/>
        <link href="{{asset('assets/media/app/favicon-32x32.png')}}" rel="icon" sizes="32x32" type="image/png"/>
        <link href="{{asset('assets/media/app/favicon-16x16.png')}}" rel="icon" sizes="16x16" type="image/png"/>
        <link href="{{asset('assets/media/app/favicon-16x16.png')}}" rel="icon" sizes="16x16" type="image/png"/>
        <link href="{{asset('assets/media/app/favicon.ico')}}" rel="shortcut icon"/>
        <link href="{{asset('assets/vendors/apexcharts/apexcharts.css')}}" rel="stylesheet"/>
        <link href="{{asset('assets/vendors/keenicons/styles.bundle.css')}}" rel="stylesheet"/>
        <link href="{{asset('assets/css/styles.css')}}" rel="stylesheet"/>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/sass/app.scss' , 'resources/js/app.jsx'])
        <!-- In this article, we are going to use JSX syntax for React components -->
        @inertiaHead
    </head>
    <body>
        @inertia

          <!-- Scripts -->
        <script src="{{asset('assets/js/core.bundle.js')}}">
        </script>
        <script src="{{asset('assets/vendors/apexcharts/apexcharts.min.js')}}">
        </script>
        <script src="{{asset('assets/js/widgets/general.js')}}">
        </script>
        <script src="{{asset('assets/js/layouts/demo1.js')}}">
        </script>
        <!-- End of Scripts -->
    </body>
</html>
