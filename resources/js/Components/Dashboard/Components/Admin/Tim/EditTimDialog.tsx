import { useState, FormEventHandler, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { Tim, WithCsrf, PageProps, Pegawai, Mitra } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Button } from '@/Components/ui/button';

interface TimFormData extends WithCsrf {
    nama_tim: string;
    pml_id: number;
    pcl_ids: number[];
}

interface EditTimDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: TimFormData) => Promise<void>;
    data: Tim;
    pegawai?: Pegawai[];
    mitra?: Mitra[];
}

export const EditTimDialog = ({ isOpen, onClose, onSave, data, pegawai = [], mitra = [] }: EditTimDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props;

    const [namaTim, setNamaTim] = useState(data.nama_tim);
    const [pmlId, setPmlId] = useState<number | null>(data.pml_id);
    const [pclSelections, setPclSelections] = useState<number[]>(
        (data.pcl ?? []).map((p) => p.id)
    );
    const [openPml, setOpenPml] = useState(false);

    const { processing, errors } = useForm<TimFormData>({
        nama_tim: data.nama_tim,
        pml_id: data.pml_id,
        pcl_ids: pclSelections,
        _token: csrf_token,
    });

    // Update nilai saat dialog terbuka
    useEffect(() => {
        if (isOpen) {
            setNamaTim(data.nama_tim);
            setPmlId(data.pml_id || pegawai[0]?.id); // Pilih default PML jika tidak ada

            // Pastikan PCL dipilih otomatis berdasarkan tim_id
            const initialPclSelections = mitra
                .filter((m) => m.tim_id === data.id) // Ambil mitra yang tim_id-nya sesuai
                .map((m) => m.id); // Ambil ID dari mitra

            setPclSelections(initialPclSelections); // Set PCL berdasarkan hasil filter
        }
    }, [isOpen, data, pegawai, mitra]);


    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await onSave({
                nama_tim: namaTim,
                pml_id: Number(pmlId),
                pcl_ids: pclSelections.map((id) => Number(id)),
                _token: csrf_token,
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddPcl = () => {
        // Tambahkan PCL baru (default ke ID pertama yang tersedia atau null)
        setPclSelections([...pclSelections, 0]); // Tambahkan placeholder ID baru (default)
    };

    const handleRemovePcl = (index: number) => {
        const updatedPcl = [...pclSelections];
        updatedPcl.splice(index, 1);
        setPclSelections(updatedPcl);
    };

    const handlePclChange = (index: number, id: number) => {
        const updatedPcl = [...pclSelections];
        updatedPcl[index] = id;
        setPclSelections(updatedPcl);
    };

    const getAvailableMitra = (selectedIds: number[], currentId: number) => {
        // Sertakan currentId dan filter PCL lainnya yang belum dipilih
        return mitra.filter((m) => m.id === currentId || !selectedIds.includes(m.id));
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Tim</DialogTitle>
                    <DialogDescription>Edit data tim</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input type="hidden" name="_token" value={csrf_token} />

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

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="pml">PML</Label>
                        <Popover open={openPml} onOpenChange={setOpenPml}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                    {pegawai.find((p) => p.id == pmlId)?.nama || "Pilih PML"}
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

                    {/* PCL Selection */}
                    <div className="flex flex-col space-y-2">
                        <Label>PCL</Label>
                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {pclSelections.map((pclId, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                {mitra.find((m) => m.id === pclId)?.nama || "Pilih PCL"}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Cari PCL..." />
                                                <CommandList>
                                                    <CommandEmpty>Tidak ada PCL ditemukan.</CommandEmpty>
                                                    <CommandGroup>
                                                        {getAvailableMitra(pclSelections, pclId).map((m) => (
                                                            <CommandItem
                                                                key={m.id}
                                                                value={String(m.id)}
                                                                onSelect={() => handlePclChange(index, m.id)}
                                                            >
                                                                {m.nama}
                                                                <Check
                                                                    className={`ml-auto ${
                                                                        pclId === m.id ? "opacity-100" : "opacity-0"
                                                                    }`}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleRemovePcl(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Tambah PCL */}
                    <Button type="button" onClick={handleAddPcl} className="mt-2 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Tambah PCL
                    </Button>

                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Perbarui"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
