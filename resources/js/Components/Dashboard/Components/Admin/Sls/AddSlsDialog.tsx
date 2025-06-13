import React, { FormEvent, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover'
import { usePage } from '@inertiajs/react'
import { Loader2, ChevronsUpDown, Check } from 'lucide-react'
import { Sls, WithCsrf, PageProps, BlokSensus, BlokSensusOption } from '@/types'

export interface AddSlsDialogProps {
  isOpen: boolean
  onClose: () => void
  blokSensusOptions: BlokSensusOption[]      // ← properti wajib di sini
  onSave: (formData: Sls & WithCsrf) => Promise<void>
}

export const AddSlsDialog: React.FC<AddSlsDialogProps> = ({
  isOpen,
  onClose,
  blokSensusOptions,
  onSave,
}) => {
  const { csrf_token } = usePage<PageProps>().props
  const [namaSls, setNamaSls] = useState('')
  const [blokSearch, setBlokSearch] = useState('')
  const [selectedBs, setSelectedBs] = useState<BlokSensusOption | null>(null)
  const [blokOpen, setBlokOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredBlok = useMemo(() => {
    if (!blokSearch) return blokSensusOptions
    return blokSensusOptions.filter((b) =>
      b.id_bs.toLowerCase().includes(blokSearch.toLowerCase())
    )
  }, [blokSensusOptions, blokSearch])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedBs || !namaSls) return
    setIsLoading(true)
    try {
      await onSave({ id_sls: '', bs_id: selectedBs.id_bs, nama_sls: namaSls, _token: csrf_token })
      setNamaSls('')
      setSelectedBs(null)
      setBlokSearch('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah SLS</DialogTitle>
          <DialogDescription>Masukkan data SLS baru</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="hidden" name="_token" value={csrf_token} />

          {/* Dropdown Blok Sensus */}
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
                  {selectedBs?.id_bs ?? 'Pilih Blok Sensus'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Cari blok sensus..."
                    value={blokSearch}
                    onValueChange={setBlokSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Tidak ada blok sensus.</CommandEmpty>
                    <CommandGroup>
                      {filteredBlok.map((bs) => (
                        <CommandItem
                          key={bs.id_bs}
                          value={bs.id_bs}
                          onPointerDown={(e) => e.preventDefault()}
                          onSelect={(value) => {
                            const sel = blokSensusOptions.find((b) => b.id_bs === value) || null
                            setSelectedBs(sel)
                            setBlokOpen(false)
                          }}
                        >
                          {bs.id_bs}
                          <Check
                            className={`ml-auto ${
                              selectedBs?.id_bs === bs.id_bs ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Input Nama SLS */}
          <div className="space-y-1">
            <Label htmlFor="nama_sls">Nama SLS</Label>
            <Input
              id="nama_sls"
              placeholder="Masukkan nama SLS"
              value={namaSls}
              onChange={(e) => setNamaSls(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isLoading || !selectedBs}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
