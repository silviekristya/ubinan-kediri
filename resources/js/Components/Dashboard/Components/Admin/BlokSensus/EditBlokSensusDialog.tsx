import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { BlokSensus, WithCsrf, PageProps } from '@/types';
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from '@/Components/ui/badge';

interface BlokSensusFormData extends BlokSensus, WithCsrf {}

interface EditBlokSensusDialogProps { 
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: BlokSensusFormData) => Promise<void>;
    data: BlokSensus;
}

export const EditBlokSensusDialog = ({ isOpen, onClose, onSave, data }: EditBlokSensusDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props;

    const [nomorBs, setNomorBs] = useState(data.nomor_bs);

    const { processing, errors } = useForm<BlokSensusFormData>({
        ...data,
        _token: csrf_token,
    });

    useEffect(() => {
        if (isOpen) {
            setNomorBs(data.nomor_bs);
        }
    }, [isOpen, data]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await onSave({
                id: data.id,
                nomor_bs: nomorBs,
                _token: csrf_token,
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Blok Sensus</DialogTitle>
                    <DialogDescription>Masukkan nomor blok sensus yang baru</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <Input type="hidden" name="_token" value={csrf_token} />
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="nomorBs">Nomor Blok Sensus</Label>
                        <Input
                            type="text"
                            name="nomor_bs"
                            placeholder="Masukkan nomor blok sensus"
                            id="nomorBs"
                            value={nomorBs}
                            onChange={(e) => setNomorBs(e.target.value)}
                        />
                        {errors.nomor_bs && <p className="text-red-500 text-sm">{errors.nomor_bs}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-4">
                        <Button type="submit" variant="outline" onClick={onClose}>
                            Batal   
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}