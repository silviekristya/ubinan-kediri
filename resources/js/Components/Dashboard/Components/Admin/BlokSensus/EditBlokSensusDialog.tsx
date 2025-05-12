"use client"

import { useState, useEffect, useMemo, FormEvent } from 'react'
import axios from 'axios'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { usePage } from '@inertiajs/react'
import { Loader2, ChevronsUpDown } from 'lucide-react'
import { BlokSensus, WithCsrf, PageProps } from '@/types'

interface EditBlokSensusDialogProps {
  isOpen: boolean
  onClose: () => void
  data: BlokSensus
  onSave: (formData: BlokSensus & WithCsrf) => Promise<void>
}

export const EditBlokSensusDialog = ({ isOpen, onClose, data, onSave }: EditBlokSensusDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props

  // form state
  const [nomorBs, setNomorBs]     = useState(data.nomor_bs)
  const [kelList, setKelList]     = useState<{ id: string; text: string }[]>([])
  const [kelSel, setKelSel]       = useState<{ id: string; text: string } | null>(null)
  const [kelSearch, setKelSearch] = useState("")
  const [kelOpen, setKelOpen]     = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // fetch kelurahan/desa once
  useEffect(() => {
    axios.get('/dashboard/admin/option/kel-desa-available-list')
      .then(r => setKelList(r.data.kel_desa))
      .catch(console.error)
  }, [])

  // initialize when dialog opens
  useEffect(() => {
    if (isOpen) {
      setNomorBs(data.nomor_bs)
      const found = kelList.find(k => k.id === data.kel_desa_id)
      setKelSel(found || null)
      setKelSearch("")
    }
  }, [isOpen, data, kelList])

  // filtered list
  const filtered = useMemo(() => {
    if (!kelSearch) return kelList
    return kelList.filter(k => k.text.toLowerCase().includes(kelSearch.toLowerCase()))
  }, [kelSearch, kelList])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!kelSel || !nomorBs) return

    setIsLoading(true)
    try {
      await onSave({
        id_bs:       data.id_bs,
        nomor_bs:    nomorBs,
        kel_desa_id: kelSel.id,
        _token:      csrf_token,
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Blok Sensus</DialogTitle>
          <DialogDescription>Perbarui data blok sensus</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input type="hidden" name="_token" value={csrf_token} />

          {/* Nomor Blok */}
          <div className="space-y-1">
            <Label htmlFor="nomorBs">Nomor Blok Sensus</Label>
            <Input
              id="nomorBs"
              placeholder="0001"
              value={nomorBs}
              onChange={e => setNomorBs(e.target.value)}
            />
          </div>

          {/* Kecamatan Combobox */}
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
                  {kelSel?.text ?? "Pilih Kelurahan/Desa"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent onOpenAutoFocus={e => e.preventDefault()} className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Cari kelurahan/desa..."
                    value={kelSearch}
                    onValueChange={setKelSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Tidak ada data.</CommandEmpty>
                    <CommandGroup>
                      {filtered.map(k => (
                        <CommandItem
                          key={k.id}
                          onPointerDown={e => { e.preventDefault(); e.stopPropagation() }}
                          onSelect={() => { setKelSel(k); setKelOpen(false) }}
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
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
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
