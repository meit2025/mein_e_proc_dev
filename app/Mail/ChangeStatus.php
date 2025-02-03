<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
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
    /**
     * Create a new message instance.
     */
    public function __construct($user, $type, $status, $pr, $purchase = null, $reimburseGroup = null, $businessTrip = null)
    {
        //
        $this->user = $user;
        $this->type = $type;
        $this->status = $status;
        $this->pr = $pr;
        $this->purchase = $purchase;
        $this->reimburseGroup = $reimburseGroup;
        $this->businessTrip = $businessTrip;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->status . ' Request : Purchase Requisition ' . $this->pr,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
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
        return [];
    }
}
