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


    /**
     * Create a new job instance.
     */
    public function __construct($id,  $type)
    {
        //
        $this->id = $id;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Instantiate services within the job
        $reim = new ReimburseServices();
        $bt = new BtService();
        $btpo = new BtPOService();
        $procurement = new ProcurementService();

        // Switch case to handle different types
        switch ($this->type) {
            case 'REIM':
                $reim->processTextData($this->id);
                break;

            case 'BT':
                $bt->processTextData($this->id);
                break;

            case 'BTPO':
                $btpo->processTextData($this->id);
                break;

            case 'PR':
                $procurement->processTextData($this->id);
                break;

            default:
                // Handle unknown type case
                break;
        }
    }
}
