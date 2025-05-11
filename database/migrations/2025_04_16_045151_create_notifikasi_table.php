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
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_notifikasi_id')
                  ->constrained('template_notifikasi')
                  ->onDelete('cascade');
            $table->foreignId('tim_id')->constrained('tim')->onDelete('cascade');
            $table->foreignId('pml_id')->constrained('pegawai')->onDelete('cascade');
            $table->foreignId('pcl_id')->constrained('mitra')->onDelete('cascade');
            $table->string('email');
            $table->string('no_wa', 20);
            $table->foreignId('sampel_id')->constrained('sampel')->onDelete('cascade');
            $table->foreignId('pengecekan_id')->constrained('pengecekan')->onDelete('cascade');
            $table->enum('status', ['Terkirim', 'Gagal']);
            $table->timestamp('tanggal_terkirim')
                  ->useCurrent()
                  ->change();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifikasi');
    }
};
