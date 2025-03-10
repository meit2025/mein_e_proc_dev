<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Modules\BusinessTrip\Models\BusinessTrip;
use Modules\PurchaseRequisition\Models\Purchase;
use Modules\Reimbuse\Models\ReimburseGroup;

class ChangeStatus extends Mailable
{
    use Queueable, SerializesModels;


    public $user;
    public $type;
    public $status;
    public $pr;
    public $purchase;
    public $reimburseGroup;
    public $businessTrip;
    public $url;
    /**
     * Create a new message instance.
     */
    public function __construct($user, $type, $status, $pr, $purchase = null, $reimburseGroup = null, $businessTrip = null, $url = null)
    {
        //
        $this->user = $user;
        $this->type = $type;
        $this->status = $status;
        $this->pr = $pr;
        $this->purchase = $purchase;
        $this->reimburseGroup = $reimburseGroup;
        $this->businessTrip = $businessTrip;
        $this->url = $url;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->status . ' Request : Purchase Requisition ' . $this->pr;
        if ($this->type == 'Reimbursement') $subject = $this->status . ' Request : Reimbursement ' . $this->reimburseGroup->code;
        if ($this->type == 'Business Trip') $subject = $this->status . ' Request : Business Trip ' . $this->businessTrip->request_no ?? '';
        if ($this->type == 'Business Trip Declaration') $subject = $this->status . ' Request : Business Trip Declaration ' . $this->businessTrip->request_no ?? '';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $userApprove = Auth::user()->name;
        return new Content(
            view: 'emails.change_status_notification',
            with: [
                'user' => $this->user,
                'type' => $this->type,
                'status' => $this->status,
                'pr' => $this->pr,
                'purchase' => $this->purchase,
                'reimburseGroup' => $this->reimburseGroup,
                'businessTrip' => $this->businessTrip,
                'url' => $this->url,
                'icon_cid' => 'icon.png',
                'user_approve' => $userApprove,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [Attachment::fromPath(public_path('images/icon.png'))
            ->as('icon.png') // Nama file dalam email
            ->withMime('image/png')];
    }
}
