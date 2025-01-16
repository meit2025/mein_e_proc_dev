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
use Modules\PurchaseRequisition\Services\TextPoServices;
use Modules\PurchaseRequisition\Services\TextPrServices;

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
        $txtpr = new TextPrServices();
        $txtpo = new TextPoServices();

        // Switch case to handle different types
        switch ($this->type) {
            case 'REIM':
                $reim->processTextData($this->id);
                $txtpr->processTextData($this->id, 'REIM');

                break;

            case 'BT':
                $bt->processTextData($this->id);
                $txtpr->processTextData($this->id, 'BTRE');
                break;

            case 'BTPO':
                $btpo->processTextData($this->id);
                $txtpo->processTextData($this->id, 'BTRDE');

                break;

            case 'PR':
                $procurement->processTextData($this->id);
                $txtpr->processTextData($this->id, 'VEN');
                break;

            default:
                // Handle unknown type case
                break;
        }
    }
}
