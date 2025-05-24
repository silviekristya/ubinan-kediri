"use client"

import { useState, useEffect, useMemo, FormEvent } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { usePage } from '@inertiajs/react'
import { Loader2, ChevronsUpDown } from "lucide-react"
import { BlokSensus, WithCsrf, PageProps } from '@/types'

interface AddBlokSensusDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: BlokSensus & WithCsrf) => Promise<void>
}

export const AddBlokSensusDialog = ({ isOpen, onClose, onSave }: AddBlokSensusDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props

  // form state
  const [nomorBs, setNomorBs] = useState("")
  const [kelDesaSel, setKelDesaSel] = useState<{ id: string; text: string } | null>(null)
  const [idBs, setIdBs] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // kelurahan/desa combobox
  const [kelOpen, setKelOpen] = useState(false)
  const [kelSearch, setKelSearch] = useState("")
  const [kelList, setKelList] = useState<{ id: string; text: string }[]>([])

  // fetch kelurahan/desa list
  useEffect(() => {
    axios.get('/dashboard/admin/option/kel-desa-available-list')
      .then(res => setKelList(res.data.kel_desa))
      .catch(console.error)
  }, [])

  // compute id_bs when kelSel or nomorBs changes
  useEffect(() => {
    if (kelDesaSel && nomorBs) {
      setIdBs(`${kelDesaSel.id}${nomorBs}`)
    } else {
      setIdBs("")
    }
  }, [kelDesaSel, nomorBs])

  // filter kelList
  const filtered = useMemo(() => {
    if (!kelSearch) return kelList
    return kelList.filter(k => k.text.toLowerCase().includes(kelSearch.toLowerCase()))
  }, [kelSearch, kelList])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!kelDesaSel || !nomorBs) return

    setIsLoading(true)
    try {
      await onSave({
        id_bs:       idBs,
        nomor_bs:    nomorBs,
        kel_desa_id: kelDesaSel.id,
        _token:      csrf_token,
      })
      // reset form
      setNomorBs("")
      setKelDesaSel(null)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Blok Sensus</DialogTitle>
          <DialogDescription>Masukkan data blok sensus baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input type="hidden" name="_token" value={csrf_token} />

          {/* Blok Sensus */}
          <div className="space-y-1">
            <Label htmlFor="nomorBs">Blok Sensus</Label>
            <Input
              id="nomorBs"
              placeholder="Contoh: 0001"
              value={nomorBs}
              onChange={e => setNomorBs(e.target.value)}
            />
          </div>

          {/* Kelurahan / Desa Combobox */}
          <div className="space-y-1">
            <Label>Kelurahan / Desa</Label>
            <Popover open={kelOpen} onOpenChange={setKelOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={kelOpen}
                  className="w-full justify-between"
                  type="button"
                >
                  {kelDesaSel?.text ?? "Pilih Kelurahan/Desa"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent onOpenAutoFocus={e => e.preventDefault()} className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari kelurahan/desa..." value={kelSearch} onValueChange={setKelSearch} />
                  <CommandList>
                    <CommandEmpty>Tidak ada data.</CommandEmpty>
                    <CommandGroup>
                      {filtered.map(k => (
                        <CommandItem
                          key={k.id}
                          onPointerDown={e => { e.preventDefault(); e.stopPropagation(); }}
                          onSelect={() => { setKelDesaSel(k); setKelOpen(false); }}
                          value={k.text}
                        >
                          {k.text}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isLoading || !idBs}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
