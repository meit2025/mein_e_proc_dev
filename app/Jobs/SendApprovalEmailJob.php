<?php

namespace App\Jobs;

use App\Mail\ApprovalNotificationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Modules\Approval\Models\Approval;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\Reimbuse\Models\ReimburseGroup;

class SendApprovalEmailJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::channel('notification_email')->info('SendApprovalEmailJob started');

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
            $model::where('status_id', 1)->chunk(100, function ($items) use ($documentName, $documentApproval) {
                Log::channel('notification_email')->info('SendApprovalEmailJob started ' . $documentApproval);
                foreach ($items as $item) {
                    // Ambil approval terakhir untuk dokumen ini
                    $approval = Approval::with('user.divisions')
                        ->where('document_id', $item->id)
                        ->where('document_name', $documentApproval)
                        ->latest('id')
                        ->first();

                    // Pastikan approval ada dan belum diproses
                    if ($approval && !$approval->is_status && $approval->user && $approval->user->email) {
                        try {
                            Log::channel('notification_email')->info('Send email to ' . $approval->user->email);
                            // Kirim email dengan mailable yang sesuai dan queue-kan pengirimannya
                            Mail::to($approval->user->email)->queue(new ApprovalNotificationMail($approval->user, $documentName));
                        } catch (\Exception $e) {
                            report($e);  // Log jika terjadi kesalahan saat mengirim email
                            Log::channel('notification_email')->info('Failed send email to ' . $approval->user->email);
                        }
                    } else {
                        Log::channel('notification_email')->info('Approval not found' . $item->id);
                    }
                }
            });
        }
    }
}
