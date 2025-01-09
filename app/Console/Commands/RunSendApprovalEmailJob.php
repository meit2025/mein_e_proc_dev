<?php

namespace App\Console\Commands;

use App\Jobs\SendApprovalEmailJob;
use App\Mail\ApprovalNotificationMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Modules\Approval\Models\Approval;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\Reimbuse\Models\ReimburseGroup;

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
        Log::channel('notification_email')->info('SendApprovalEmailJob started');
        $this->info('SendApprovalEmailJob started');


        // Daftar jenis dokumen dan model terkait
        $documents = [
            'REIMBURSEMENT' => ['REIM', ReimburseGroup::class],
            'BUSINESS TRIP' => ['TRIP', BusinessTrip::class],
            'BUSINESS TRIP DECLARATION' => ['TRIP_DECLARATION', BusinessTrip::class],
            'PURCHASE REQUEST' => ['PR', Purchase::class],
        ];

        // Proses untuk setiap jenis dokumen
        foreach ($documents as $documentName => [$documentApproval, $model]) {
            // Ambil semua entri dengan status_id = 1
            $dataQuery = $model::where('status_id', 1);

            if ($documentApproval == 'TRIP') {
                $dataQuery->where('type', 'request');
            }

            if ($documentApproval == 'TRIP_DECLARATION') {
                $dataQuery->where('type', 'declaration');
            }

            $dataQuery->chunk(100, function ($items) use ($documentName, $documentApproval) {
                Log::channel('notification_email')->info('SendApprovalEmailJob started ' . $documentApproval);
                $this->info('SendApprovalEmailJob started ' . $documentApproval);

                foreach ($items as $item) {
                    // Ambil approval terakhir untuk dokumen ini
                    $approval = Approval::with('user.divisions')
                        ->where('document_id', $item->id)
                        ->where('document_name', $documentApproval)
                        ->where('is_status', false)
                        ->latest('id')
                        ->first();

                    // Pastikan approval ada dan belum diproses
                    if ($approval && $approval->user && $approval->user->email) {
                        try {
                            Log::channel('notification_email')->info('Send email to ' . $approval->user->email);
                            $this->info('Send email to ' . $approval->user->email . ' documentApproval ' . $documentApproval . ' item id ' . $item->id);

                            // Kirim email dengan mailable yang sesuai dan queue-kan pengirimannya
                            Mail::to($approval->user->email)->send(new ApprovalNotificationMail($approval->user, $documentName));
                        } catch (\Exception $e) {
                            $this->info($e->getMessage());
                        }
                    } else {
                        Log::channel('notification_email')->info('Approval not found item id ' . $item->id . ' documentApproval ' . $documentApproval);
                        $this->info('Approval not found item id ' . $item->id . ' documentApproval ' . $documentApproval);
                    }
                }
            });
        }
    }
}
