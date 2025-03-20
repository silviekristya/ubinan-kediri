<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplatePesan extends Model
{
    use HasFactory;

    protected $table = 'template_pesan';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_template',
        'text',
    ];

    // Relasi ke notifikasi: TemplatePesan memiliki banyak Notifikasi
    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'template_pesan_id', 'id');
    }
}
