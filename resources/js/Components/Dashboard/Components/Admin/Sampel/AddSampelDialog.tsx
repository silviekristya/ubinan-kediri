import { useState, FormEventHandler, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { usePage, useForm } from "@inertiajs/react"
import { Loader2, Check } from "lucide-react"
import { Sampel, Segmen, BlokSensus, NamaSls, WithCsrf, PageProps } from "@/types"
import axios from "axios"
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/Components/ui/command"

type JenisSampel = "Utama" | "Cadangan"
export type JenisTanaman = "Padi" | "Palawija"
type JenisKomoditas =
  | "Padi"
  | "Jagung"
  | "Kedelai"
  | "Kacang Tanah"
  | "Ubi Kayu"
  | "Ubi Jalar"
  | "Lainnya"

interface SampelFormData extends WithCsrf {
  jenis_sampel: JenisSampel
  jenis_tanaman: JenisTanaman
  jenis_komoditas: JenisKomoditas
  frame_ksa?: string
  prov: string
  kab: string
  kec: string
  nama_prov: string
  nama_kab: string
  nama_kec: string
  nama_lok: string
  segmen_id?: string
  subsegmen: string
  id_sls?: number
  nama_krt?: string
  strata: string
  bulan_listing: string
  tahun_listing: string
  fase_tanam?: string
  rilis?: string
  a_random?: string
  nks: string
  long: string
  lat: string
  subround: string
  perkiraan_minggu_panen?: string
  pcl_id?: number
  tim_id?: number
}

interface AddSampelDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: SampelFormData) => Promise<void>
  segmenOptions: Segmen[]
  blokSensusOptions: BlokSensus[]
  // slsOptions: NamaSls[]
}

