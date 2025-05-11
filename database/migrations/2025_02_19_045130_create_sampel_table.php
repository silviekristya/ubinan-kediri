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
        Schema::create('sampel', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis_sampel', ['Utama', 'Cadangan']);
            $table->enum('jenis_tanaman', ['Padi', 'Palawija']);
            $table->enum('jenis_komoditas', [
                'Padi',
                'Jagung',
                'Kedelai',
                'Kacang tanah',
                'Ubi Kayu',
                'Ubi Jalar',
                'Lainnya'
            ])->nullable();
            $table->string('frame_ksa', 20) ->nullable();

            $table->string('provinsi_id', 2);
            $table->string('kab_kota_id', 4);
            $table->string('kecamatan_id', 7);
            $table->string('kel_desa_id', 10);

            $table->string('nama_lok');

            $table->foreign('provinsi_id')
                  ->references('kode_provinsi')->on('provinsi')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            $table->foreign('kab_kota_id')
                  ->references('id')->on('kab_kota')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            $table->foreign('kecamatan_id')
                  ->references('id')->on('kecamatan')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
            $table->foreign('kel_desa_id')
                  ->references('id')->on('kel_desa')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');

            $table->string('segmen_id', 10)->nullable();
            $table->foreign('segmen_id')
                  ->references('id_segmen')->on('segmen')
                  ->onUpdate('cascade')
                  ->onDelete('set null');
            $table->string('subsegmen', 5)->nullable();
            $table->string('strata', 5)->nullable();
            $table->string('bulan_listing');
            $table->string('tahun_listing');
            $table->string('fase_tanam')->nullable();
            $table->date('rilis');
            $table->string('a_random');
            $table->string('nks', 20);
            $table->string('long');
            $table->string('lat');
            $table->char('subround', 2);
            $table->foreignId('pcl_id')->nullable()->constrained('mitra')->onDelete('cascade');
            $table->foreignId('tim_id')->nullable()->constrained('tim')->onDelete('cascade');
            $table->foreignId('id_sls')->nullable()->constrained('sls')->cascadeOnDelete();
            $table->string('nama_krt')->nullable();
            $table->integer('perkiraan_minggu_panen')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sampel');
    }
};
