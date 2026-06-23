<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'TalentBridge') }}</title>
    <script>
        (function () {
            const storageKey = 'talentbridge-theme';
            const theme = localStorage.getItem(storageKey) || 'system';
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) document.documentElement.classList.add('dark');
        })();
    </script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.tsx'])
</head>
<body class="min-h-screen bg-background font-sans antialiased">
    <div id="root"></div>
</body>
</html>
