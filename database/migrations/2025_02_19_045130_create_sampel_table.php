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
            $table->string('frame_ksa', 20) ->nullable();
            $table->string('prov', 5);
            $table->string('kab', 5);
            $table->string('kec', 5);
            $table->string('nama_prov');
            $table->string('nama_kab');
            $table->string('nama_kec');
            $table->string('nama_lok');
            $table->foreignId('segmen_id')->constrained('segmen')->onDelete('cascade');
            $table->string('subsegmen', 5);
            $table->string('strata', 5);
            $table->string('bulan_listing');
            $table->string('tahun_listing');
            $table->string('fase_tanam')->nullable();
            $table->date('rilis');
            $table->string('a_random')->nullable();
            $table->string('nks', 20);
            $table->string('long');
            $table->string('lat');
            $table->char('subround', 2);
            $table->foreignId('pcl_id')->nullable()->constrained('mitra')->onDelete('cascade');
            $table->foreignId('tim_id')->nullable()->constrained('tim')->onDelete('cascade');
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
