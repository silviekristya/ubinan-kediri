<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sampel', function (Blueprint $table) {
            //
            $table->enum('jenis_komoditas', [
                    'Padi',
                    'Jagung',
                    'Kedelai',
                    'Kacang tanah',
                    'Ubi Kayu',
                    'Ubi Jalar',
                    'Lainnya'
                ])->nullable()->after('jenis_tanaman');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sampel', function (Blueprint $table) {
            $table->dropColumn('jenis_komoditas');
        });
    }
};
