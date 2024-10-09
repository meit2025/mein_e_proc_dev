<?php

namespace App\Jobs;

use App\Events\NotifikasiUsers;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Notifikasi;
use App\Models\User;

class SendNotification implements ShouldQueue
{
    use Queueable,  InteractsWithQueue, Queueable, SerializesModels;

    protected $user;
    protected $message;
    protected $url;
    /**
     * Create a new job instance.
     */
    public function __construct(User $user, string $message, string $url)
    {
        $this->user = $user;
        $this->message = $message;
        $this->url = $url;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        $create = Notifikasi::create([
            'user_id' => $this->user->id,
            'message' => $this->message,
            'url_redirect' => $this->url,
            'is_read' => false,
        ]);
        event(new NotifikasiUsers($create));
    }
}
