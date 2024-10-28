<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Modules\Master\Models\Family;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nip',
        'role',
        'job_level',
        'division',
        'immediate_spv',
        'email_verified_at',
        'username',
        'is_admin',
        'master_business_partner_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function families()
    {
        return $this->hasMany(Family::class, 'user', 'nip');
    }

    public function employee()
    {
        return $this->hasOne(MasterBusinessPartner::class, 'id', 'master_business_partner_id');
    }

    public function notifikasis()
    {
        return $this->hasMany(Notifikasi::class);
    }
}
