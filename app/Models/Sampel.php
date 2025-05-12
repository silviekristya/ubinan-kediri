<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sampel extends Model
{
    use HasFactory;
    protected $table = 'sampel';
    protected $primaryKey = 'id';   // Kolom id pada tabel sampel
    protected $guarded = []; // Mengizinkan semua kolom untuk diisi
    public function getNamaPmlAttribute()
    {
        if ($this->tim) {
            return $this->tim->pml ? $this->tim->pml->nama : null;
        }
        return null;
    }

    public function provinsi()
    {
        return $this->belongsTo(Provinsi::class, 'provinsi_id', 'kode_provinsi');
    }

    // relasi ke Kabupaten/Kota
    public function kabKota()
    {
        return $this->belongsTo(KabKota::class, 'kab_kota_id', 'id');
    }

    // relasi ke Kecamatan
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kecamatan_id', 'id');
    }

    // relasi ke Kelurahan/Desa
    public function kelDesa()
    {
        return $this->belongsTo(KelDesa::class, 'kel_desa_id', 'id');
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
