<?php

namespace App\Enums;

enum WorkMode: string
{
    case Onsite = 'onsite';
    case Remote = 'remote';
    case Hybrid = 'hybrid';
}
