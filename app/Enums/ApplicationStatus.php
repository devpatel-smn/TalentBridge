<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Submitted = 'submitted';
    case UnderReview = 'under_review';
    case Shortlisted = 'shortlisted';
    case InterviewScheduled = 'interview_scheduled';
    case Interviewed = 'interviewed';
    case Offered = 'offered';
    case Hired = 'hired';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';
}
