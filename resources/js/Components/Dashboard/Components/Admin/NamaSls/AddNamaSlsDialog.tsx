import { useState, FormEventHandler, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { ALargeSmall, AlarmCheck, Loader2 } from "lucide-react";
import { Sls, WithCsrf, PageProps, BlokSensus } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface NamaSlsFormData extends Omit<Sls, 'id' | 'id_bs'>, WithCsrf {
    id_bs: string;
}

interface AddNamaSlsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: NamaSlsFormData) => Promise<void>;
        blok_sensus: BlokSensus[];
}

export const AddNamaSlsDialog = ({ isOpen, onClose, onSave, blok_sensus = [] }: AddNamaSlsDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props;

    const [namaSls, setNamaSls] = useState("");
    const [open, setOpen] = useState(false);
    const [idBs, setIdBs] = useState("");

    const { processing, errors } = useForm<NamaSlsFormData>({
        nama_sls: "",
        id_bs: "",
        _token: csrf_token,
    });

    const handleSubmit: FormEventHandler = async (e) => {  
        e.preventDefault();

        try {
            await onSave({
                nama_sls: namaSls,
                id_bs: idBs,
                _token: csrf_token,
            });

            // Reset form setelah berhasil
            onClose();
            setNamaSls("");
            setIdBs("");
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Nama SLS</DialogTitle>
                    <DialogDescription>Masukkan data Nama SLS baru</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input type="hidden" name="_token" value={csrf_token} />

                    {/* Blok Sensus */}{/* Blok Sensus Selection */}
                    <div className="flex flex-col space-y-2">   
                        <Label htmlFor="id_bs">Blok Sensus</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className='w-full justify-between'
                                >
                                    {blok_sensus?.find(bs => String(bs.id) === idBs)?.nomor_bs || 'Pilih Blok Sensus'}
                                    <ChevronsUpDown className='opacity-50'/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Command>
                                    <CommandInput
                                        placeholder="Cari Blok Sensus"
                                    />
                                    <CommandList>
                                        <CommandEmpty>Tidak ada blok sensus ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {blok_sensus.map((bs) => (
                                                <CommandItem 
                                                key={String(bs.id)} 
                                                value={String(bs.id)}
                                                onSelect={() => {
                                                    setIdBs(String(bs.id));
                                                    setOpen(false);
                                                }}>
                                                    {bs.nomor_bs}
                                                    <Check className={`ml-auto ${idBs === String(bs.id)? 'opacity-100' : 'opacity-0'}`} />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Nama SLS */}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="nama_sls">Nama SLS</Label>
                        <Input
                            id="nama_sls"
                            name="nama_sls"
                            placeholder="Masukkan nama SLS"
                            value={namaSls}
                            onChange={(e) => setNamaSls(e.target.value)}
                        />
                    </div>

                   {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                        Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
                        </Button>
                    </div>
                </form>
                    
            </DialogContent>
        </Dialog>
    );
}