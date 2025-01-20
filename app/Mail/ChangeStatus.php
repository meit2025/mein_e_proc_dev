<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ChangeStatus extends Mailable
{
    use Queueable, SerializesModels;


    public $user;
    public $type;
    public $status;
    /**
     * Create a new message instance.
     */
    public function __construct($user, $type, $status)
    {
        //
        $this->user = $user;
        $this->type = $type;
        $this->status = $status;
    }


    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Change Status Dokument',
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
                'user' => $this->user,  // Mengirim data user ke view
                'type' => $this->type,  // Mengirim data type ke view
                'status' => $this->status,  // Mengirim data type ke view
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
