<?php

namespace App\Enums;

enum InterviewType: string
{
    case Phone = 'phone';
    case Video = 'video';
    case Onsite = 'onsite';
    case Technical = 'technical';
    case Panel = 'panel';
    case Hr = 'hr';
}
