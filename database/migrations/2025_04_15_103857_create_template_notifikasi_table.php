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
        Schema::create('template_notifikasi', function (Blueprint $table) {
            $table->id(); 
            $table->enum('tipe_notifikasi', [
                'PengumumanSampelPML','PengumumanSampelPCL',
                'BulanSampelPML','BulanSampelPCL',
                'H3PencacahanPML','H1PencacahanPML',
                'H3PencacahanPCL','H1PencacahanPCL',
            ]);
            
            $table->unsignedBigInteger('template_pesan_id');
            $table->enum('jenis', ['Email', 'WhatsApp']);

            // composite primary key
            $table->unique(['tipe_notifikasi','template_pesan_id','jenis'], 'uniq_template_notif');


            // foreign key ke template_pesan
            $table->foreign('template_pesan_id')
                  ->references('id')
                  ->on('template_pesan')
                  ->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_notifikasi');
    }
};
