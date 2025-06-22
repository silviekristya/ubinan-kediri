<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengecekan extends Model
{
    use HasFactory;

    protected $table = 'pengecekan';
    protected $primaryKey = 'id';
    protected $dates = [
        'tanggal_panen',
        'tanggal_pengecekan',
        'verif_at',
    ];
    // protected $casts = [
    //     'tanggal_pengecekan' => 'date:d-m-Y',
    //     'tanggal_panen' => 'date:d-m-Y',
    // ];

    protected $fillable = [
        'id_sampel',
        'tanggal_pengecekan',
        'nama_responden',
        'alamat_responden',
        'no_telepon_responden',
        'tanggal_panen',
        'keterangan',
        'status_sampel',
        'id_sampel_cadangan',
        'verif_at',
    ];

    // Relasi ke sampel: Pengecekan milik satu Sampel
    public function sampel()
    {
        return $this->belongsTo(Sampel::class, 'id_sampel', 'id');
    }

    public function cadangan()
    {
        return $this->belongsTo(Sampel::class, 'id_sampel_cadangan', 'id');
    }

    // Relasi ke hasil_ubinan (one-to-one?)
    // Pengecekan.id -> hasil_ubinan.pengecekan_id: satu Pengecekan memiliki satu HasilUbinan
    public function hasilUbinan()
    {
        return $this->hasOne(HasilUbinan::class, 'pengecekan_id', 'id');
    }

    // Relasi ke notifikasi : satu Pengecekan dapat memiliki banyak Notifikasi
    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'pengecekan_id', 'id');
    }
}
