<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Modules\BusinessTrip\Models\BusinessTripGradeUser;
use Modules\Master\Models\Family;
use Modules\Master\Models\MasterBusinessPartner;
use Modules\Master\Models\MasterDepartment;
use Modules\Master\Models\MasterDivision;
use Modules\Master\Models\MasterPosition;
use Spatie\Permission\Models\Role;

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
        'role_id',
        // 'job_level',
        // 'division',
        // 'immediate_spv',
        // 'role'

        'email_verified_at',
        'username',
        'is_admin',
        'master_business_partner_id',

        'division_id',
        'position_id',
        'departement_id',
        'is_approval',
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

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function positions()
    {
        return $this->belongsTo(MasterPosition::class, 'position_id', 'id');
    }
    public function divisions()
    {
        return $this->belongsTo(MasterDivision::class, 'division_id', 'id');
    }
    public function departements()
    {
        return $this->belongsTo(MasterDepartment::class, 'departement_id', 'id');
    }
    public function grade()
    {
        return $this->hasOne(BusinessTripGradeUser::class, 'user_id', 'id');
    }

    public function families()
    {
        return $this->hasMany(Family::class, 'user', 'id');
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
