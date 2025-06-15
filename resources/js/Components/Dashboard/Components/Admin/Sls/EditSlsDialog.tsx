"use client"

import { useState, useEffect, FormEvent } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { usePage } from '@inertiajs/react'
import { Loader2, ChevronsUpDown, Check } from "lucide-react"
import { Sls, WithCsrf, PageProps, BlokSensus } from '@/types'

interface SlsFormData extends Sls, WithCsrf {
}

interface BlokSensusOption {
  id_bs: string;
  nomor_bs: string;
}
interface EditSlsDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (formData: Partial<Sls>) => Promise<void>
    data: Sls
    blokSensusOptions: BlokSensusOption[] // <-- TERIMA PROPS INI
}

export const EditSlsDialog = ({ isOpen, onClose, onSave, data, blokSensusOptions }: EditSlsDialogProps) => {
    const { csrf_token } = usePage<PageProps>().props

    // form state
    const [namaSls, setNamaSls] = useState(data.nama_sls)
    const [blokOpen, setBlokOpen] = useState(false)
    const [blokSearch, setBlokSearch] = useState("")
    const [selectedBs, setSelectedBs] = useState<BlokSensusOption | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // HAPUS: useEffect untuk fetch data, karena data sudah didapat dari props.
    // useEffect(() => {
    //   axios.get('/dashboard/admin/option/bs-available-list')
    //     .then(res => setBlokList(res.data.bs ?? []))
    //     .catch(console.error)
    // }, [])

    // PERBAIKAN: Gunakan `blokSensusOptions` dari props untuk inisialisasi state.
    useEffect(() => {
        if (isOpen) {
            setNamaSls(data.nama_sls)
            // Cari blok sensus yang saat ini terpilih dari props
            const currentBs = blokSensusOptions.find(b => b.id_bs === data.bs_id) || null
            setSelectedBs(currentBs)
            setBlokSearch("")
        }
    }, [isOpen, data, blokSensusOptions])

    // PERBAIKAN: Filter dari `blokSensusOptions`
    const filteredBlok = blokSearch
        ? blokSensusOptions.filter(b => b.nomor_bs.toLowerCase().includes(blokSearch.toLowerCase()))
        : blokSensusOptions

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!selectedBs || !namaSls) return

        setIsLoading(true)
        try {
            await onSave({
                // Tidak perlu mengirim id_sls dan _token karena onSave sudah menanganinya
                id: data.id, // id dari data yang diedit
                bs_id:    selectedBs.id_bs,
                nama_sls: namaSls,
            })
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit SLS</DialogTitle>
          <DialogDescription>Perbarui data SLS</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input type="hidden" name="_token" value={csrf_token} />

            {/* Blok Sensus */}
            <div className="space-y-1">
                <Label>Blok Sensus</Label>
                <Popover open={blokOpen} onOpenChange={setBlokOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={blokOpen}
                    className="w-full justify-between"
                    type="button"
                    >
                    {selectedBs?.id_bs ?? "Pilih Blok Sensus"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent onOpenAutoFocus={e => e.preventDefault()} className="w-full p-0">
                    <Command>
                    <CommandInput
                        placeholder="Cari blok sensus..."
                        value={blokSearch}
                        onValueChange={setBlokSearch}
                    />
                    <CommandList>
                        <CommandEmpty>Tidak ada blok sensus.</CommandEmpty>
                        <CommandGroup>
                        {filteredBlok.map(bs => (
                            <CommandItem
                                key={bs.id_bs}
                                value={bs.id_bs}
                                onSelect={() => {
                                    setSelectedBs(bs)
                                    setBlokOpen(false)
                                }}
                            >
                            {bs.nomor_bs} ({bs.id_bs})
                            <Check className={`ml-auto ${selectedBs?.id_bs === bs.id_bs ? 'opacity-100' : 'opacity-0'}`} />
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
                </Popover>
            </div>

          {/* Nama SLS */}
          <div className="space-y-1">
            <Label htmlFor="nama_sls">Nama SLS</Label>
            <Input
              id="nama_sls"
              placeholder="Masukkan nama SLS"
              value={namaSls}
              onChange={e => setNamaSls(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !selectedBs || !namaSls}>
              {isLoading
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : "Simpan"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
