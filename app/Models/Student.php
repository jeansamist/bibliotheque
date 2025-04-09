<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'user_id',
    ];

    /**
     * Get the user that owns the student.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the loans for the student.
     */
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * Get active loans for the student.
     */
    public function activeLoans(): HasMany
    {
        return $this->hasMany(Loan::class)->where('returned_at', null);
    }

    /**
     * Get returned loans for the student.
     */
    public function returnedLoans(): HasMany
    {
        return $this->hasMany(Loan::class)->whereNotNull('returned_at');
    }
}