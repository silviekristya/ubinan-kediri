<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tim extends Model
{
    use HasFactory;

    protected $table = 'tim';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_tim',
        'pml_id',
    ];

    public function pml()
    {
        return $this->belongsTo(Pegawai::class, 'pml_id');
    }

    public function pcl()
    {
        return $this->hasMany(Mitra::class, 'tim_id'); // Satu tim memiliki banyak PPL
    }
}
