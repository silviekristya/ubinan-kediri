<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Notifikasi;
use App\Services\NotificationService;
use Carbon\Carbon;

class SendDailyNotifications extends Command
{
    protected $signature = 'notifications:send-daily';
    protected $description = 'Kirimkan semua notifikasi pending setiap pagi jam 07:00';

    public function handle(NotificationService $service)
    {
        $now = Carbon::now();
        // ambil Notifikasi yang status=Pending
        $pending = Notifikasi::where('status','Pending')->get();

        // group by tipe & penerima (pcl_id atau pml_id)
        $grouped = $pending->groupBy(function($n) {
            return "{$n->templateNotifikasi->tipe_notifikasi}_{$n->pcl_id}_{$n->pml_id}";
        });

        foreach ($grouped as $key => $records) {
            $first = $records->first();
            $tipe    = $first->templateNotifikasi->tipe_notifikasi;
            $channel = $first->templateNotifikasi->jenis;

            // buat daftar sampel dinamis
            $lines = $records->map(fn($r) => 
                "• Sampel nks {$r->sampel->nks} – Lokasi Kec. {$r->sampel->kecamatan_id} Desa {$r->sampel->nama_lok}"
            )->toArray();
            $daftar = implode("\n", $lines);

            // build replacements
            $repls = [
                '{{daftar_sampel}}' => $daftar,
                '{{nama_bulan}}'    => $now->format('F'),
                '{{tahun}}'         => $now->year,
                '{{link}}'          => config('app.url').'/sinobi',
            ];

            // kirim via NotificationService
            $sent = $service->sendTemplatedNotification($tipe, strtoupper($channel), $repls);

            // update status & tanggal_terkirim
            $records->each(function($r) use($sent) {
                $r->status = $sent ? 'Terkirim' : 'Gagal';
                $r->tanggal_terkirim = now();
                $r->save();
            });
        }

        $this->info('Daily notifications processed.');
    }
}
