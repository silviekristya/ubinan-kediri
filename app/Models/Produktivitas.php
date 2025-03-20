<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produktivitas extends Model
{
    use HasFactory;

    protected $table = 'produktivitas';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id_hasil_ubinan',
        'luas_perhektar',
        'jumlah_luas_ubinan',
        'produktivitas',
    ];

    // Relasi ke hasil_ubinan: Produktivitas milik satu HasilUbinan
    public function hasilUbinan()
    {
        return $this->belongsTo(HasilUbinan::class, 'id_hasil_ubinan', 'id');
    }
}
