import { useState, FormEventHandler, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { Tim, WithCsrf, PageProps, Pegawai, Mitra } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { Button } from '@/Components/ui/button';

interface TimFormData extends WithCsrf {
    nama_tim: string;
    pml_id: number;
    ppl_ids: number[];
}

interface AddTimDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: TimFormData) => Promise<void>;
    pegawai?: Pegawai[];
    mitra?: Mitra[];
}

export const AddTimDialog = ({ isOpen, onClose, onSave, pegawai = [], mitra = [] }: AddTimDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props;

    const [namaTim, setNamaTim] = useState("");
    const [pmlId, setPmlId] = useState<number | null>(null);
    const [pplSelections, setPplSelections] = useState<number[]>([]);
    const [openPml, setOpenPml] = useState(false);

    useEffect(() => {
        console.log("Pegawai:", pegawai);
        console.log("Mitra:", mitra);
    }, [pegawai, mitra]);

    const { processing, errors } = useForm<TimFormData>({
        nama_tim: "",
        pml_id: 0,
        ppl_ids: [],
        _token: csrf_token,
    });

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!namaTim || !pmlId || pplSelections.length === 0) {
            console.error("Semua kolom wajib diisi.");
            return;
        }
        try {
            await onSave({
                nama_tim: namaTim,
                pml_id: Number(pmlId),
                ppl_ids: pplSelections.map(id => Number(id)),
                _token: csrf_token,
            });

            onClose();
            setNamaTim("");
            setPmlId(null);
            setPplSelections([]);
        } catch (error) {
            console.error(error);
        }
    };

    // Tambah PPL
    const handleAddPpl = () => {
        setPplSelections([...pplSelections, 0]);
    };

    // Hapus PPL
    const handleRemovePpl = (index: number) => {
        const updatedPpl = [...pplSelections];
        updatedPpl.splice(index, 1); // Hapus item pada index tertentu
        setPplSelections(updatedPpl);
    };

    // Update PPL yang dipilih
    const handlePplChange = (index: number, id: number) => {
        const updatedPpl = [...pplSelections];
        updatedPpl[index] = id;
        setPplSelections(updatedPpl);
    };

    // Filter PPL yang belum dipilih
    const getAvailableMitra = (selectedIds: number[]) => {
        return mitra.filter((m) => !selectedIds.includes(m.id)); // Hapus yang sudah dipilih
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Tim Baru</DialogTitle>
                    <DialogDescription>Masukkan data tim baru</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input type="hidden" name="_token" value={csrf_token} />

                    {/* Nama Tim */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="namaTim">Nama Tim</Label>
                        <Input
                            id="namaTim"
                            name="namaTim"
                            placeholder="Masukkan nama tim"
                            value={namaTim}
                            onChange={(e) => setNamaTim(e.target.value)}
                        />
                        {errors.nama_tim && <p className="text-red-500 text-sm">{errors.nama_tim}</p>}
                    </div>

                    {/* PML Selection */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="pml">PML</Label>
                        <Popover open={openPml} onOpenChange={setOpenPml}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openPml}
                                    className="w-full justify-between"
                                >
                                    {pegawai.find((p) => p.id === pmlId)?.nama || "Pilih PML"}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Cari PML..." />
                                    <CommandList>
                                        <CommandEmpty>Tidak ada PML ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {pegawai.map((p) => (
                                                <CommandItem
                                                    key={p.id}
                                                    value={String(p.id)}
                                                    onSelect={() => {
                                                        setPmlId(p.id);
                                                        setOpenPml(false);
                                                    }}
                                                >
                                                    {p.nama}
                                                    <Check className={`ml-auto ${pmlId === p.id ? 'opacity-100' : 'opacity-0'}`} />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* PPL Selection */}
                    <div className="flex flex-col space-y-2">
                        <Label>PPL</Label>
                        <div className='max-h-[400px] overflow-y-auto space-y-2'>
                        {pplSelections.map((pplId, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {mitra.find((m) => m.id === pplId)?.nama || "Pilih PPL"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari PPL..." />
                                            <CommandList>
                                                <CommandEmpty>Tidak ada PPL ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    {getAvailableMitra(pplSelections).map((m) => (
                                                        <CommandItem
                                                            key={m.id}
                                                            value={String(m.id)}
                                                            onSelect={() => handlePplChange(index, m.id)}
                                                        >
                                                            {m.nama}
                                                            <Check className={`ml-auto ${pplId === m.id ? 'opacity-100' : 'opacity-0'}`} />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Button variant="destructive" size="icon" onClick={() => handleRemovePpl(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Tambah PPL */}
                    <Button type="button" onClick={handleAddPpl} className="mt-2 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Tambah PPL
                    </Button>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
