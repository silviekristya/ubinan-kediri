<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fenomena extends Model
{
    protected $table = 'fenomena';
    protected $primaryKey = 'id';

    protected $fillable = ['nama'];

    public function hasilUbinan()
    {
        return $this->hasMany(HasilUbinan::class, 'fenomena_id');
    }
}
