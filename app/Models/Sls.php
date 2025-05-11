<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sls extends Model
{
    use HasFactory;

    protected $table = 'sls';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'bs_id',
        'nama_sls',
    ];

    /**
     * Relationship: Sls belongs to a BlokSensus
     */
    public function blokSensus()
    {
        return $this->belongsTo(BlokSensus::class, 'bs_id', 'id_bs');
    }

    /**
     * Relationship: one Sls can have many Sampel
     */
    public function sampel()
    {
        return $this->hasMany(Sampel::class, 'id_sls', 'id');
    }
}