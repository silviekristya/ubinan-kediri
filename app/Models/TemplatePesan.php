<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplatePesan extends Model
{
    use HasFactory;

    protected $table = 'template_pesan';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nama_template',
        'text',
    ];

    // Enable timestamps
    public $timestamps = true;

    /**
     * One TemplatePesan has many Notifikasi
     */
    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'template_pesan_id', 'id');
    }

    /**
     * One TemplatePesan has many TemplateNotifikasi entries
     */
    public function templateNotifikasi()
    {
        return $this->hasMany(TemplateNotifikasi::class, 'template_pesan_id', 'id');
    }
}