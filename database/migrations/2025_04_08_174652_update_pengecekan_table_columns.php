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
        Schema::table('pengecekan', function (Blueprint $table) {
            $table->dropColumn('subround');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengecekan', function (Blueprint $table) {
            $table->char('subround', 2)->after('tanggal_pengecekan');
        });
    }
};
