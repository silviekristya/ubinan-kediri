<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pengecekan;
use App\Models\Notifikasi;
use App\Models\TemplateNotifikasi;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendH3Notifications extends Command
{
    protected $signature   = 'notifications:send-h3-notifications';
    protected $description = 'Generate dan kirim notifikasi otomatis H-3 (3 hari sebelum tanggal panen)';

    public function handle(NotificationService $service)
    {
        // Hitung tanggal H-3
        $today  = Carbon::today();
        $h3Date = $today->copy()->addDays(3);

        Log::info("SendH3Notifications berjalan. Mencari pengecekan dengan tanggal_panen = {$h3Date->toDateString()}");

        // Ambil Pengecekan tanggal_panen = H-3
        $pengecekans = Pengecekan::with(['sampel.tim.pml', 'sampel.pcl'])
            ->whereDate('tanggal_panen', $h3Date->toDateString())
            ->get();

        foreach ($pengecekans as $pengecekan) {
            $sampel = $pengecekan->sampel;
            if (! $sampel) {
                continue;
            }

            $pcl = $sampel->pcl;        
            $tim = $sampel->tim;        
            $pml = $tim ? $tim->pml : null;

            // Data dasar untuk replacement
            $nks          = $sampel->nks ?? '';
            $namaLok      = $sampel->nama_lok ?? '';
            $tanggalPanen = $pengecekan->tanggal_panen
                ? Carbon::parse($pengecekan->tanggal_panen)->format('d-m-Y')
                : '';

            //
            //  NOTIFIKASI UNTUK PCL (H-3)
            //
            if ($pcl && $pcl->id) {
                $tipeNotifPCL = 'H3PencacahanPCL';
                $templatesPCL = TemplateNotifikasi::where('tipe_notifikasi', $tipeNotifPCL)->get();

                foreach ($templatesPCL as $tmpl) {
                    $not = Notifikasi::create([
                        'template_notifikasi_id' => $tmpl->id,
                        'tim_id'         => $tim ? $tim->id : null,
                        'pml_id'         => $pml ? $pml->id : null,
                        'pcl_id'         => $pcl->id,
                        'email'          => optional($pcl->user)->email ?: '',
                        'no_wa'          => $pcl->no_telepon ?? null,
                        'sampel_id'      => $sampel->id,
                        'pengecekan_id'  => $pengecekan->id,
                        'status'         => 'Pending',
                        'tanggal_terkirim' => null,
                    ]);

                    // Build replacement sesuai template H-3 Pencacahan PCL
                    $replacements = [
                        '{{nama_pcl}}'      => $pcl->nama ?? '',
                        '{{nks}}'           => $nks,
                        '{{nama_lok}}'      => $namaLok,
                        '{{tanggal_panen}}' => $tanggalPanen,
                        '{{nama_pml}}'      => $pml->nama ?? '',
                    ];

                    $sent = $service->sendTemplatedNotification(
                        $tipeNotifPCL,
                        strtoupper($tmpl->jenis),
                        $replacements + [
                            '$PHONE' => $pcl->no_telepon ?? '',
                            '$EMAIL' => $pcl->email ?? '',
                        ]
                    );

                    $not->status = $sent ? 'Terkirim' : 'Gagal';
                    $not->tanggal_terkirim = $sent ? now() : null;
                    $not->save();
                }
            }

            //
            // NOTIFIKASI UNTUK PML (H-3)
            //
            if ($pml && $pml->id) {
                $tipeNotifPML = 'H3PencacahanPML';
                $templatesPML = TemplateNotifikasi::where('tipe_notifikasi', $tipeNotifPML)->get();

                foreach ($templatesPML as $tmpl) {
                    $not = Notifikasi::create([
                        'template_notifikasi_id' => $tmpl->id,
                        'tim_id'         => $tim ? $tim->id : null,
                        'pml_id'         => $pml->id,
                        'pcl_id'         => $pcl ? $pcl->id : null,
                        'email'         => optional($pml->user)->email ?: '',
                        'no_wa'          => $pml->no_telepon ?? null,
                        'sampel_id'      => $sampel->id,
                        'pengecekan_id'  => $pengecekan->id,
                        'status'         => 'Pending',
                        'tanggal_terkirim' => null,
                    ]);

                    // Build replacement sesuai template H-3 Pencacahan PML
                    $replacements = [
                        '{{nama_pml}}'      => $pml->nama ?? '',
                        '{{nks}}'           => $nks,
                        '{{nama_lok}}'      => $namaLok,
                        '{{tanggal_panen}}' => $tanggalPanen,
                        '{{nama_pcl}}'      => $pcl->nama ?? '',
                    ];

                    $sent = $service->sendTemplatedNotification(
                        $tipeNotifPML,
                        strtoupper($tmpl->jenis),
                        $replacements + [
                            '$PHONE' => $pml->no_telepon ?? '',
                            '$EMAIL' => $pml->email ?? '',
                        ]
                    );

                    $not->status = $sent ? 'Terkirim' : 'Gagal';
                    $not->tanggal_terkirim = $sent ? now() : null;
                    $not->save();
                }
            }
        }

        $this->info('SendH3Notifications selesai.');
        return 0;
    }
}