export const AddSampelDialog = ({
  isOpen,
  onClose,
  onSave,
  segmenOptions: segmenOpts,
  blokSensusOptions: bsOpts,
  // slsOptions: slsOpts,
}: AddSampelDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props

  // Field teks
  const [jenisSampel, setJenisSampel] = useState<JenisSampel>("Utama")
  const [jenisTanaman, setJenisTanaman] = useState<JenisTanaman>("Padi")
  const [jenisKomoditas, setJenisKomoditas] = useState<JenisKomoditas>("Padi")
  const [frameKsa, setFrameKsa] = useState("")
  const [prov, setProv] = useState("")
  const [kab, setKab] = useState("")
  const [kec, setKec] = useState("")
  const [namaProv, setNamaProv] = useState("")
  const [namaKab, setNamaKab] = useState("")
  const [namaKec, setNamaKec] = useState("")
  const [namaLok, setNamaLok] = useState("")
  const [subsegmen, setSubsegmen] = useState("")
  const [namaKrt, setNamaKrt] = useState("")
  const [strata, setStrata] = useState("")
  const [bulanListing, setBulanListing] = useState("")
  const [tahunListing, setTahunListing] = useState("")
  const [faseTanam, setFaseTanam] = useState("")
  const [rilis, setRilis] = useState("")
  const [aRandom, setARandom] = useState("")
  const [nks, setNks] = useState("")
  const [longVal, setLongVal] = useState("")
  const [latVal, setLatVal] = useState("")
  const [subround, setSubround] = useState("")
  const [perkiraanMingguPanen, setPerkiraanMingguPanen] = useState("")
  const [pclId, setPclId] = useState<number | undefined>(undefined)
  const [timId, setTimId] = useState<number | undefined>(undefined)

  // Nilai terpilih untuk dropdown
  const [selectedSegmen, setSelectedSegmen] = useState<string>("")
  const [selectedBlokSensus, setSelectedBlokSensus] = useState<{id: string; label: string}>({id: "", label: ""})
  const [selectedSLS, setSelectedSLS] = useState<{ id: string; label: string }>({ id: "", label: "" });

  // State untuk opsi yang didapat secara dinamis untuk SLS
  const [slsOptions, setSlsOptions] = useState<NamaSls[]>([])

  // State untuk pencarian dan popover masing-masing dropdown
  const [querySegmen, setQuerySegmen] = useState("")
  const [openSegmen, setOpenSegmen] = useState(false)
  const [queryBs, setQueryBs] = useState("")
  const [openBs, setOpenBs] = useState(false)
  const [querySls, setQuerySls] = useState("")
  const [openSls, setOpenSls] = useState(false)

  useEffect(() => {
    if (selectedBlokSensus) {
      console.log("Fetching SLS untuk blok sensus dengan id_bs:", selectedBlokSensus);
      axios
        .get("/dashboard/admin/option/sls-available-list", { params: { blok_sensus: selectedBlokSensus } })
        .then((response) => {
          console.log("Data SLS diterima:", response.data.nama_sls);
          setSlsOptions(response.data.nama_sls);
          // Reset pilihan SLS ketika blok sensus berubah
          setSelectedSLS({ id: "", label: "" });
        })
        .catch((error) => {
          console.error("Error fetching SLS:", error);
          setSlsOptions([]);
        });
    } else {
      console.log("BlokSensus kosong, tidak fetch SLS");
      setSlsOptions([]);
    }
  }, [selectedBlokSensus]);

  // Filter opsi berdasarkan query menggunakan useMemo
  const filteredSegmen = useMemo(() => {
    console.log("Filtering segmen dengan query:", querySegmen)
    return querySegmen === ""
      ? segmenOpts
      : segmenOpts.filter((seg) =>
          seg.id_segmen.toLowerCase().includes(querySegmen.toLowerCase()) ||
          seg.nama_segmen.toLowerCase().includes(querySegmen.toLowerCase())
        )
  }, [querySegmen, segmenOpts])

  const filteredBs = useMemo(() => {
    const lowerQuery = queryBs.trim().toLowerCase();
    console.log("Filtering blok sensus dengan query:", lowerQuery);
    if (!lowerQuery) {
      return bsOpts;
    }
    return bsOpts.filter((bs) =>
      String(bs.id).includes(queryBs) || 
      (bs.nomor_bs && bs.nomor_bs.toLowerCase().includes(lowerQuery))
    );
  }, [queryBs, bsOpts]);
  

  const filteredSls = useMemo(() => {
    console.log("Filtering SLS dengan query:", querySls)
    return querySls === ""
      ? slsOptions
      : slsOptions.filter((sls) =>
          String(sls.id).includes(querySls) ||
          sls.nama_sls.toLowerCase().includes(querySls.toLowerCase())
        )
  }, [querySls, slsOptions])

  
  const { processing, errors } = useForm<SampelFormData>({
    jenis_sampel: "Utama",
    jenis_tanaman: "Padi",
    jenis_komoditas: "Jagung",
    frame_ksa: "",
    prov: "",
    kab: "",
    kec: "",
    nama_prov: "",
    nama_kab: "",
    nama_kec: "",
    nama_lok: "",
    segmen_id: undefined,
    subsegmen: "",
    id_sls: undefined,
    nama_krt: "",
    strata: "",
    bulan_listing: "",
    tahun_listing: "",
    fase_tanam: "",
    rilis: "",
    a_random: "",
    nks: "",
    long: "",
    lat: "",
    subround: "",
    perkiraan_minggu_panen: "",
    pcl_id: undefined,
    tim_id: undefined,
    _token: csrf_token,
  })

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault()

    const formData: SampelFormData = {
      jenis_sampel: jenisSampel,
      jenis_tanaman: jenisTanaman,
      jenis_komoditas: jenisKomoditas,
      frame_ksa: frameKsa || undefined,
      prov,
      kab,
      kec,
      nama_prov: namaProv,
      nama_kab: namaKab,
      nama_kec: namaKec,
      nama_lok: namaLok,
      segmen_id: selectedSegmen || undefined,
      subsegmen,
      id_sls: selectedSLS.id ? Number(selectedSLS.id) : undefined,
      nama_krt: namaKrt || undefined,
      strata,
      bulan_listing: bulanListing,
      tahun_listing: tahunListing,
      fase_tanam: faseTanam || undefined,
      rilis: rilis || undefined,
      a_random: aRandom || undefined,
      nks,
      long: longVal,
      lat: latVal,
      subround,
      perkiraan_minggu_panen: perkiraanMingguPanen || undefined,
      pcl_id: pclId || undefined,
      tim_id: timId || undefined,
      _token: csrf_token,
    }

    try {
      console.log("Form Data akan dikirim:", formData)
      await onSave(formData)
      // Reset form
      setJenisSampel("Utama")
      setJenisTanaman("Padi")
      setJenisKomoditas("Padi")
      setFrameKsa("")
      setProv("")
      setKab("")
      setKec("")
      setNamaProv("")
      setNamaKab("")
      setNamaKec("")
      setNamaLok("")
      setSelectedSegmen("")
      setSubsegmen("")
      setSelectedBlokSensus({ id: "", label: "" })
      setSelectedSLS({ id: "", label: "" })
      setNamaKrt("")
      setStrata("")
      setBulanListing("")
      setTahunListing("")
      setFaseTanam("")
      setRilis("")
      setARandom("")
      setNks("")
      setLongVal("")
      setLatVal("")
      setSubround("")
      setPerkiraanMingguPanen("")
      setPclId(undefined)
      setTimId(undefined)

      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Sampel Baru</DialogTitle>
          <DialogDescription>Masukkan data sampel baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input type="hidden" name="_token" value={csrf_token} />

          {/* Jenis Sampel */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="jenis_sampel">Jenis Sampel</Label>
            <select
              id="jenis_sampel"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
              value={jenisSampel}
              onChange={(e) => setJenisSampel(e.target.value as JenisSampel)}
            >
              <option value="">Pilih Jenis Sampel</option>
              <option value="Utama">Utama</option>
              <option value="Cadangan">Cadangan</option>
            </select>
            {errors.jenis_sampel && (
              <p className="text-red-500 text-sm">{errors.jenis_sampel}</p>
            )}
          </div>

          {/* Jenis Tanaman */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="jenis_tanaman">Jenis Tanaman</Label>
            <select
              id="jenis_tanaman"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
              value={jenisTanaman}
              onChange={(e) => setJenisTanaman(e.target.value as JenisTanaman)}
            >
              <option value="">Pilih Jenis Tanaman</option>
              <option value="Padi">Padi</option>
              <option value="Palawija">Palawija</option>
            </select>
            {errors.jenis_tanaman && (
              <p className="text-red-500 text-sm">{errors.jenis_tanaman}</p>
            )}
          </div>

          {/* Jenis Komoditas */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="jenis_komoditas">Jenis Komoditas</Label>
            <select
              id="jenis_komoditas"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
              value={jenisKomoditas}
              onChange={(e) => setJenisKomoditas(e.target.value as JenisKomoditas)}
            >
              <option value="">Pilih Jenis Komoditas</option>
              <option value="Padi">Padi</option>
              <option value="Jagung">Jagung</option>
              <option value="Kedelai">Kedelai</option>
              <option value="Kacang Tanah">Kacang Tanah</option>
              <option value="Ubi Kayu">Ubi Kayu</option>
              <option value="Ubi Jalar">Ubi Jalar</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.jenis_komoditas && (
              <p className="text-red-500 text-sm">{errors.jenis_komoditas}</p>
            )}
          </div>

          {/* Field Frame KSA */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="frame_ksa">Frame KSA</Label>
            <Input
              id="frame_ksa"
              name="frame_ksa"
              placeholder="Jika ada"
              value={frameKsa}
              onChange={(e) => setFrameKsa(e.target.value)}
            />
            {errors.frame_ksa && (
              <p className="text-red-500 text-sm">{errors.frame_ksa}</p>
            )}
          </div>

          {/* Field Provinsi */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="prov">Provinsi (kode)</Label>
            <Input
              id="prov"
              name="prov"
              placeholder="Misal: 35"
              value={prov}
              onChange={(e) => setProv(e.target.value)}
            />
            {errors.prov && (
              <p className="text-red-500 text-sm">{errors.prov}</p>
            )}
          </div>

          {/* Field Kabupaten */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="kab">Kabupaten (kode)</Label>
            <Input
              id="kab"
              name="kab"
              placeholder="Misal: 06"
              value={kab}
              onChange={(e) => setKab(e.target.value)}
            />
            {errors.kab && (
              <p className="text-red-500 text-sm">{errors.kab}</p>
            )}
          </div>

          {/* Field Kecamatan */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="kec">Kecamatan (kode)</Label>
            <Input
              id="kec"
              name="kec"
              placeholder="Misal: 010"
              value={kec}
              onChange={(e) => setKec(e.target.value)}
            />
            {errors.kec && (
              <p className="text-red-500 text-sm">{errors.kec}</p>
            )}
          </div>

          {/* Field Nama Provinsi */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_prov">Nama Provinsi</Label>
            <Input
              id="nama_prov"
              name="nama_prov"
              placeholder="Jawa Timur"
              value={namaProv}
              onChange={(e) => setNamaProv(e.target.value)}
            />
            {errors.nama_prov && (
              <p className="text-red-500 text-sm">{errors.nama_prov}</p>
            )}
          </div>

          {/* Field Nama Kabupaten */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_kab">Nama Kabupaten</Label>
            <Input
              id="nama_kab"
              name="nama_kab"
              placeholder="Kediri"
              value={namaKab}
              onChange={(e) => setNamaKab(e.target.value)}
            />
            {errors.nama_kab && (
              <p className="text-red-500 text-sm">{errors.nama_kab}</p>
            )}
          </div>

          {/* Field Nama Kecamatan */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_kec">Nama Kecamatan</Label>
            <Input
              id="nama_kec"
              name="nama_kec"
              placeholder="Mojo"
              value={namaKec}
              onChange={(e) => setNamaKec(e.target.value)}
            />
            {errors.nama_kec && (
              <p className="text-red-500 text-sm">{errors.nama_kec}</p>
            )}
          </div>

          {/* Field Nama Lokasi */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_lok">Nama Lokasi</Label>
            <Input
              id="nama_lok"
              name="nama_lok"
              placeholder="Nama lokasi ubinan"
              value={namaLok}
              onChange={(e) => setNamaLok(e.target.value)}
            />
            {errors.nama_lok && (
              <p className="text-red-500 text-sm">{errors.nama_lok}</p>
            )}
          </div>

          {/* Dropdown ID Segmen (Searchable) */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="segmen_id">ID Segmen</Label>
            <Popover open={openSegmen} onOpenChange={setOpenSegmen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSegmen}
                  className="w-full justify-between text-sm"
                >
                  {selectedSegmen || "Pilih Segmen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Cari segmen..."
                    value={querySegmen}
                    onValueChange={setQuerySegmen}
                  />
                  <CommandList>
                    <CommandEmpty>Tidak ada segmen ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {filteredSegmen.map((seg) => (
                        <CommandItem
                          key={seg.id_segmen}
                          value={seg.id_segmen}
                          onSelect={() => {
                            setSelectedSegmen(seg.id_segmen)
                            setOpenSegmen(false)
                            setQuerySegmen("")
                          }}
                        >
                          {seg.id_segmen}
                          <Check
                            className={`ml-auto ${
                              selectedSegmen === seg.id_segmen ? "opacity-100" : "opacity-0"
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

          {/* Field Subsegmen */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="subsegmen">Subsegmen</Label>
            <Input
              id="subsegmen"
              name="subsegmen"
              placeholder="Kode subsegmen"
              value={subsegmen}
              onChange={(e) => setSubsegmen(e.target.value)}
            />
            {errors.subsegmen && (
              <p className="text-red-500 text-sm">{errors.subsegmen}</p>
            )}
          </div>

          {/* Dropdown Blok Sensus (Searchable) */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="blok_sensus">Nomor Blok Sensus</Label>
            <Popover open={openBs} onOpenChange={setOpenBs}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openBs}
                  className="w-full justify-between text-sm"
                >
                  {selectedBlokSensus.label || "Pilih Blok Sensus"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Cari blok sensus..."
                    value={queryBs}
                    onValueChange={setQueryBs}
                  />
                  <CommandList>
                    <CommandEmpty>Tidak ada blok sensus ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {filteredBs.map((bs) => (
                        <CommandItem
                          key={bs.id}
                          value={String(bs.id)}
                          onSelect={() => {
                            console.log("Memilih blok sensus dengan id:", bs.id);
                            setSelectedBlokSensus({ id: String(bs.id), label: bs.nomor_bs });
                            setOpenBs(false)
                            setQueryBs("")
                          }}
                        >
                          {bs.nomor_bs}
                          <Check
                            className={`ml-auto ${
                              selectedBlokSensus.id === String(bs.id) ? "opacity-100" : "opacity-0"
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

          {/* Dropdown Nama SLS (Searchable) */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_sls">Nama SLS</Label>
            <Popover open={openSls} onOpenChange={setOpenSls}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSls}
                  className="w-full justify-between text-sm"
                >
                  {selectedSLS.label || "Pilih SLS"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Cari SLS..."
                    value={querySls}
                    onValueChange={setQuerySls}
                  />
                  <CommandList>
                    <CommandEmpty>Tidak ada SLS ditemukan.</CommandEmpty>
                    <CommandGroup>
                    {filteredSls.map((sls) => (
                      <CommandItem
                        key={sls.id}
                        value={String(sls.id)}
                        onSelect={() => {
                          setSelectedSLS({ id: String(sls.id), label: sls.nama_sls });
                          setOpenSls(false);
                          setQuerySls("");
                        }}
                      >
                        {sls.nama_sls}
                        <Check
                          className={`ml-auto ${selectedSLS.id === String(sls.id) ? "opacity-100" : "opacity-0"}`}
                        />
                      </CommandItem>
                    ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Field Nama KRT */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nama_krt">Nama KRT</Label>
            <Input
              id="nama_krt"
              name="nama_krt"
              placeholder="Masukkan nama KRT (jika ada)"
              value={namaKrt}
              onChange={(e) => setNamaKrt(e.target.value)}
            />
            {errors.nama_krt && (
              <p className="text-red-500 text-sm">{errors.nama_krt}</p>
            )}
          </div>

          {/* Field Strata */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="strata">Strata</Label>
            <Input
              id="strata"
              name="strata"
              placeholder="Kode strata"
              value={strata}
              onChange={(e) => setStrata(e.target.value)}
            />
            {errors.strata && (
              <p className="text-red-500 text-sm">{errors.strata}</p>
            )}
          </div>

          {/* Field Bulan Listing */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="bulan_listing">Bulan Listing</Label>
            <Input
              id="bulan_listing"
              name="bulan_listing"
              placeholder="Misal: 09"
              value={bulanListing}
              onChange={(e) => setBulanListing(e.target.value)}
            />
            {errors.bulan_listing && (
              <p className="text-red-500 text-sm">{errors.bulan_listing}</p>
            )}
          </div>

          {/* Field Tahun Listing */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="tahun_listing">Tahun Listing</Label>
            <Input
              id="tahun_listing"
              name="tahun_listing"
              placeholder="Misal: 2025"
              value={tahunListing}
              onChange={(e) => setTahunListing(e.target.value)}
            />
            {errors.tahun_listing && (
              <p className="text-red-500 text-sm">{errors.tahun_listing}</p>
            )}
          </div>

          {/* Field Fase Tanam */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="fase_tanam">Fase Tanam</Label>
            <Input
              id="fase_tanam"
              name="fase_tanam"
              placeholder="Misal: vegetatif"
              value={faseTanam}
              onChange={(e) => setFaseTanam(e.target.value)}
            />
            {errors.fase_tanam && (
              <p className="text-red-500 text-sm">{errors.fase_tanam}</p>
            )}
          </div>

          {/* Field Rilis */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="rilis">Tanggal Rilis</Label>
            <Input
              id="rilis"
              name="rilis"
              type="date"
              value={rilis}
              onChange={(e) => setRilis(e.target.value)}
            />
            {errors.rilis && (
              <p className="text-red-500 text-sm">{errors.rilis}</p>
            )}
          </div>

          {/* Field A Random */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="a_random">A Random</Label>
            <Input
              id="a_random"
              name="a_random"
              placeholder="..."
              value={aRandom}
              onChange={(e) => setARandom(e.target.value)}
            />
            {errors.a_random && (
              <p className="text-red-500 text-sm">{errors.a_random}</p>
            )}
          </div>

          {/* Field NKS */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="nks">NKS</Label>
            <Input
              id="nks"
              name="nks"
              placeholder="Misal: 123456789"
              value={nks}
              onChange={(e) => setNks(e.target.value)}
            />
            {errors.nks && (
              <p className="text-red-500 text-sm">{errors.nks}</p>
            )}
          </div>

          {/* Field Longitude */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="long">Longitude</Label>
            <Input
              id="long"
              name="long"
              placeholder="Misal: 112.34567"
              value={longVal}
              onChange={(e) => setLongVal(e.target.value)}
            />
            {errors.long && (
              <p className="text-red-500 text-sm">{errors.long}</p>
            )}
          </div>

          {/* Field Latitude */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              name="lat"
              placeholder="Misal: -7.78901"
              value={latVal}
              onChange={(e) => setLatVal(e.target.value)}
            />
            {errors.lat && (
              <p className="text-red-500 text-sm">{errors.lat}</p>
            )}
          </div>

          {/* Field Subround */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="subround">Subround</Label>
            <Input
              id="subround"
              name="subround"
              placeholder="Misal: 01"
              value={subround}
              onChange={(e) => setSubround(e.target.value)}
            />
            {errors.subround && (
              <p className="text-red-500 text-sm">{errors.subround}</p>
            )}
          </div>

          {/* Field Perkiraan Minggu Panen */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="perkiraan_minggu_panen">Perkiraan Minggu Panen</Label>
            <Input
              id="perkiraan_minggu_panen"
              name="perkiraan_minggu_panen"
              type="number"
              placeholder="Masukkan perkiraan minggu panen"
              value={perkiraanMingguPanen}
              onChange={(e) => setPerkiraanMingguPanen(e.target.value)}
            />
            {errors.perkiraan_minggu_panen && (
              <p className="text-red-500 text-sm">{errors.perkiraan_minggu_panen}</p>
            )}
          </div>

          {/* Field PCL ID */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="pcl_id">PCL ID</Label>
            <Input
              id="pcl_id"
              name="pcl_id"
              type="number"
              placeholder="ID mitra (jika ada)"
              value={pclId ?? ""}
              onChange={(e) => setPclId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.pcl_id && (
              <p className="text-red-500 text-sm">{errors.pcl_id}</p>
            )}
          </div>

          {/* Field Tim ID */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="tim_id">Tim ID</Label>
            <Input
              id="tim_id"
              name="tim_id"
              type="number"
              placeholder="ID tim (jika ada)"
              value={timId ?? ""}
              onChange={(e) => setTimId(e.target.value ? Number(e.target.value) : undefined)}
            />
            {errors.tim_id && (
              <p className="text-red-500 text-sm">{errors.tim_id}</p>
            )}
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
};

export default AddSampelDialog
