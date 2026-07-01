<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="TalentBridge — Where exceptional talent meets exceptional teams. Search jobs, explore companies, and manage your career on a premium recruitment platform.">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'TalentBridge') }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap" rel="stylesheet">
    <link rel="preload" as="image" href="/images/hero/professional-hero.webp" type="image/webp" fetchpriority="high">
    @php
        $host = request()->getHost();
        $useHotReload = in_array($host, ['localhost', '127.0.0.1', '::1'], true);
        $vite = $useHotReload
            ? app(\Illuminate\Foundation\Vite::class)
            : (clone app(\Illuminate\Foundation\Vite::class))->useHotFile(storage_path('framework/vite.disabled.hot'));
    @endphp
    {!! $vite->reactRefresh() !!}
    {!! $vite(['resources/css/app.css', 'resources/js/main.tsx']) !!}
</head>
<body class="min-h-screen bg-background font-sans antialiased">
    <div id="root"></div>
</body>
</html>
