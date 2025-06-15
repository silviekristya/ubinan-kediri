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
import { Provinsi, KabKota, Kecamatan, Segmen, WithCsrf, PageProps } from '@/types'

interface EditSegmenDialogProps {
  isOpen: boolean
  onClose: () => void
  segmen: Segmen
  provData: Provinsi[]
  kabKotaData: KabKota[]
  kecData: Kecamatan[]
  onSave: (formData: Segmen & WithCsrf) => Promise<void>
}


export const EditSegmenDialog = ({
  isOpen,
  onClose,
  segmen,
  provData,
  kabKotaData,
  kecData,
  onSave
}: EditSegmenDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props

  // Form state
  const [kodeSegmen, setKodeSegmen] = useState(segmen.kode_segmen || "")
  const [namaSegmen, setNamaSegmen] = useState(segmen.nama_segmen || "")
  const [idSegmen, setIdSegmen] = useState(segmen.id_segmen)

  // Dropdown state
  const [provSel, setProvSel] = useState<Provinsi | null>(null)
  const [kabKotaSel, setKabKotaSel] = useState<KabKota | null>(null)
  const [kecSel, setKecSel] = useState<Kecamatan | null>(null)

  const [provOpen, setProvOpen] = useState(false)
  const [kabKotaOpen, setKabKotaOpen] = useState(false)
  const [kecOpen, setKecOpen] = useState(false)
  const [provSearch, setProvSearch] = useState("")
  const [kabSearch, setKabSearch] = useState("")
  const [kecSearch, setKecSearch] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  // Inisialisasi pilihan awal berdasarkan segmen.kecamatan_id
  useEffect(() => {
    const kec = kecData.find(k => k.id === segmen.kecamatan_id)
    setKecSel(kec || null)

    const kab = kabKotaData.find(k => k.id === kec?.kab_kota_id)
    setKabKotaSel(kab || null)

    const prov = provData.find(p => p.kode_provinsi === kab?.provinsi_id)
    setProvSel(prov || null)
  }, [segmen, kecData, kabKotaData, provData])

  // Cascade: kabupaten sesuai provinsi, kecamatan sesuai kabupaten
  const kabKotaFiltered = useMemo(() => kabKotaData.filter(k => k.provinsi_id === provSel?.kode_provinsi), [kabKotaData, provSel])
  const kecFiltered = useMemo(() => kecData.filter(k => k.kab_kota_id === kabKotaSel?.id), [kecData, kabKotaSel])

    function provKotaSearchFilter(list: Provinsi[], search: string) {
        if (!search) return list
        return list.filter(p =>
            p.nama_provinsi.toLowerCase().includes(search.toLowerCase()) ||
            p.kode_provinsi.toLowerCase().includes(search.toLowerCase())
        )
    }
  // Search filtering
  const provFiltered = useMemo(() =>
    provKotaSearchFilter(provData, provSearch),
    [provData, provSearch]
  )
  const kabFiltered = useMemo(() =>
    kabKotaFiltered.filter(k => k.nama_kab_kota.toLowerCase().includes(kabSearch.toLowerCase())),
    [kabKotaFiltered, kabSearch]
  )
  const kecFilteredSearch = useMemo(() =>
    kecFiltered.filter(k => k.nama_kecamatan.toLowerCase().includes(kecSearch.toLowerCase())),
    [kecFiltered, kecSearch]
  )

  // Update idSegmen ketika kecSel/kodeSegmen berubah
  useEffect(() => {
    if (kecSel && kodeSegmen) {
      const kabId = kecSel.id.slice(0, 4)
      const kecCode = kecSel.id.slice(4, 7)
      setIdSegmen(`${kabId}${kecCode}${kodeSegmen}`)
    }
  }, [kecSel, kodeSegmen])

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

          {/* Provinsi */}
          <div className="space-y-1">
            <Label>Provinsi</Label>
            <Popover open={provOpen} onOpenChange={setProvOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {provSel?.nama_provinsi ?? "Pilih Provinsi"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" onOpenAutoFocus={e => e.preventDefault()}>
                <Command>
                  <CommandInput placeholder="Cari provinsi..." value={provSearch} onValueChange={setProvSearch} />
                  <CommandList>
                    <CommandEmpty>Tidak ada provinsi.</CommandEmpty>
                    <CommandGroup>
                      {provFiltered.map(p => (
                        <CommandItem key={p.kode_provinsi} onSelect={() => { setProvSel(p); setProvOpen(false); setKabKotaSel(null); setKecSel(null); }}>
                          {p.nama_provinsi}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Kab/Kota */}
          <div className="space-y-1">
            <Label>Kabupaten/Kota</Label>
            <Popover open={kabKotaOpen} onOpenChange={setKabKotaOpen}>
              <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={kabKotaOpen}
                    className="w-full justify-between"
                    type="button"
                    disabled={!provSel}
                >
                  {kabKotaSel?.nama_kab_kota ?? "Pilih Kabupaten/Kota"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" onOpenAutoFocus={e => e.preventDefault()}>
                <Command>
                  <CommandInput placeholder="Cari kabupaten/kota..." value={kabSearch} onValueChange={setKabSearch} />
                  <CommandList>
                    <CommandEmpty>Tidak ada kabupaten/kota.</CommandEmpty>
                    <CommandGroup>
                      {kabFiltered.map(k => (
                        <CommandItem key={k.id} onSelect={() => { setKabKotaSel(k); setKabKotaOpen(false); setKecSel(null); }}>
                          {k.nama_kab_kota}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
                  disabled={!kabKotaSel}
                >
                  {kecSel?.nama_kecamatan ?? "Pilih Kecamatan"}
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
                      {kecFilteredSearch.map((k) => (
                        <CommandItem
                          key={k.id}
                          onPointerDown={e => { e.preventDefault(); e.stopPropagation(); }}
                          onSelect={() => { setKecSel(k); setKecOpen(false) }}
                        >
                          {k.nama_kecamatan} ({k.kode_kecamatan})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

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
