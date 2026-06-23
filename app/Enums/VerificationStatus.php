<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Pending = 'pending';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case ResubmissionRequired = 'resubmission_required';
}
