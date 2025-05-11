<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Models\TemplateNotifikasi;
use App\Mail\MailNotify;
use App\Models\Sampel;
use App\Models\Pengecekan;
use App\Models\Mitra;
use App\Models\Pegawai;
use App\Models\Tim;

class NotificationService
{
    /**
     * Kirim notifikasi berdasarkan template.
     *
     * @param  string  $tipeNotifikasi  e.g. 'PengumumanSampelPML'
     * @param  string  $channel         'WHATSAPP' or 'EMAIL'
     * @param  array   $replacements    placeholder array ['$KEY'=>value]
     */
    public function sendTemplatedNotification(string $tipeNotifikasi, string $channel, array $replacements)
    {
        $tpl = TemplateNotifikasi::with('templatePesan')
            ->where('tipe_notifikasi', $tipeNotifikasi)
            ->where('jenis', $channel)
            ->first();

        if (! $tpl) {
            Log::error("TemplateNotifikasi not found: {$tipeNotifikasi} / {$channel}");
            return false;
        }

        $body = str_replace(
            array_keys($replacements),
            array_values($replacements),
            $tpl->templatePesan->text
        );

        if ($channel === 'WHATSAPP') {
            $target = $replacements['$PHONE'] ?? $replacements['$no_wa'] ?? null;
            if (! $target) {
                Log::error('WhatsApp target not set in replacements');
                return false;
            }
            return $this->sendFonnteNotification($target, $body);
        }

        if ($channel === 'EMAIL') {
            $to = $replacements['$EMAIL'] ?? null;
            if (! $to) {
                Log::error('Email not set in replacements');
                return false;
            }
            Mail::to($to)->send(new MailNotify($to, $body));
            return true;
        }

        return false;
    }

