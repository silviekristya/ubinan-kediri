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
    ppl_ids: number[];
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
    const [pplSelections, setPplSelections] = useState<number[]>((data.ppl ?? []).map(p => p.id));
    const [openPml, setOpenPml] = useState(false);

    const { processing, errors } = useForm<TimFormData>({
        nama_tim: data.nama_tim,
        pml_id: data.pml_id,
        ppl_ids: pplSelections,
        _token: csrf_token,
    });

    // Update nilai saat dialog terbuka
    useEffect(() => {
        if (isOpen) {
            setNamaTim(data.nama_tim);
            setPmlId(data.pml_id);
            setPplSelections((data.ppl ?? []).map(p => p.id));
        }
    }, [isOpen, data]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await onSave({
                nama_tim: namaTim,
                pml_id: Number(pmlId),
                ppl_ids: pplSelections.map(id => Number(id)),
                _token: csrf_token,
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddPpl = () => {
        setPplSelections([...pplSelections, 0]);
    };

    const handleRemovePpl = (index: number) => {
        const updatedPpl = [...pplSelections];
        updatedPpl.splice(index, 1);
        setPplSelections(updatedPpl);
    };

    const handlePplChange = (index: number, id: number) => {
        const updatedPpl = [...pplSelections];
        updatedPpl[index] = id;
        setPplSelections(updatedPpl);
    };

    const getAvailableMitra = (selectedIds: number[]) => {
        return mitra.filter((m) => !selectedIds.includes(m.id) || selectedIds.includes(m.id));
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
