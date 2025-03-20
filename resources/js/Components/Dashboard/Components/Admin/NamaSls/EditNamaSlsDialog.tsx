import { useState, useEffect, FormEventHandler } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { usePage, useForm } from '@inertiajs/react';
import { Loader2 } from "lucide-react";
import { NamaSls, WithCsrf, PageProps } from '@/types';
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Badge } from '@/Components/ui/badge';

interface NamaSlsFormData extends NamaSls, WithCsrf {}

interface EditNamaSlsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formData: NamaSlsFormData) => Promise<void>;
    data: NamaSls;
}

export const EditNamaSlsDialog = ({ isOpen, onClose, onSave, data }: EditNamaSlsDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props;
    
    const [namaSls, setNamaSls] = useState(data.nama_sls);

    const { processing, errors } = useForm<NamaSlsFormData>({
        ...data,
        _token: csrf_token,
    });

    useEffect(() => {
        if (isOpen) {
            setNamaSls(data.nama_sls);
        }
    }, [isOpen, data]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await onSave({
                id: data.id,
                nama_sls: namaSls,
                _token: csrf_token,
                id_bs: data.id_bs,
            });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>Edit Nama SLS</DialogTitle>
            </DialogHeader>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Label>Nama SLS</Label>
                    <Input
                        type="text"
                        name="nama_sls"
                        value={namaSls}
                        onChange={(e) => setNamaSls(e.target.value)}
                    />
                    {errors.nama_sls && <p className="text-red-500">{errors.nama_sls}</p>}
                    <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 className="animate-spin" /> : "Simpan"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}