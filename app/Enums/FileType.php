<?php

namespace App\Enums;

enum FileType: string
{
    case Resume = 'resume';
    case CoverLetter = 'cover_letter';
    case CompanyLogo = 'company_logo';
    case CompanyDocument = 'company_document';
    case ProfilePhoto = 'profile_photo';
    case Other = 'other';
}
