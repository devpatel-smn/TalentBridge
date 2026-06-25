@component('mail::message')
# {{ $title }}

Hello {{ $recipientName }},

{{ $body }}

**Cancelled interview**

| | |
|---|---|
| **Candidate** | {{ $candidateName ?? '—' }} |
| **Company** | {{ $companyName ?? '—' }} |
| **Position** | {{ $jobTitle ?? '—' }} |
| **Date** | {{ $interviewDate ?? '—' }} |
| **Time** | {{ $interviewTime ?? '—' }} |
| **Timezone** | {{ $timezone ?? '—' }} |
@if (! empty($cancellationReason))
| **Reason** | {{ $cancellationReason }} |
@endif

@if (! empty($actionUrl))
@component('mail::button', ['url' => $actionUrl])
View interviews
@endcomponent
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
