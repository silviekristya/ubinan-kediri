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
        Schema::table('hasil_ubinan', function (Blueprint $table) {
            // tambahkan fenomena_id (nullable untuk aman terhadap data lama)
            $table->foreignId('fenomena_id')
                  ->nullable()
                  ->constrained('fenomena')   // atau 'fenomenas' jika tabelnya begitu nama
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hasil_ubinan', function (Blueprint $table) {
            // hapus dulu constraint FK, lalu kolomnya
            $table->dropForeign(['fenomena_id']);
            $table->dropColumn('fenomena_id');
        });
    }
};
