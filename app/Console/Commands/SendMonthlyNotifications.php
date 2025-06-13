<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notifikasi;
use App\Models\TemplateNotifikasi;
use App\Models\Sampel;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendMonthlyNotifications extends Command
{
    protected $signature   = 'notifications:send-monthly';
    protected $description = 'Buat dan kirim notifikasi pengingat pengecekan dan pencacahan setiap awal bulan';

    public function handle(NotificationService $service)
    {
        $now = Carbon::now();
        Log::info("Menjalankan SendMonthlyNotifications pada {$now}");

        // Tentukan rentang “bulan berjalan”
        $firstOfMonth = $now->copy()->startOfMonth();
        $lastOfMonth  = $now->copy()->endOfMonth();

        // Ambil semua Sampel (status_sampel != 'NonEligible')
        $daftarSampel = Sampel::with(['tim.pml.user', 'pcl.user', 'kecamatan', 'pengecekan', 'pengecekan.hasilUbinan'])
            ->get()
            ->filter(function ($s) use ($firstOfMonth, $lastOfMonth) {
                // skip jika pengecekan ada dan status_sampel = NonEligible
                if ($s->pengecekan && $s->pengecekan->status_sampel === 'NonEligible') {
                    return false;
                }
                // skip jika sudah punya hasil di bulan ini
                if ($s->pengecekan
                    && $s->pengecekan->hasilUbinan()
                        ->whereBetween('tanggal_pencacahan', [$firstOfMonth, $lastOfMonth])
                        ->exists()
                ) {
                    return false;
                }
                return true;
            });

        if ($daftarSampel->isEmpty()) {
            Log::info("Tidak ada sampel yang perlu diingatkan pencacahan bulan ini.");
            return;
        }
        Log::info("Ditemukan " . $daftarSampel->count() . " sampel untuk notifikasi bulan ini.");

        // Ambil template untuk BulanSampelPML dan BulanSampelPCL (Email & WhatsApp)
        $templatesPML = TemplateNotifikasi::where('tipe_notifikasi', 'BulanSampelPML')
                            ->whereIn('jenis', ['Email', 'WhatsApp'])
                            ->get();
        $templatesPCL = TemplateNotifikasi::where('tipe_notifikasi', 'BulanSampelPCL')
                            ->whereIn('jenis', ['Email', 'WhatsApp'])
                            ->get();

        //
        // Grouping per PML dan kirim notifikasi BulanSampelPML
        //
        $byPml = $daftarSampel->filter(fn($s) => optional($s->tim->pml)->id)
            ->groupBy(fn($s) => $s->tim->pml->id);

         foreach ($byPml as $pmlId => $groupSampel) {
            $pml    = $groupSampel->first()->tim->pml;
            // Bullet list: mapping langsung pada objek Sampel
            $daftar = $groupSampel->map(fn($s) =>
                "• NKS {$s->nks} – Kecamatan: {$s->kecamatan->nama_kecamatan} Desa: {$s->nama_lok}"
            )->implode("\n");

            // Build replacement dasar
            $repls = [
                '{{daftar_sampel}}' => $daftar,
                '{{nama_bulan}}'    => $now->format('F'),
                '{{tahun}}'         => $now->year,
                '{{link}}'          => config('app.url') . '/sinobi',
            ];

            // Kirim untuk tiap template (Email & WhatsApp)
            foreach ($templatesPML as $template) {
                // Simpan record Notifikasi
                $not = Notifikasi::create([
                    'template_notifikasi_id' => $template->id,
                    'tim_id'                 => $groupSampel->first()->tim_id,
                    'pml_id'                 => $pml->id,
                    'pcl_id'                 => $groupSampel->first()->pcl_id,
                    'email'                  => $pml->user->email ?? '',
                    'no_wa'                  => $pml->no_telepon ?? '',
                    'sampel_id'              => null,
                    'pengecekan_id'          => null,
                    'status'                 => 'Pending',
                    'tanggal_terkirim'       => null,
                ]);

                // Tambahkan target pada replacements
                $replsWithTarget = $repls + [
                    '$PHONE' => $pml->no_telepon ?? '',
                    '$EMAIL' => $pml->user->email ?? '',
                ];

                $sent = $service->sendTemplatedNotification(
                    'BulanSampelPML',
                    strtoupper($template->jenis),
                    $replsWithTarget
                );

                $not->status = $sent ? 'Terkirim' : 'Gagal';
                $not->tanggal_terkirim = $sent ? now() : null;
                $not->save();
            }
        }

        //
        // Grouping per PCL dan kirim notifikasi BulanSampelPCL
        //
        $byPcl = $daftarSampel->filter(fn($s) => optional($s->pcl)->id)
            ->groupBy(fn($s) => $s->pcl->id);

        foreach ($byPcl as $pclId => $groupSampel) {
            $pcl   = $groupSampel->first()->pcl;
            $daftar = $groupSampel->map(fn($s) =>
                "• NKS {$s->nks} – Kecamatan: {$s->kecamatan->nama_kecamatan} Desa: {$s->nama_lok}"
            )->implode("\n");

            $repls = [
                '{{daftar_sampel}}' => $daftar,
                '{{nama_bulan}}'    => $now->format('F'),
                '{{tahun}}'         => $now->year,
                '{{link}}'          => config('app.url') . '/sinobi',
            ];

            foreach ($templatesPCL as $template) {
                $not = Notifikasi::create([
                    'template_notifikasi_id' => $template->id,
                    'tim_id'                 => $groupSampel->first()->tim_id,
                    'pml_id'                 => $groupSampel->first()->tim->pml_id,
                    'pcl_id'                 => $pcl->id,
                    'email'                  => $pcl->user->email ?? '',
                    'no_wa'                  => $pcl->no_telepon ?? '',
                    'sampel_id'              => null,
                    'pengecekan_id'          => null,
                    'status'                 => 'Pending',
                    'tanggal_terkirim'       => null,
                ]);

                $replsWithTarget = $repls + [
                    '$PHONE' => $pcl->no_telepon ?? '',
                    '$EMAIL' => $pcl->user->email ?? '',
                ];

                $sent = $service->sendTemplatedNotification(
                    'BulanSampelPCL',
                    strtoupper($template->jenis),
                    $replsWithTarget
                );

                $not->status = $sent ? 'Terkirim' : 'Gagal';
                $not->tanggal_terkirim = $sent ? now() : null;
                $not->save();
            }
        }

        $this->info("SendMonthlyNotifications selesai: entri Notifikasi bulan ini telah dibuat dan dikirim.");
        Log::info("SendMonthlyNotifications selesai.");
    }
}
