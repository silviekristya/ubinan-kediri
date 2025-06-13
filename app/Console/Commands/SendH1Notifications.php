<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pengecekan;
use App\Models\Notifikasi;
use App\Models\TemplateNotifikasi;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendH1Notifications extends Command
{
    protected $signature   = 'notifications:send-h1-notifications';
    protected $description = 'Generate dan kirim notifikasi otomatis H-1 (1 hari sebelum tanggal panen)';

    public function handle(NotificationService $service)
    {
        // Hitung tanggal H-1
        $today  = Carbon::today();
        $h1Date = $today->copy()->addDay();

        Log::info("SendH1Notifications berjalan. Mencari pengecekan dengan tanggal_panen = {$h1Date->toDateString()}");

        // Ambil Pengecekan yang tanggal_panen = H-1
        $pengecekans = Pengecekan::with(['sampel.tim.pml', 'sampel.pcl', 'sampel.kecamatan'])
            ->whereDate('tanggal_panen', $h1Date->toDateString())
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
            $nks           = $sampel->nks ?? '';
            $namaLok       = $sampel->nama_lok ?? '';
            $namaRes       = $pengecekan->nama_responden ?? '';
            $tanggalPanen  = $pengecekan->tanggal_panen
                ? Carbon::parse($pengecekan->tanggal_panen)->format('d-m-Y')
                : '';

            //
            // NOTIFIKASI UNTUK PCL (H-1)
            //
            if ($pcl && $pcl->id) {
                $tipeNotifPCL  = 'H1PencacahanPCL';
                $templatesPCL  = TemplateNotifikasi::where('tipe_notifikasi', $tipeNotifPCL)->get();

                foreach ($templatesPCL as $tmpl) {
                    // Simpan record Notifikasi terlebih dahulu
                    $not = Notifikasi::create([
                        'template_notifikasi_id' => $tmpl->id,
                        'tim_id'         => $tim ? $tim->id : null,
                        'pml_id'         => $pml ? $pml->id : null,
                        'pcl_id'         => $pcl->id,
                        'email' => optional($pcl->user)->email ?: '',
                        'no_wa'          => $pcl->no_telepon ?? null,
                        'sampel_id'      => $sampel->id,
                        'pengecekan_id'  => $pengecekan->id,
                        'status'         => 'Pending',
                        'tanggal_terkirim' => null,
                    ]);

                    // Build array replacement sesuai template H-1 Pencacahan PCL
                    $replacements = [
                        '{{nama_pcl}}'       => $pcl->nama ?? '',
                        '{{tanggal_panen}}'  => $tanggalPanen,
                        '{{nks}}'            => $nks,
                        '{{nama_lok}}'       => $namaLok,
                        '{{nama_responden}}' => $namaRes,
                    ];

                    // Panggil NotificationService untuk mengirim (Email / WhatsApp)
                    $sent = $service->sendTemplatedNotification(
                        $tipeNotifPCL,
                        strtoupper($tmpl->jenis),
                        $replacements + [
                            // agar NotificationService tahu target WA/EMAIL:
                            '$PHONE' => $pcl->no_telepon ?? '',
                            '$EMAIL' => $pcl->email ?? '',
                        ]
                    );

                    // Update status & tanggal_terkirim
                    $not->status = $sent ? 'Terkirim' : 'Gagal';
                    $not->tanggal_terkirim = $sent ? now() : null;
                    $not->save();
                }
            }

            //
            // NOTIFIKASI UNTUK PML (H-1)
            //
            if ($pml && $pml->id) {
                $tipeNotifPML  = 'H1PencacahanPML';
                $templatesPML  = TemplateNotifikasi::where('tipe_notifikasi', $tipeNotifPML)->get();

                foreach ($templatesPML as $tmpl) {
                    $not = Notifikasi::create([
                        'template_notifikasi_id' => $tmpl->id,
                        'tim_id'         => $tim ? $tim->id : null,
                        'pml_id'         => $pml->id,
                        'pcl_id'         => $pcl ? $pcl->id : null,
                        'email' => optional($pml->user)->email ?: '',
                        'no_wa'          => $pml->no_telepon ?? null,
                        'sampel_id'      => $sampel->id,
                        'pengecekan_id'  => $pengecekan->id,
                        'status'         => 'Pending',
                        'tanggal_terkirim' => null,
                    ]);

                    // Build replacement sesuai template H-1 Pencacahan PML
                    $replacements = [
                        '{{nama_pml}}'       => $pml->nama ?? '',
                        '{{tanggal_panen}}'  => $tanggalPanen,
                        '{{nks}}'            => $nks,
                        '{{nama_lok}}'       => $namaLok,
                        '{{nama_responden}}' => $namaRes,
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

        $this->info('SendH1Notifications selesai.');
        return 0;
    }
}
