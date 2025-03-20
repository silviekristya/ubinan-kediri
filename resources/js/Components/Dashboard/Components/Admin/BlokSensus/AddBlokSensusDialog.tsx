import { useState, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { BlokSensus, WithCsrf, PageProps} from '@/types';

interface BlokSensusFormData extends Omit<BlokSensus, 'id'>, WithCsrf {
    nomor_bs: string;
}

interface AddBlokSensusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: BlokSensusFormData) => Promise<void>;
}

export const AddBlokSensusDialog = ({ isOpen, onClose, onSave }: AddBlokSensusDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props;

    const [nomorBs, setNomorBs] = useState("");

    const { processing, errors } = useForm<BlokSensusFormData>({
        nomor_bs: "",
        _token: csrf_token,
    });

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await onSave({
                nomor_bs: nomorBs,
                _token: csrf_token,
            });

            onClose();
            setNomorBs("");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Blok Sensus</DialogTitle>
                    <DialogDescription>Masukkan nomor blok sensus yang baru</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <Input type="hidden" name="_token" value={csrf_token} />

                    {/* Nomor Blok Sensus */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="nomorBs">Nomor Blok Sensus</Label>
                            <Input
                                id="nomorBs"
                                name="nomorBs"
                                placeholder="Masukkan nomor blok sensus"
                                value={nomorBs}
                                onChange={(e) => setNomorBs(e.target.value)}
                            />
                        </div>
                   
                    {/* Tombol Aksi */}
                    <div className="flex justify-end space-x-4">
                        <Button type="submit" variant="outline" onClick={onClose}>
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
};
