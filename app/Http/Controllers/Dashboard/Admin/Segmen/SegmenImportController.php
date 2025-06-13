<?php
namespace App\Http\Controllers\Dashboard\Admin\Segmen;

use App\Http\Controllers\Controller;
use App\Imports\SegmenImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class SegmenImportController extends Controller
{
    public function v1(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        if (! $request->hasFile('file')) {
            return back()->withErrors(['file' => 'File tidak ditemukan']);
        }

        $path = $request->file('file')->getRealPath();
        Log::info("[SegmenImport] Mulai import dari: {$path}");

        $import = new SegmenImport();
        try {
            Excel::import($import, $path);
            Log::info('[SegmenImport] Import selesai');
            $warnings = $import->getWarnings();
            if (! empty($warnings)) {
                $list = implode('<br>', $warnings);
                $message = "Beberapa baris gagal diimpor:<br>{$list}<br>Baris tersebut dilewati.";
                Log::warning("[SegmenImport] Ditemukan warning:\n{$message}");
                return redirect()
                    ->route('dashboard.admin.segmen.index') // route ke segmen, bukan sampel!
                    ->with('error', $message);
            }
            return redirect()
                ->route('dashboard.admin.segmen.index')
                ->with('success','Data segmen berhasil diimpor');
        }
        catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = collect($e->failures())->map(fn($f) =>
                "Baris {$f->row()}: kolom “{$f->attribute()}” — {$f->errors()[0]}"
            )->implode('<br>');
            Log::warning("[SegmenImport] Beberapa baris gagal: {$failures}");
            return back()->with('error',"Import selesai dengan peringatan:<br>{$failures}");
        }
        catch (\Exception $e) {
            Log::error("[SegmenImport] Error saat import: {$e->getMessage()}");
            return back()->with('error','Import gagal: '.$e->getMessage());
        }
    }
}
