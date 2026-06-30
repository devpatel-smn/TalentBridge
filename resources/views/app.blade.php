<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'TalentBridge') }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&display=swap" rel="stylesheet">
    <script>
        (function () {
            const storageKey = 'talentbridge-theme';
            const theme = localStorage.getItem(storageKey) || 'system';
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) document.documentElement.classList.add('dark');
        })();
    </script>
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
