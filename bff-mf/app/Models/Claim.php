<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Claim extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'status',
        'description',
        'incident_date',
        'estimated_amount',
        'notes',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'estimated_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}