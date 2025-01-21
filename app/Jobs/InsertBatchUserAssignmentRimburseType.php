<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\Master\Services\MasterTypeReimburseUserAssignServices;

class InsertBatchUserAssignmentRimburseType implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $masterReimburseTypeId;
    /**
     * Create a new job instance.
     */
    public function __construct($masterReimburseTypeId)
    {
        $this->masterReimburseTypeId = $masterReimburseTypeId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        MasterTypeReimburseUserAssignServices::insertBatchMasterTypeReimburseUserAssign($this->masterReimburseTypeId);
    }
}