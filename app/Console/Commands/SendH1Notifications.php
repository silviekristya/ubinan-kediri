<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pengecekan;
use App\Models\Notifikasi;
use App\Models\TemplateNotifikasi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendH1Notifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send-h1-notifications';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate notifikasi otomatis H-1 (1 hari sebelum tanggal panen)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
         // Ambil tanggal hari ini
        $today  = Carbon::today();
        $h1Date = $today->copy()->addDay(); // tanggal panen yang 1 hari lagi

        // Log informasi untuk debugging (Hapus jika tidak diperlukan)
        Log::info("SendH1Notifications berjalan. Mencari pengecekan dengan tanggal_panen = {$h1Date->toDateString()}");

        // Query Pengecekan yang tanggal_panen = H-1
        $pengecekans = Pengecekan::with(['sampel.tim.pml', 'sampel.pcl'])
            ->whereDate('tanggal_panen', $h1Date->toDateString())
            ->get();

        foreach ($pengecekans as $pengecekan) {
            $sampel = $pengecekan->sampel;
            if (! $sampel) {
                continue;
            }

            $pcl = $sampel->pcl;                        // Model Mitra (PCL)
            $tim = $sampel->tim;                        // Model Tim (relasi ke pml)
            $pml = $tim ? $tim->pml : null;             // Model Pegawai (PML)

            // NOTIFIKASI UNTUK PCL (H-1)
            if ($pcl && $pcl->id) {
                $tipeNotifPCL = 'H1PencacahanPCL'; // sesuai di template_notifikasi.csv
                $templatesPCL = TemplateNotifikasi::where('tipe_notifikasi', $tipeNotifPCL)->get();

                foreach ($templatesPCL as $tmpl) {
                    Notifikasi::create([
                        'template_notifikasi_id' => $tmpl->getKey(),
                        'tim_id'         => $tim ? $tim->id : null,
                        'pml_id'         => $pml ? $pml->id : null,
                        'pcl_id'         => $pcl->id,
                        'email'          => $pcl->email ?? null,
                        'no_wa'          => $pcl->no_telepon ?? null,
                        'sampel_id'      => $sampel->id,
                        'pengecekan_id'  => $pengecekan->id,
                        'status'         => 'pending',
                        'tanggal_terkirim' => null,
                    ]);
                }
            }

            // NOTIFIKASI UNTUK PML (H-1)
            if ($pml && $pml->id) {
                $tipeNotifPML = 'H1PencacahanPML'; // sesuai di template_notifikasi.csv
                $templatesPML = TemplateNotifikasi::where('tipe_notifikasi', $tipeNotifPML)->get();

                foreach ($templatesPML as $tmpl) {
                    Notifikasi::create([
                        'template_notifikasi_id' => $tmpl->getKey(),
                        'tim_id'         => $tim ? $tim->id : null,
                        'pml_id'         => $pml->id,
                        'pcl_id'         => $pcl ? $pcl->id : null,
                        'email'          => $pml->email ?? null,
                        'no_wa'          => $pml->no_telepon ?? null,
                        'sampel_id'      => $sampel->id,
                        'pengecekan_id'  => $pengecekan->id,
                        'status'         => 'pending',
                        'tanggal_terkirim' => null,
                    ]);
                }
            }
        }

        $this->info('SendH1Notifications selesai.');
        return 0;
    }
}
