<?php

use App\Jobs\SendApprovalEmailJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::job(new SendApprovalEmailJob())
    ->hourlyAt(0)
    ->between('08:00', '17:00');

Schedule::job(new SendApprovalEmailJob())->everyFiveSeconds();
