<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\PurchaseRequisition\Services\BtPOService;
use Modules\PurchaseRequisition\Services\BtService;
use Modules\PurchaseRequisition\Services\ProcurementService;
use Modules\PurchaseRequisition\Services\ReimburseServices;

class SapJobs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $id;
    protected $type;
    protected $reim;

    /**
     * Create a new job instance.
     */
    public function __construct($id,  $type, ReimburseServices $reim)
    {
        //
        $this->id = $id;
        $this->type = $type;
        $this->reim = $reim;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        switch ($this->type) {
            case 'REIM':

                $this->reim->processTextData($this->id);
                # code...
                break;

            default:
                # code...
                break;
        }
    }
}
