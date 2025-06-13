<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'notifikasi';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'template_notifikasi_id',
        'tim_id',
        'pml_id',
        'pcl_id',
        'email',
        'no_wa',
        'sampel_id',
        'pengecekan_id',
        'status',
        'tanggal_terkirim',
    ];

    /**
     * Belongs to TemplateNotifikasi
     */
    public function templateNotifikasi()
    {
        return $this->belongsTo(TemplateNotifikasi::class, 'template_notifikasi_id', 'template_pesan_id');
    }

    /**
     * Belongs to Tim
     */
    public function tim()
    {
        return $this->belongsTo(Tim::class, 'tim_id', 'id');
    }

    /**
     * Belongs to Pegawai (PML)
     */
    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'pml_id', 'id');
    }

    /**
     * Belongs to Mitra (PCL)
     */
    public function mitra()
    {
        return $this->belongsTo(Mitra::class, 'pcl_id', 'id');
    }

    /**
     * Belongs to Sampel
     */
    public function sampel()
    {
        return $this->belongsTo(Sampel::class, 'sampel_id', 'id');
    }

    /**
     * Belongs to Pengecekan
     */
    public function pengecekan()
    {
        return $this->belongsTo(Pengecekan::class, 'pengecekan_id', 'id');
    }
}
