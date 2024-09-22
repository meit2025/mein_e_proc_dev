<?php

namespace Modules\Reimbuse\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\DB;
use Modules\Reimbuse\Models\Reimburse;

class ProcessReimbursements implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function handle()
    {
        try {
            DB::beginTransaction();
            Reimburse::create($this->data);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }
}

