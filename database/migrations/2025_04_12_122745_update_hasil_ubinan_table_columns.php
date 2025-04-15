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
            // drop enum column
            $table->dropColumn('fenomena');
        });

        Schema::table('hasil_ubinan', function (Blueprint $table) {
            // tambahkan FK
            $table->foreignId('fenomena_id')
                  ->nullable()
                  ->after('penanganan_hama')
                  ->constrained('fenomena')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('hasil_ubinan', function (Blueprint $table) {
            $table->dropForeign(['fenomena_id']);
            $table->dropColumn('fenomena_id');
        });

        Schema::table('hasil_ubinan', function (Blueprint $table) {
            // kembalikan enum semula (tanpa opsi baru)
            $table->enum('fenomena', ['Fenomena1','Fenomena2','Fenomena3'])
                  ->nullable()
                  ->after('is_verif');
        });
    }
};
