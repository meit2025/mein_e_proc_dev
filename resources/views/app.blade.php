<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{env('APP_NAME', 'mitsubishi electric')}}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>

        <link href="{{asset('images/mitsubishi_icon.png')}}" rel="apple-touch-icon" sizes="180x180"/>
        <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="32x32" type="image/png"/>
        <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="32x32" type="image/png"/>
        <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="16x16" type="image/png"/>
        <link href="{{asset('images/mitsubishi_icon.png')}}" rel="icon" sizes="16x16" type="image/png"/>
        <link href="{{asset('images/mitsubishi_icon.png')}}" rel="shortcut icon"/>
        <link href="{{asset('assets/vendors/apexcharts/apexcharts.css')}}" rel="stylesheet"/>
        <link href="{{asset('assets/vendors/keenicons/styles.bundle.css')}}" rel="stylesheet"/>
        <link href="{{asset('assets/css/styles.css')}}" rel="stylesheet"/>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/sass/app.scss' , 'resources/js/app.tsx'])
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
