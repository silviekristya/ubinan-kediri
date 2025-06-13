<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TemplateNotifikasi extends Model
{
    use HasFactory;

    protected $table = 'template_notifikasi';

    // Composite primary key
    protected $primaryKey = ['tipe_notifikasi', 'template_pesan_id'];

    // Non-incrementing, stringable keys
    public $incrementing = false;
    protected $keyType = 'string';

    // No timestamps on this table
    public $timestamps = false;

    protected $fillable = [
        'tipe_notifikasi',
        'template_pesan_id',
        'jenis',
        'default_vars',
    ];

    protected $casts = [
        'default_vars' => 'array',
    ];

    /**
     * Relation to TemplatePesan
     */
    public function templatePesan()
    {
        return $this->belongsTo(TemplatePesan::class, 'template_pesan_id', 'id');
    }

    /**
     * Relation to Notifikasi
     */
    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'template_notifikasi_id', 'template_pesan_id');
    }
}