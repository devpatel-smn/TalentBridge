@component('mail::message')
# {{ $title }}

Hello {{ $recipientName }},

{{ $body }}

**Interview details**

| | |
|---|---|
| **Candidate** | {{ $candidateName ?? '—' }} |
| **Company** | {{ $companyName ?? '—' }} |
| **Position** | {{ $jobTitle ?? '—' }} |
| **Date** | {{ $interviewDate ?? '—' }} |
| **Time** | {{ $interviewTime ?? '—' }} |
| **Timezone** | {{ $timezone ?? '—' }} |
@if (! empty($interviewType))
| **Type** | {{ match($interviewType) { 'onsite' => 'In Person', 'video' => 'Video', 'phone' => 'Phone', default => ucfirst(str_replace('_', ' ', $interviewType)) } }} |
@endif
@if (! empty($durationMinutes))
| **Duration** | {{ $durationMinutes }} minutes |
@endif
@if (! empty($location))
| **Location** | {{ $location }} |
@endif
@if (! empty($meetingLink))
| **Meeting link** | [Join meeting]({{ $meetingLink }}) |
@endif
@if (! empty($notes))
| **Notes** | {{ $notes }} |
@endif

@if (! empty($actionUrl))
@component('mail::button', ['url' => $actionUrl])
View interview
@endcomponent
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
