<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'notifikasi';
    protected $primaryKey = 'id';

    protected $fillable = [
        'tipe_notifikasi',
        'tim_id',
        'pml_id',
        'pcl_id',
        'email',
        'no_wa',
        'sampel_id',
        'pengecekan_id',
        'template_pesan_id',
        'tanggal_terkirim',
        'status',
    ];

    // Relasi ke tim: notifikasi milik satu tim
    public function tim()
    {
        return $this->belongsTo(Tim::class, 'tim_id', 'id');
    }

    // Relasi ke pegawai (pml_id)
    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'pml_id', 'id');
    }

    // Relasi ke mitra (pcl_id)
    public function mitra()
    {
        return $this->belongsTo(Mitra::class, 'pcl_id', 'id');
    }

    // Relasi ke sampel (sampel_id)
    public function sampel()
    {
        return $this->belongsTo(Sampel::class, 'sampel_id', 'id');
    }

    // Relasi ke pengecekan (pengecekan_id)
    public function pengecekan()
    {
        return $this->belongsTo(Pengecekan::class, 'pengecekan_id', 'id');
    }

    // Relasi ke template_pesan
    public function templatePesan()
    {
        return $this->belongsTo(TemplatePesan::class, 'template_pesan_id', 'id');
    }
}
