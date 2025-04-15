<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HasilUbinan extends Model
{
    use HasFactory;

    // Jika nama tabel tidak standar (bukan "hasil_ubinans"), kita tentukan secara eksplisit:
    protected $table = 'hasil_ubinan';
    protected $primaryKey = 'id';

    /**
     * Daftar field yang dapat diisi secara massal.
     *
     * @var array
     */
    protected $fillable = [
        'tanggal_pencacahan',
        'pengecekan_id',
        'berat_hasil_ubinan',
        'jumlah_rumpun',
        'luas_lahan',
        'cara_penanaman',
        'jenis_pupuk',
        'penanganan_hama',
        'fenomena_id',
        'status',
        'is_verif',
        
    ];

    // Relasi ke tabel pengecekan
    public function pengecekan()
    {
        return $this->belongsTo(Pengecekan::class, 'pengecekan_id');
    }

    public function produktivitas()
    {
        return $this->hasOne(Produktivitas::class, 'hasil_ubinan_id');
    }

    // Relasi ke tabel fenomena
    public function fenomena()
    {
        return $this->belongsTo(Fenomena::class, 'fenomena_id');
    }
}
