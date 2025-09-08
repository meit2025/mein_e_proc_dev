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
        $approvals = Approval::select("user_id")
            ->where('is_status', false)
            ->where('is_approval', true)
            ->get()
            ->groupBy('user_id');
        $userIds = $approvals->keys();
        $this->info('User IDs: ' . $userIds->implode(', '));

        foreach ($userIds as $key => $value) {
            # code...
            $approvals = Approval::with("user.divisions")
                ->where('is_status', false)
                ->where('is_approval', true)
                ->where('user_id', $value)
                ->get();

            $arraySendEmail = [];

            foreach ($approvals as $approval) {
                // get request number
                $nopr = "-";
                $type = "";
                $url = "";
                $name = "";
                $baseUrl = env('APP_URL', 'https://meingmbh.com');
                if ($approval->document_name == 'PR') {
                    $url =  $baseUrl . '/purchase-requisition/detail/' .  $approval->document_id;
                    $pr = Purchase::with('user')->where('id', $approval->document_id)->first();
                    $nopr = $pr->purchases_number;
                    $name = $pr->user->name ?? "";
                    $type = "Purchase Requistion";
                } elseif ($approval->document_name == 'REIM') {
                    $url = $baseUrl . '/reimburse/detail/' .  $approval->document_id;
                    $reim = ReimburseGroup::with('user')->where('id', $approval->document_id)->first();
                    $name = $reim->user->name ?? "";
                    $nopr = $reim->code ?? "";
                    $type = "Reimbursement";
                } elseif ($approval->document_name == 'TRIP') {
                    $url = $baseUrl .  '/business-trip/detail-page/' .  $approval->document_id;
                    $trip = BusinessTrip::with('requestFor')->where('id', $approval->document_id)->where('type', 'request')->first();
                    $name = $trip->requestFor->name ?? "";
                    $nopr = $trip->request_no ?? "";
                    $type = "Business Trip";
                } elseif ($approval->document_name == 'TRIP_DECLARATION') {
                    $url = $baseUrl .  '/business-trip/detail-page/' .  $approval->document_id;
                    $trip = BusinessTrip::with('requestFor')->where('id', $approval->document_id)->where('type', 'declaration')->first();
                    $nopr = $trip->request_no ?? "";
                    $name = $trip->requestFor->name ?? "";
                    $type = "Business Trip Declaration";
                }
                $data = [
                    'name' => $name,
                    'pr' => $nopr,
                    'type' => $type,
                    'url' => $url,
                ];
                $arraySendEmail[] = $data;
            }
            if ($approval && $approval->user && $approval->user->email) {

                Mail::mailer(env("MAIL_MAILER", 'smtp'))->to($approval->user->email)->send(new ApprovalNotificationMail($approval->user, $arraySendEmail));
            } else {
                $this->info('Approval not found item id ' . $approval->id . ' documentApproval ' . $approval->document_name);
            }
        }


        //
        // SendApprovalEmailJob::dispatch();
        // Log::channel('notification_email')->info('SendApprovalEmailJob started');
        // $this->info('SendApprovalEmailJob started');


        // // Daftar jenis dokumen dan model terkait
        // $documents = [
        //     'REIMBURSEMENT' => ['REIM', ReimburseGroup::class],
        //     'BUSINESS TRIP' => ['TRIP', BusinessTrip::class],
        //     'BUSINESS TRIP DECLARATION' => ['TRIP_DECLARATION', BusinessTrip::class],
        //     'PURCHASE REQUEST' => ['PR', Purchase::class],
        // ];

        // // Proses untuk setiap jenis dokumen
        // foreach ($documents as $documentName => [$documentApproval, $model]) {
        //     // Ambil semua entri dengan status_id = 1
        //     $dataQuery = $model::where('status_id', 1);

        //     if ($documentApproval == 'TRIP') {
        //         $dataQuery->where('type', 'request');
        //     }

        //     if ($documentApproval == 'TRIP_DECLARATION') {
        //         $dataQuery->where('type', 'declaration');
        //     }

        //     $dataQuery->chunk(100, function ($items) use ($documentName, $documentApproval) {
        //         Log::channel('notification_email')->info('SendApprovalEmailJob started ' . $documentApproval);
        //         $this->info('SendApprovalEmailJob started ' . $documentApproval);

        //         foreach ($items as $item) {
        //             // Ambil approval terakhir untuk dokumen ini
        //             $approval = Approval::with('user.divisions')
        //                 ->where('document_id', $item->id)
        //                 ->where('document_name', $documentApproval)
        //                 ->where('is_status', false)
        //                 ->where('is_approval', true)
        //                 ->latest('id')
        //                 ->first();

        //             // Pastikan approval ada dan belum diproses
        //             if ($approval && $approval->user && $approval->user->email) {
        //                 try {
        //                     Log::channel('notification_email')->info('Send email to ' . $approval->user->email);
        //                     $this->info('Send email to ' . $approval->user->email . ' documentApproval ' . $documentApproval . ' item id ' . $item->id);

        //                     // Kirim email dengan mailable yang sesuai dan queue-kan pengirimannya
        // Mail::to($approval->user->email)->send(new ApprovalNotificationMail($approval->user, $documentName));
        //                 } catch (\Exception $e) {
        //                     $this->info($e->getMessage());
        //                 }
        //             } else {
        //                 Log::channel('notification_email')->info('Approval not found item id ' . $item->id . ' documentApproval ' . $documentApproval);
        //                 $this->info('Approval not found item id ' . $item->id . ' documentApproval ' . $documentApproval);
        //             }
        //         }
        //     });
        // }
    }
}
