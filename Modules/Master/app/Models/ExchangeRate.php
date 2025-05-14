<?php

namespace Modules\Master\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExchangeRate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'worklist',
        'er',
        'from',
        'to',
        'relation',
        'last_date',
        'old_er',
        'tolerance'
    ];

    public static function getExchangeRate(string $from, string $to, $amount)
    {
        $exchangeRate = self::where('from', strtoupper($from))
            ->where('to', strtoupper($to))
            ->orderBy('last_date', 'desc')
            ->first();
        if (!$exchangeRate) {
            throw new \Exception('Could not find exchange rate for ' . $from . ' to ' . $to);
        }


        // Ambil nilai tukar dan toleransi
        $rate = (float) $exchangeRate->old_er;
        $tolerance = (float) $exchangeRate->tolerance;

        // Jika ada toleransi, tambahkan ke nilai tukar
        $finalRate = $rate + ($rate * $tolerance);

        return (int)$amount * $finalRate;
    }
}
