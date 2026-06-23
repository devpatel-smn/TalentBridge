<?php

return [

    'frontend_url' => env('FRONTEND_URL', env('APP_URL', 'http://localhost')),

    'security' => [
        'password_min_length' => 8,
        'max_login_attempts' => 5,
        'lockout_minutes' => 15,
        'bcrypt_rounds' => (int) env('BCRYPT_ROUNDS', 12),
    ],

];
