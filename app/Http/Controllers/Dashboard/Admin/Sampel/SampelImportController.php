<?php
namespace App\Http\Controllers\Dashboard\Admin\Sampel;

use App\Http\Controllers\Controller;
use App\Imports\SampelImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class SampelImportController extends Controller
{
    public function v1(Request $request)
    {
        // Validasi file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        if (! $request->hasFile('file')) {
            return back()->withErrors(['file' => 'File tidak ditemukan']);
        }

        $path = $request->file('file')->getRealPath();
        Log::info("[SampelImport] Mulai import dari: {$path}");

        $import = new SampelImport();
        try {
            Excel::import($import, $path);
            Log::info('[SampelImport] Import selesai');
            $warnings = $import->getWarnings();
            // dd($warnings); // Debugging: tampilkan isi warnings
            if (! empty($warnings)) {
                $list = implode('<br>', $warnings); // Biar baris per baris
                $message = "Beberapa baris gagal diimpor:<br>{$list}<br>Baris tersebut dilewati.";
                Log::warning("[SampelImport] Ditemukan warning:\n{$message}");
                return redirect()
                    ->route('dashboard.admin.sampel.index')
                    ->with('error', $message); // gunakan .with('error', ...) untuk munculkan error
            }
            return redirect()
                ->route('dashboard.admin.sampel.index')
                ->with('success','Data sampel berhasil diimpor');
        }
        catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = collect($e->failures())->map(fn($f) =>
                "Baris {$f->row()}: kolom “{$f->attribute()}” — {$f->errors()[0]}"
            )->implode('<br>');
            Log::warning("[SampelImport] Beberapa baris gagal: {$failures}");
            return back()->with('error',"Import selesai dengan peringatan:<br>{$failures}");
        }
        catch (\Exception $e) {
            Log::error("[SampelImport] Error saat import: {$e->getMessage()}");
            return back()->with('error','Import gagal: '.$e->getMessage());
        }
    }
}
