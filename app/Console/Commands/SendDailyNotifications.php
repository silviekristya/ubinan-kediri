<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notifikasi;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendDailyNotifications extends Command
{
    protected $signature   = 'notifications:send-daily';
    protected $description = 'Kirimkan Pengumuman Alokasi Sampel (PML & PCL) setiap pagi jam 07:00';

    public function handle(NotificationService $service)
    {
        $now = Carbon::now();

        // Ambil hanya notifikasi “PengumumanSampelPML” & “PengumumanSampelPCL”
        $pending = Notifikasi::with([
                'templateNotifikasi.templatePesan',
                'sampel',
                'sampel.tim.pml',  // untuk nama_pml di PCL
                'sampel.kecamatan',          // untuk nama_kec & daftar_sampel
                'sampel.pcl',    // untuk nama_pcl
            ])
            ->where('status', 'Pending')
            ->whereHas('templateNotifikasi', function($q) {
                $q->whereIn('tipe_notifikasi', [
                    'PengumumanSampelPCL',
                    'PengumumanSampelPML',
                ]);
            })
            ->get();

        Log::info("DEBUG: ada {$pending->count()} notifikasi Pengumuman Alokasi Sampel pending.");

        // Grouping per penerima unik (tipe + pcl_id + pml_id)
         $grouped = $pending->groupBy(function($n) {
        return "{$n->templateNotifikasi->tipe_notifikasi}"
             ."_{$n->templateNotifikasi->jenis}"
             ."_{$n->pcl_id}"
             ."_{$n->pml_id}";
    });

        foreach ($grouped as $key => $records) {
            $first = $records->first();
            $tipe  = $first->templateNotifikasi->tipe_notifikasi; // PCL atau PML
            $channel = strtoupper($first->templateNotifikasi->jenis);

            // Siapkan daftar sampel (bullet list)
            $lines = $records->map(function($r) {
                $s = $r->sampel;
                return "• NKS {$s->nks} – Kecamatan: {$s->kecamatan->nama_kecamatan} Desa: {$s->nama_lok}";
            })->toArray();
            $daftarSampel = implode("\n", $lines);

            // Unique kecamatan + jumlah sampel + jumlah PCL (untuk PML)
            $kecList       = $records->pluck('sampel.kecamatan.nama_kecamatan')->unique()->implode(', ');
            $jumlahSampel  = $records->count();
            $jumlahPcl     = $records->pluck('sampel.pcl_id')->filter()->unique()->count();

            // Build replacements sesuai template baru
            if ($tipe === 'PengumumanSampelPCL') {
                $repls = [
                    '{{nama_pcl}}'      => $first->sampel->pcl->nama ?? '',               // nama PCL
                    '{{nama_kec}}'      => $kecList,
                    '{{jumlah_sampel}}' => $jumlahSampel,
                    '{{nama_pml}}'      => $first->sampel->tim->pml->nama ?? '',    // nama PML pendamping
                    '{{daftar_sampel}}' => $daftarSampel,
                    '{{link}}'          => config('app.url') . '/sinobi',
                ];
                // **target** WA/Email PCL
                $toPhone = optional($first->sampel->pcl)->no_telepon ?: '';
                $toEmail = optional($first->sampel->pcl->user)->email    ?: '';
            } else {
                // PengumumanSampelPML
                $repls = [
                    '{{nama_pml}}'      => $first->sampel->tim->pml->nama ?? '',   // nama PML
                    '{{nama_kec}}'      => $kecList,
                    '{{jumlah_sampel}}' => $jumlahSampel,
                    '{{jumlah_pcl}}'    => $jumlahPcl,
                    '{{daftar_sampel}}' => $daftarSampel,
                    '{{link}}'          => config('app.url') . '/sinobi',
                ];
                // **target** WA/Email PML
                $toPhone = optional($first->sampel->tim->pml)->no_telepon ?: '';
                $toEmail = optional($first->sampel->tim->pml->user)->email    ?: '';
            }

            Log::info("DEBUG: Kirim $tipe via $channel → WA:$toPhone / Email:$toEmail, repls=".json_encode($repls));

            // Panggil service
            $sent = $service->sendTemplatedNotification(
                $tipe,
                $channel,
                $repls + [
                    '$PHONE' => $toPhone,
                    '$EMAIL' => $toEmail,
                ]
            );

            // Update status untuk semua record di grup
            $records->each(function($r) use ($sent) {
                $r->status           = $sent ? 'Terkirim' : 'Gagal';
                $r->tanggal_terkirim = $sent ? now() : null;
                $r->save();
            });
        }

        $this->info('SendDailyNotifications selesai.');
    }
}
