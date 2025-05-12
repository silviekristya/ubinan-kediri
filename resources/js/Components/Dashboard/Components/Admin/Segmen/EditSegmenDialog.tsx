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
import { Segmen, WithCsrf, PageProps } from '@/types'

interface EditSegmenDialogProps {
  isOpen: boolean
  onClose: () => void
  segmen: Segmen
  onSave: (formData: Segmen & WithCsrf) => Promise<void>
}

export const EditSegmenDialog = ({ isOpen, onClose, segmen, onSave }: EditSegmenDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props

  // form state
  const [kodeSegmen, setKodeSegmen] = useState(segmen.kode_segmen || "")
  const [namaSegmen, setNamaSegmen] = useState(segmen.nama_segmen || "")
  const [idSegmen, setIdSegmen]     = useState(segmen.id_segmen)

  // combobox kecamatan
  const [kecOpen, setKecOpen]     = useState(false)
  const [kecSearch, setKecSearch] = useState("")
  const [kecList, setKecList]     = useState<{ id: string; text: string }[]>([])
  const [kecSel, setKecSel]       = useState<{ id: string; text: string } | null>(null)

  // loading state
  const [isLoading, setIsLoading] = useState(false)

  // fetch kecamatan list
  useEffect(() => {
    axios.get("/dashboard/admin/option/kecamatan-available-list")
      .then(r => setKecList(r.data.kecamatan))
      .catch(console.error)
  }, [])

  // set initial kecSel when list loaded or segmen changes
  useEffect(() => {
    if (kecList.length > 0) {
      const found = kecList.find(k => k.id === segmen.kecamatan_id)
      if (found) setKecSel(found)
    }
  }, [kecList, segmen.kecamatan_id])

  // update idSegmen when kecSel or kodeSegmen changes
  useEffect(() => {
    if (kecSel && kodeSegmen) {
      const kabId   = kecSel.id.slice(0,4)
      const kecCode = kecSel.id.slice(4,7)
      setIdSegmen(`${kabId}${kecCode}${kodeSegmen}`)
    }
  }, [kecSel, kodeSegmen])

  // filter kecList
  const filtered = useMemo(() => {
    if (!kecSearch) return kecList
    return kecList.filter(k =>
      k.text.toLowerCase().includes(kecSearch.toLowerCase())
    )
  }, [kecSearch, kecList])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!kecSel || !kodeSegmen || !namaSegmen) return

    setIsLoading(true)
    try {
      await onSave({
        id_segmen:    idSegmen,
        kode_segmen:  kodeSegmen,
        nama_segmen:  namaSegmen,
        kecamatan_id: kecSel.id,
        _token:       csrf_token,
      })
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
          <DialogTitle>Edit Segmen</DialogTitle>
          <DialogDescription>Perbarui data segmen</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input type="hidden" name="_token" value={csrf_token} />

          {/* Kode Segmen */}
          <div className="space-y-1">
            <Label htmlFor="kodeSegmen">Kode Segmen</Label>
            <Input
              id="kodeSegmen"
              placeholder="Contoh: 10"
              value={kodeSegmen}
              onChange={e => setKodeSegmen(e.target.value)}
            />
          </div>

          {/* Nama Segmen */}
          <div className="space-y-1">
            <Label htmlFor="namaSegmen">Nama Segmen</Label>
            <Input
              id="namaSegmen"
              placeholder="Contoh: NGADI"
              value={namaSegmen}
              onChange={e => setNamaSegmen(e.target.value)}
            />
          </div>

          {/* Kecamatan Combobox */}
          <div className="space-y-1">
            <Label>Kecamatan</Label>
            <Popover open={kecOpen} onOpenChange={setKecOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={kecOpen}
                  className="w-full justify-between"
                  type="button"
                >
                  {kecSel?.text ?? "Pilih Kecamatan"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                onOpenAutoFocus={e => e.preventDefault()}
                className="w-full p-0"
              >
                <Command>
                  <CommandInput
                    placeholder="Cari kecamatan..."
                    value={kecSearch}
                    onValueChange={setKecSearch}
                  />
                  <CommandList>
                    <CommandEmpty>Tidak ada kecamatan.</CommandEmpty>
                    <CommandGroup>
                      {filtered.map((k) => (
                        <CommandItem
                          key={k.id}
                          onPointerDown={e => { e.preventDefault(); e.stopPropagation(); }}
                          onSelect={() => { setKecSel(k); setKecOpen(false) }}
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
            <Button type="submit" disabled={isLoading || !idSegmen}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Perbarui"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
