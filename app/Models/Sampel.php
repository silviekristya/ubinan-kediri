<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sampel extends Model
{
    use HasFactory;
    protected $table = 'sampel';
    protected $primaryKey = 'id';   // Kolom id pada tabel sampel
    protected $fillable = [
        'jenis_sampel',
        'jenis_tanaman',
        'jenis_komoditas',
        'frame_ksa',
        'prov',
        'kab',
        'kec',
        'nama_prov',
        'nama_kab',
        'nama_kec',
        'nama_lok',
        'segmen_id',
        'subsegmen',
        'id_sls',
        'nama_krt',
        'strata',
        'bulan_listing',
        'tahun_listing',
        'fase_tanam',
        'rilis',
        'a_random',
        'nks',
        'long',
        'lat',
        'subround',
        'perkiraan_minggu_panen',
        'pcl_id',
        'tim_id',
    ];
    public function getNamaPmlAttribute()
{
    if ($this->tim) {
        return $this->tim->pml ? $this->tim->pml->nama : null;
    }
    return null;
}
    // Relasi ke Segmen: Sampel milik satu Segmen (mengacu ke kolom segmen_id)
    public function segmen()
    {
        return $this->belongsTo(Segmen::class, 'segmen_id', 'id_segmen');
    }
    
    // Relasi ke Mitra: Sampel milik satu Mitra (pcl_id mengacu ke id Mitra)
    public function pcl()
    {
        return $this->belongsTo(Mitra::class, 'pcl_id', 'id');
    }
    
    // Relasi ke Tim: Sampel milik satu Tim (melalui tim_id)
    public function tim()
    {
        return $this->belongsTo(Tim::class, 'tim_id', 'id');
    }
    
    // Relasi ke Pengecekan: Satu Sampel dapat memiliki satu Pengecekan
    public function pengecekan()
    {
        return $this->hasOne(Pengecekan::class, 'id_sampel', 'id');
    }

     /**
     * Pengecekan di mana sampel ini dipilih sebagai CADANGAN
     */
    public function pengecekanCadangan()
    {
        return $this->hasOne(Pengecekan::class, 'id_sampel_cadangan');
    }
    
    // Relasi ke Notifikasi: Satu Sampel dapat memiliki banyak Notifikasi
    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'sampel_id', 'id');
    }
     // Relasi ke nama_sls (id_sls): Sampel milik satu Sls
     public function sls()
     {
         return $this->belongsTo(Sls::class, 'id_sls', 'id');
     }
}
