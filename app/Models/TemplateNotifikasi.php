<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasCompositePrimaryKey;

class TemplateNotifikasi extends Model
{
    use HasCompositePrimaryKey;

    protected $table = 'template_notifikasi';

    // Composite primary key.
    protected $primaryKey = ['tipe_notifikasi', 'template_pesan_id'];

    
    // Primary keys are non-incrementing and stringable.
    public $incrementing = false;
    protected $keyType = 'string';

    // Disable timestamps.
    public $timestamps = false;

    protected $fillable = [
        'tipe_notifikasi',
        'template_pesan_id',
        'default_vars',
    ];

    protected $casts = [
        'default_vars' => 'array',
    ];

    public function templatePesan()
    {
        return $this->belongsTo(TemplatePesan::class, 'template_pesan_id');
    }
}