    /**
     * Kirim pesan WhatsApp via Fonnte API (single message)
     */
    protected function sendFonnteNotification(string $target, string $message)
    {
        $apiKey = env('FONNTE_API_KEY');
        if (! $apiKey) {
            Log::error('FONNTE_API_KEY not set in .env');
            return false;
        }

        try {
            $res = Http::withHeaders([
                    'Authorization' => $apiKey,
                ])
                ->asForm()
                ->post('https://api.fonnte.com/send', [
                    'target'      => $target,
                    'message'     => $message,
                    'countryCode' => '62',
                ]);

            if ($res->successful()) {
                return $res->body();
            }

            Log::error('Fonnte API error', [
                'status'   => $res->status(),
                'response' => $res->body(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Exception sending Fonnte', [
                'message' => $e->getMessage(),
            ]);
        }

        return false;
    }

    /**
     * Build replacements from Sampel
     */
    protected function buildSampelReplacements(int $id): array
    {
        $s = Sampel::find($id);
        if (! $s) return [];

        return [
            '$ID_SAMPEL'              => $s->id,
            '$JENIS_SAMPEL'           => $s->jenis_sampel,
            '$JENIS_TANAMAN'          => $s->jenis_tanaman,
            '$FRAME_KSA'              => $s->frame_ksa,
            '$PROV'                   => $s->prov,
            '$KAB'                    => $s->kab,
            '$KEC'                    => $s->kec,
            '$NAMA_PROV'              => $s->nama_prov,
            '$NAMA_KAB'               => $s->nama_kab,
            '$NAMA_KEC'               => $s->nama_kec,
            '$NAMA_LOK'               => $s->nama_lok,
            '$SEGMENT_ID'             => $s->segmen_id,
            '$SUBSEGMEN'              => $s->subsegmen,
            '$STRATA'                 => $s->strata,
            '$BULAN_LISTING'          => $s->bulan_listing,
            '$TAHUN_LISTING'          => $s->tahun_listing,
            '$FASE_TANAM'             => $s->fase_tanam,
            '$RILIS'                  => Carbon::parse($s->rilis)->format('Y-m-d'),
            '$A_RANDOM'               => $s->a_random,
            '$NKS'                    => $s->nks,
            '$LONG'                   => $s->long,
            '$LAT'                    => $s->lat,
            '$SUBROUND'               => $s->subround,
            '$PCL_ID'                 => $s->pcl_id,
            '$TIM_ID'                 => $s->tim_id,
            '$ID_SLS'                 => $s->id_sls,
            '$NAMA_KRT'               => $s->nama_krt,
            '$PERKIRAAN_MINGGU_PANEN' => $s->perkiraan_minggu_panen,
            '$CREATED_AT'             => Carbon::parse($s->created_at)->format('Y-m-d H:i:s'),
            '$UPDATED_AT'             => Carbon::parse($s->updated_at)->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Build replacements from Pengecekan
     */
    protected function buildPengecekanReplacements(int $id): array
    {
        $p = Pengecekan::find($id);
        if (! $p) return [];

        return [
            '$ID_PENGECEKAN'        => $p->id,
            '$ID_SAMPEL'            => $p->id_sampel,
            '$TANGGAL_PENGECEKAN'   => Carbon::parse($p->tanggal_pengecekan)->format('Y-m-d'),
            '$SUBROUND'             => $p->subround,
            '$NAMA_RESPONDEN'       => $p->nama_responden,
            '$ALAMAT_RESPONDEN'     => $p->alamat_responden,
            '$NO_TELEPON_RESPONDEN' => $p->no_telepon_responden,
            '$TANGGAL_PANEN'        => Carbon::parse($p->tanggal_panen)->format('Y-m-d'),
            '$STATUS_SAMPEL'        => $p->status_sampel,
            '$KETERANGAN'           => $p->keterangan,
            '$ID_SAMPEL_CADANGAN'   => $p->id_sampel_cadangan,
            '$CREATED_AT'           => Carbon::parse($p->created_at)->format('Y-m-d H:i:s'),
            '$UPDATED_AT'           => Carbon::parse($p->updated_at)->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Build replacements from Mitra
     */
    protected function buildMitraReplacements(int $id): array
    {
        $m = Mitra::find($id);
        if (! $m) return [];

        return [
            '$ID_MITRA'   => $m->id,
            '$USER_ID'    => $m->user_id,
            '$NAMA'       => $m->nama,
            '$NO_TELEPON' => $m->no_telepon,
            '$ALAMAT'     => $m->alamat,
            '$TIM_ID'     => $m->tim_id,
            '$CREATED_AT' => Carbon::parse($m->created_at)->format('Y-m-d H:i:s'),
            '$UPDATED_AT' => Carbon::parse($m->updated_at)->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Build replacements from Pegawai
     */
    protected function buildPegawaiReplacements(int $id): array
    {
        $u = Pegawai::find($id);
        if (! $u) return [];

        return [
            '$ID_PEGAWAI' => $u->id,
            '$USER_ID'    => $u->user_id,
            '$NAMA'       => $u->nama,
            '$NO_TELEPON' => $u->no_telepon,
            '$ROLE'       => $u->role,
            '$IS_PML'     => $u->is_pml ? 'YA' : 'TIDAK',
            '$CREATED_AT' => Carbon::parse($u->created_at)->format('Y-m-d H:i:s'),
            '$UPDATED_AT' => Carbon::parse($u->updated_at)->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Build replacements from Tim
     */
    protected function buildTimReplacements(int $id): array
    {
        $t = Tim::find($id);
        if (! $t) return [];

        return [
            '$ID_TIM'     => $t->id,
            '$NAMA_TIM'   => $t->nama_tim,
            '$PML_ID'     => $t->pml_id,
            '$CREATED_AT' => Carbon::parse($t->created_at)->format('Y-m-d H:i:s'),
            '$UPDATED_AT' => Carbon::parse($t->updated_at)->format('Y-m-d H:i:s'),
        ];
    }
}
