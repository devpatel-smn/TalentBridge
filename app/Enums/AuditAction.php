<?php

namespace App\Enums;

enum AuditAction: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Deleted = 'deleted';
    case Restored = 'restored';
    case Login = 'login';
    case Logout = 'logout';
    case Exported = 'exported';
}
