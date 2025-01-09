<?php

namespace App\Console\Commands;

use App\Jobs\SendApprovalEmailJob;
use Illuminate\Console\Command;

class RunSendApprovalEmailJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-send-approval-email-job';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        SendApprovalEmailJob::dispatch();
        $this->info('SendApprovalEmailJob dispatched successfully.');
    }
}
