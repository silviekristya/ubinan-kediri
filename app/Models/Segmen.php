<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Segmen extends Model
{
    use HasFactory;
    protected $table = 'segmen';
    protected $primaryKey = 'id_segmen';
    public $incrementing = false; // Karena id_segmen berupa string dan tidak auto-increment
    protected $keyType = 'string';

    protected $fillable = [
        'id_segmen',
        'nama_segmen',
    ];

    /**
     * Relationships.
     */
    public function sampel()
    {
        return $this->hasMany(Sampel::class, 'segmen_id', 'id_segmen');    // Satu Segmen memiliki banyak Sampel
    }   
    
}
