<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notifikasi;
use App\Models\TemplateNotifikasi;
use App\Models\Sampel;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendMonthlyNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-monthly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat notifikasi pengingat pengecekan dan pencacahan setiap awal bulan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        Log::info("Menjalankan SendMonthlyNotifications pada {$now}");

        // Tentukan rentang “bulan berjalan”:
        $firstOfMonth = $now->copy()->startOfMonth();
        $lastOfMonth  = $now->copy()->endOfMonth();

        //  Ambil semua Sampel yang status_sampel != 'NonEligible'
        //    lalu filter: hanya yang BELUM punya HasilUbinan di rentang bulan ini
        $daftarSampel = Sampel::with(['tim.pml', 'pcl', 'pengecekan.hasilUbinan'])
            ->where('status_sampel', '!=', 'NonEligible')
            ->get()
            ->filter(function($s) use ($firstOfMonth, $lastOfMonth) {
                // Jika sampel sudah punya HasilUbinan di rentang bulan ini, skip
                if (! $s->pengecekan) {
                    return true;
                }
                $adaHasil = $s->pengecekan->hasilUbinan()
                    ->whereBetween('tanggal_pencacahan', [$firstOfMonth, $lastOfMonth])
                    ->exists();
                return ! $adaHasil;
            });

        if ($daftarSampel->isEmpty()) {
            Log::info("Tidak ada sampel yang perlu diingatkan pencacahan bulan ini.");
            return;
        }
        Log::info("Ditemukan ". $daftarSampel->count() ." sampel yang perlu diingatkan.");

        // Ambil baris template_notifikasi untuk BulanSampelPML dan BulanSampelPCL
        $templatesPML = TemplateNotifikasi::where('tipe_notifikasi', 'BulanSampelPML')
                            ->whereIn('jenis', ['Email','WhatsApp'])
                            ->get();
        $templatesPCL = TemplateNotifikasi::where('tipe_notifikasi', 'BulanSampelPCL')
                            ->whereIn('jenis', ['Email','WhatsApp'])
                            ->get();

        // Grouping per PML (tipe BulanSampelPML)
        $byPml = $daftarSampel->filter(fn($s) => optional($s->tim->pml)->id)
            ->groupBy(fn($s) => $s->tim->pml->id);

        foreach ($byPml as $pmlId => $groupSampel) {
            // Contoh: grupSampel hanya berisi Sampel milik PML tertentu
            $pmlObj = $groupSampel->first()->tim->pml;

            // Kita buat “daftar_sampel” (bullet list) nanti di template
            $lines = $groupSampel->map(function($s) {
                // Misal: gunakan NKS & nama_lok, kecamatan ID untuk men‐identify sampel
                return "• NKS {$s->nks} – Lokasi: {$s->nama_lok} (Kec. {$s->kecamatan_id})";
            })->toArray();
            $daftarText = implode("\n", $lines);

            // Buat satu entri Notifikasi untuk tiap template (Email & WhatsApp)
            foreach ($templatesPML as $template) {
                Notifikasi::create([
                    'template_notifikasi_id' => $template->id,
                    'tim_id'                 => $groupSampel->first()->tim_id,
                    'pml_id'                 => $pmlObj->id,
                    'pcl_id'                 => null,
                    'email'                  => $pmlObj->user->email  ?? '',
                    'no_wa'                  => $pmlObj->no_telepon  ?? '',
                    'sampel_id'              => $groupSampel->first()->id,
                    'pengecekan_id'          => $groupSampel->first()->pengecekan_id,
                    'status'                 => 'Pending',
                    'tanggal_terkirim'       => now(),
                ]);
            }
        }

        // Grouping per PCL (tipe BulanSampelPCL)
        $byPcl = $daftarSampel->filter(fn($s) => optional($s->pcl)->id)
            ->groupBy(fn($s) => $s->pcl->id);

        foreach ($byPcl as $pclId => $groupSampel) {
            $pclObj = $groupSampel->first()->pcl;
            $lines = $groupSampel->map(function($s) {
                return "• NKS {$s->nks} – Lokasi: {$s->nama_lok} (Kec. {$s->kecamatan_id})";
            })->toArray();
            $daftarText = implode("\n", $lines);

            foreach ($templatesPCL as $template) {
                Notifikasi::create([
                    'template_notifikasi_id' => $template->id,
                    'tim_id'                 => $groupSampel->first()->tim_id,
                    'pml_id'                 => null,
                    'pcl_id'                 => $pclObj->id,
                    'email'                  => $pclObj->user->email ?? '',
                    'no_wa'                  => $pclObj->no_telepon ?? '',
                    'sampel_id'              => $groupSampel->first()->id,
                    'pengecekan_id'          => $groupSampel->first()->pengecekan_id,
                    'status'                 => 'Pending',
                    'tanggal_terkirim'       => now(),
                ]);
            }
        }

        $this->info("SendMonthlyNotifications selesai: entri Notifikasi bulan ini sudah dibuat (status=Pending).");
        Log::info("SendMonthlyNotifications selesai.");
    }
}
