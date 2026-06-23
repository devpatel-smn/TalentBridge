@component('mail::message')
# {{ $title }}

Hello {{ $recipientName }},

{{ $body }}

@if (! empty($actionUrl))
@component('mail::button', ['url' => $actionUrl])
View Job
@endcomponent
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
