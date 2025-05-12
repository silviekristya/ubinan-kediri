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
import { Sampel, Segmen, BlokSensus, Sls, SampelFormData, PageProps, JenisSampel, JenisTanaman, JenisKomoditas } from "@/types"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select"
import axios from "axios"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/Components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/Components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { set } from "nprogress"

interface AddSampelDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: SampelFormData) => Promise<void>
  provinsiOptions: { id: string; text: string }[]
  kabKotaOptions: { id: string; text: string }[]
  kecamatanOptions: { id: string; text: string }[]
  kelDesaOptions: { id: string; text: string }[]
  segmenOptions: { id: string; text: string }[]
  slsOptions: { id: string; text: string }[]
  blokSensusOptions: { id: string; text: string }[]
  // slsOptions: Sls[]
}

export const AddSampelDialog = ({
  isOpen,
  onClose,
  onSave,
  provinsiOptions: provOpts,
  kabKotaOptions: _kabKotaOpts,
  kecamatanOptions: _kecOpts,
  kelDesaOptions:   _kelDesaOpts,
  segmenOptions: _segmenOpts,
  blokSensusOptions: _bsOpts,
  slsOptions: _slsOpts,
}: AddSampelDialogProps) => {
  const { csrf_token } = usePage<PageProps>().props

  // Field teks
  const [jenisSampel, setJenisSampel] = useState<JenisSampel>("Cadangan")
  const [jenisTanaman, setJenisTanaman] = useState<JenisTanaman>("Padi")
  const komoditasOptions: JenisKomoditas[] =
    jenisTanaman === "Padi"
      ? ["Padi"]
      : ["Jagung","Kedelai","Kacang Tanah","Ubi Kayu","Ubi Jalar","Lainnya"];

  const [jenisKomoditas, setJenisKomoditas] = useState<JenisKomoditas>(
    komoditasOptions[0]
  );

  useEffect(() => {
    setJenisKomoditas(komoditasOptions[0]);
  }, [jenisTanaman, komoditasOptions]);

  const [frameKsa, setFrameKsa] = useState("")
  const [prov, setProv] = useState('');
  const [kabKota, setKabKota] = useState('');
  const [kec, setKec] = useState('');
  const [kelDesa, setKelDesa] = useState('');
  const [kabKotaOptsState, setKabKotaOptsState] = useState(_kabKotaOpts);
  const [kecOptsState,   setKecOptsState]       = useState(_kecOpts);
  const [kelDesaOptsState,  setKelDesaOptsState]      = useState(_kelDesaOpts);
  const [segmenOptsState, setSegmenOptsState] = useState(_segmenOpts);
  const [bsOptsState, setBsOptsState] = useState(_bsOpts);
  const [slsOptsState, setSlsOptsState] = useState(_slsOpts);

  // ––– state filter & popover –––
  const [queryProv, setQueryProv]   = useState('');
  const [openProv, setOpenProv]     = useState(false);
  const [queryKabKota, setQueryKabKota]     = useState('');
  const [openKabKota, setOpenKabKota]       = useState(false);
  const [queryKec, setQueryKec]     = useState('');
  const [openKec, setOpenKec]       = useState(false);
  const [queryKelDesa, setQueryKelDesa]   = useState('');
  const [openKelDesa, setOpenKelDesa]     = useState(false);

  const [querySegmen, setQuerySegmen] = useState('');
  const [openSegmen, setOpenSegmen]   = useState(false);
  const [queryBs, setQueryBs] = useState('');
  const [openBs, setOpenBs]   = useState(false);
  const [querySls, setQuerySls] = useState('');
  const [openSls, setOpenSls]   = useState(false);
  const [slsOptions, setSlsOptions] = useState<Sls[]>([]);

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

  // Filter opsi berdasarkan query menggunakan useMemo
  const filteredProvinsi = useMemo(() => {
    const q = queryProv.trim().toLowerCase();
    return !q
      ? provOpts
      : provOpts.filter(p =>
          p.text.toLowerCase().includes(q) ||
          p.id.includes(q)
        );
  }, [queryProv, provOpts]);

    useEffect(() => {
    if (!prov) {
      setKabKotaOptsState([]);
      setKabKota('');
      return;
    }
    axios.get('/dashboard/admin/option/kab-kota-available-list', {
      params: { provinsi: prov }
    })
    .then(res => {
      setKabKotaOptsState(res.data.kab_kota);
      setKabKota('');         // reset pilihan kabupaten
      setKecOptsState([]);    // kosongkan kecamatan & desa
      setKec('');             
      setKelDesaOptsState([]);   
      setKelDesa('');
    })
    .catch(() => {
      setKabKotaOptsState([]);
    });
  }, [prov]);

  // 3) ketika kabKota berubah → fetch kecamatan
  useEffect(() => {
    if (!kabKota) {
      setKecOptsState([]);
      setKec('');
      return;
    }
    axios.get('/dashboard/admin/option/kecamatan-available-list', {
      params: { kab_kota: kabKota }
    })
    .then(res => {
      setKecOptsState(res.data.kecamatan);
      setKec('');
      setKelDesaOptsState([]);  
      setKelDesa('');
    })
    .catch(() => {
      setKecOptsState([]);
    });
  }, [kabKota]);

  // 4) ketika kec berubah → fetch desa
  useEffect(() => {
    if (!kec) {
      setSegmenOptsState([]);
      setSelectedSegmen("");
      setKelDesaOptsState([]);
      setKelDesa("");
      return;
    }
    axios.get("/dashboard/admin/option/segmen-available-list", {
      params: { kecamatan: kec },
    })
    .then(res => {
      setSegmenOptsState(res.data.segmen || []);
      setSelectedSegmen("");
    })
    .catch(() => setSegmenOptsState([]));
    axios.get('/dashboard/admin/option/kel-desa-available-list', {
      params: { kecamatan: kec }
    })
    .then(res => {
      setKelDesaOptsState(res.data.kel_desa);
      setKelDesa('');
    })
    .catch(() => {
      setKelDesaOptsState([]);
    });
  }, [kec]);

  // ③ fetch blok sensus setiap kali kelurahan/desa berubah
  useEffect(() => {
    if (!kelDesa) {
      setBsOptsState([]);
      setSelectedBlokSensus({ id: "", label: "" });
      return;
    }
    axios.get("/dashboard/admin/option/bs-available-list", {
      params: { kel_desa: kelDesa },
    })
    .then(res => {
      setBsOptsState(res.data.bs || []);
      setSelectedBlokSensus({ id: "", label: "" });
    })
    .catch(() => setBsOptsState([]));
  }, [kelDesa]);

  // ④ fetch SLS setiap kali blok sensus berubah (sudah ada)
  useEffect(() => {
    if (!selectedBlokSensus.id) {
      setSlsOptsState([]);
      setSelectedSLS({ id: "", label: "" });
      return;
    }
    axios.get("/dashboard/admin/option/sls-available-list", {
      params: { blok_sensus: selectedBlokSensus.id },
    })
    .then(res => {
      setSlsOptsState(res.data.sls || []);
      setSelectedSLS({ id: "", label: "" });
    })
    .catch(() => setSlsOptsState([]));
  }, [selectedBlokSensus]);

  const filteredKabKota = useMemo(() => {
    const q = queryKabKota.trim().toLowerCase();
    return !q
      ? kabKotaOptsState
      : kabKotaOptsState.filter(k =>
          k.text.toLowerCase().includes(q) ||
          k.id.includes(q)
        );
  }, [queryKabKota, kabKotaOptsState]);

  const filteredKecamatan = useMemo(() => {
    const q = queryKec.trim().toLowerCase();
    return !q
      ? kecOptsState
      : kecOptsState.filter(c =>
          c.text.toLowerCase().includes(q) ||
          c.id.includes(q)
        );
  }, [queryKec, kecOptsState]);

  const filteredKelDesa = useMemo(() => {
    const q = queryKelDesa.trim().toLowerCase();
    return !q
      ? kelDesaOptsState
      : kelDesaOptsState.filter(d =>
          d.text.toLowerCase().includes(q) ||
          d.id.includes(q)
        );
  }, [queryKelDesa, kelDesaOptsState]);


  const filteredSegmen = useMemo(() => {
    const q = querySegmen.toLowerCase();
    return segmenOptsState.filter(s =>
      s.text.toLowerCase().includes(q) || s.id.includes(q)
    );
  }, [querySegmen, segmenOptsState]);

  const filteredBs = useMemo(() => {
    const q = queryBs.toLowerCase();
    return bsOptsState.filter(b =>
      b.text.toLowerCase().includes(q) || b.id.includes(q)
    );
  }, [queryBs, bsOptsState]);

  const filteredSls = useMemo(() => {
    const q = querySls.toLowerCase();
    return slsOptsState.filter(s =>
      s.text.toLowerCase().includes(q) || s.id.includes(q)
    );
  }, [querySls, slsOptsState]);

  
  const { processing, errors } = useForm<SampelFormData>("addSampelForm", {
    provinsi_id: "",
    kab_kota_id: "",
    kecamatan_id: "",
    kel_desa_id: "",
    jenis_sampel: "Cadangan",
    jenis_tanaman: "Padi",
    jenis_komoditas: undefined,
    frame_ksa: "",
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
    perkiraan_minggu_panen: undefined,
    pcl_id: undefined,
    tim_id: undefined,
    _token: csrf_token,
  })

const handleSubmit: FormEventHandler = async e => {
  e.preventDefault();

  // common
  const payload: any = {
    provinsi_id: prov,
    kab_kota_id: kabKota,
    kecamatan_id: kec,
    nama_lok : namaLok,
    jenis_sampel: jenisSampel,
    jenis_tanaman: jenisTanaman,
    jenis_komoditas: jenisKomoditas,
    frame_ksa: frameKsa || undefined,
    bulan_listing: bulanListing,
    tahun_listing: tahunListing,
    fase_tanam: faseTanam || undefined,
    rilis,
    a_random: aRandom,
    nks,
    long: longVal,
    lat: latVal,
    subround,
    pcl_id: pclId || undefined,
    tim_id: timId || undefined,
    _token: csrf_token,
  };

  if (jenisTanaman === "Padi") {
    payload.segmen_id   = selectedSegmen;
    payload.subsegmen   = subsegmen;
    payload.strata      = strata;
    // jangan sertakan kel_desa_id, id_sls, nama_krt, perkiraan_minggu_panen
  } else {
    payload.kel_desa_id            = kelDesa;
    payload.id_sls                 = Number(selectedSLS.id);
    payload.nama_krt               = namaKrt;
    payload.perkiraan_minggu_panen = Number(perkiraanMingguPanen);
    // jangan sertakan segmen_id, subsegmen, strata
  }

  await onSave(payload);
};

const isFormValid = useMemo(() => {
  // cek field umum
  if (!prov || !kabKota || !kec) return false;
  if (!jenisSampel) return false;
  if (!jenisTanaman) return false;
  if (!namaLok) return false;
  if (!bulanListing || !tahunListing) return false;
  if (!rilis || !aRandom || !nks || !longVal || !latVal) return false;
  // cek subround dan format minimal
  if (subround.length < 1 || subround.length > 2) return false;

  if (jenisTanaman === "Padi") {
    // wajib segmen, subsegmen, strata
    if (!selectedSegmen) return false;
    if (!subsegmen) return false;
    if (!strata) return false;
  } else {
    // Palawija: wajib kelDesa (sudah), blokSensus, SLS, namaKrt, perkiraanMingguPanen
    if (!kelDesa) return false;
    if (!selectedBlokSensus.id) return false;
    if (!selectedSLS.id) return false;
    if (!namaKrt) return false;
    if (!perkiraanMingguPanen) return false;
  }

  return true;
}, [
  prov, kabKota, kec, kelDesa,
  jenisSampel, jenisTanaman, namaLok,
  bulanListing, tahunListing, rilis,
  aRandom, nks, longVal, latVal,
  subround,
  selectedSegmen, subsegmen, strata,
  selectedBlokSensus, selectedSLS,
  namaKrt, perkiraanMingguPanen,
]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Sampel Baru</DialogTitle>
          <DialogDescription>Masukkan data sampel baru</DialogDescription>
        </DialogHeader>
        <div className="p-2 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input type="hidden" name="_token" value={csrf_token} />

            {/* Jenis Sampel */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="jenis_sampel">Jenis Sampel</Label>
              <Select
                onValueChange={(val: JenisSampel) => setJenisSampel(val)}
                value={jenisSampel}
              >
                <SelectTrigger id="jenis_sampel" className="w-full">
                  <SelectValue placeholder="Pilih Jenis Sampel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Utama">Utama</SelectItem>
                  <SelectItem value="Cadangan">Cadangan</SelectItem>
                </SelectContent>
              </Select>
              {errors.jenis_sampel && (
                <p className="text-red-500 text-sm">{errors.jenis_sampel}</p>
              )}
            </div>

            {/* Jenis Tanaman */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="jenis_tanaman">Jenis Tanaman</Label>
              <Select
                onValueChange={(val: JenisTanaman) => setJenisTanaman(val)}
                value={jenisTanaman}
              >
                <SelectTrigger id="jenis_tanaman" className="w-full">
                  <SelectValue placeholder="Pilih Jenis Tanaman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Padi">Padi</SelectItem>
                  <SelectItem value="Palawija">Palawija</SelectItem>
                </SelectContent>
              </Select>
              {errors.jenis_tanaman && (
                <p className="text-red-500 text-sm">{errors.jenis_tanaman}</p>
              )}
            </div>

            {/* Jenis Komoditas */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="jenis_komoditas">Jenis Komoditas</Label>
              <Select
                onValueChange={(val: JenisKomoditas) => setJenisKomoditas(val)}
                value={jenisKomoditas}
              >
                <SelectTrigger id="jenis_komoditas" className="w-full">
                  <SelectValue placeholder="Pilih Jenis Komoditas" />
                </SelectTrigger>
                <SelectContent>
                  {komoditasOptions.map(k => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.jenis_komoditas && (
                <p className="text-red-500 text-sm">{errors.jenis_komoditas}</p>
              )}
            </div>

            {/* Field Frame KSA */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="frame_ksa">Frame KSA</Label>
              <Select
                onValueChange={setFrameKsa}
                value={frameKsa}
              >
                <SelectTrigger id="frame_ksa" className="w-full">
                  <SelectValue placeholder="Pilih Frame KSA" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthNumber = String(i + 1).padStart(2, "0");
                    const monthName = new Intl.DateTimeFormat("id", { month: "long" })
                      .format(new Date(2020, i, 1));
                    return (
                      <SelectItem key={monthNumber} value={monthNumber}>
                        {monthName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.frame_ksa && (
                <p className="text-red-500 text-sm">{errors.frame_ksa}</p>
              )}
            </div>


            {/* Provinsi */}
            <div className="space-y-1">
              <Label htmlFor="prov">Provinsi</Label>
              <Popover open={openProv} onOpenChange={setOpenProv}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProv}
                    className="w-full justify-between"
                    type="button"
                  >
                    {prov
                      ? provOpts.find(p => p.id === prov)?.text
                      : "Pilih Provinsi"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  onOpenAutoFocus={e => e.preventDefault()}
                >
                  <Command>
                    <CommandInput
                      placeholder="Cari provinsi..."
                      value={queryProv}
                      onValueChange={setQueryProv}
                    />
                    <CommandList>
                      <CommandEmpty>Tidak ada data.</CommandEmpty>
                      <CommandGroup>
                        {filteredProvinsi.map(p => (
                          <CommandItem
                            key={p.id}
                            onPointerDown={e => e.preventDefault()}
                            onSelect={() => {
                              setProv(p.id)
                              setOpenProv(false)
                              setQueryProv("")    // reset search
                            }}
                          >
                            {p.text}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.provinsi_id && (
                <p className="text-red-500 text-sm">{errors.provinsi_id}</p>
              )}
            </div>

            {/* Kabupaten/Kota */}
            <div className="space-y-1">
              <Label htmlFor="kabkota">Kabupaten/Kota</Label>
              <Popover open={openKabKota} onOpenChange={setOpenKabKota}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openKabKota}
                    className={`w-full justify-between ${
                      !prov ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    type="button"
                    disabled={!prov}
                  >
                    {kabKota
                      ? kabKotaOptsState.find(k => k.id === kabKota)?.text
                      : 'Pilih Kabupaten/Kota'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                {prov && (
                  <PopoverContent
                    className="w-full p-0"
                    onOpenAutoFocus={e => e.preventDefault()}
                  >
                    <Command>
                      <CommandInput
                        placeholder="Cari kabupaten/kota..."
                        value={queryKabKota}
                        onValueChange={setQueryKabKota}
                      />
                      <CommandList>
                        <CommandEmpty>Tidak ada data.</CommandEmpty>
                        <CommandGroup>
                          {filteredKabKota.map(k => (
                            <CommandItem
                              key={k.id}
                              onPointerDown={e => e.preventDefault()}
                              onSelect={() => {
                                setKabKota(k.id)
                                setOpenKabKota(false)
                                setQueryKabKota('')
                              }}
                            >
                              {k.text}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
              {errors.kab_kota_id && (
                <p className="text-red-500 text-sm">{errors.kab_kota_id}</p>
              )}
            </div>

            {/* Kecamatan */}
            <div className="space-y-1">
              <Label htmlFor="kec">Kecamatan</Label>
              <Popover open={openKec} onOpenChange={setOpenKec}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openKec}
                    className={`w-full justify-between ${
                      !kabKota ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    type="button"
                    disabled={!kabKota}
                  >
                    {kec
                      ? kecOptsState.find(c => c.id === kec)?.text
                      : 'Pilih Kecamatan'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                {kabKota && (
                  <PopoverContent
                    className="w-full p-0"
                    onOpenAutoFocus={e => e.preventDefault()}
                  >
                    <Command>
                      <CommandInput
                        placeholder="Cari kecamatan..."
                        value={queryKec}
                        onValueChange={setQueryKec}
                      />
                      <CommandList>
                        <CommandEmpty>Tidak ada data.</CommandEmpty>
                        <CommandGroup>
                          {filteredKecamatan.map(c => (
                            <CommandItem
                              key={c.id}
                              onPointerDown={e => e.preventDefault()}
                              onSelect={() => {
                                setKec(c.id)
                                setOpenKec(false)
                                setQueryKec('')
                              }}
                            >
                              {c.text}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
              {errors.kecamatan_id && (
                <p className="text-red-500 text-sm">{errors.kecamatan_id}</p>
              )}
            </div>

            {jenisTanaman === "Padi" && (
              <>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="segmen_id">Segmen</Label>
                  <Popover open={openSegmen} onOpenChange={setOpenSegmen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSegmen}
                        className={`w-full justify-between text-sm ${
                          !kec ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!kec}
                        type="button"
                      >
                        {selectedSegmen || "Pilih Segmen"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    {kec && (
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
                                  key={seg.id}
                                  value={seg.id}
                                  onSelect={() => {
                                    setSelectedSegmen(seg.id)
                                    setOpenSegmen(false)
                                    setQuerySegmen("")
                                  }}
                                >
                                  {seg.id}
                                  <Check
                                    className={`ml-auto ${
                                      selectedSegmen === seg.id ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    )}
                  </Popover>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="subsegmen">Subsegmen</Label>
                  <Select
                    onValueChange={setSubsegmen}
                    value={subsegmen}
                    disabled={!selectedSegmen}
                  >
                    <SelectTrigger className={`w-full ${!selectedSegmen ? "opacity-50" : ""}`}>
                      <SelectValue placeholder="Pilih Subsegmen" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A1","A2","A3","B1","B2","B3","C1","C2","C3"].map(code => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subsegmen && (
                    <p className="text-red-500 text-sm">{errors.subsegmen}</p>
                  )}
                </div>
              </>
            )}

            {jenisTanaman === "Palawija" && (
              <>
                {/* Kel/Desa */}
                <div className="space-y-1">
                  <Label htmlFor="keldesa">Kelurahan/Desa</Label>
                  <Popover open={openKelDesa} onOpenChange={setOpenKelDesa}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openKelDesa}
                        className={`w-full justify-between ${
                          !kec ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        type="button"
                        disabled={!kec}
                      >
                        {kelDesa
                          ? kelDesaOptsState.find(d => d.id === kelDesa)?.text
                          : 'Pilih Kelurahan/Desa'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    {kec && (
                      <PopoverContent
                        className="w-full p-0"
                        onOpenAutoFocus={e => e.preventDefault()}
                      >
                        <Command>
                          <CommandInput
                            placeholder="Cari kelurahan/desa..."
                            value={queryKelDesa}
                            onValueChange={setQueryKelDesa}
                          />
                          <CommandList>
                            <CommandEmpty>Tidak ada data.</CommandEmpty>
                            <CommandGroup>
                              {filteredKelDesa.map(d => (
                                <CommandItem
                                  key={d.id}
                                  onPointerDown={e => e.preventDefault()}
                                  onSelect={() => {
                                    setKelDesa(d.id)
                                    setOpenKelDesa(false)
                                    setQueryKelDesa('')
                                  }}
                                >
                                  {d.text}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    )}
                  </Popover>
                  {errors.kel_desa_id && (
                    <p className="text-red-500 text-sm">{errors.kel_desa_id}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="blok_sensus">Nomor Blok Sensus</Label>
                  <Popover open={openBs} onOpenChange={setOpenBs}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openBs}
                        className={`w-full justify-between ${
                          !kelDesa ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        type="button"
                        disabled={!kelDesa}
                      >
                        {selectedBlokSensus.label || "Pilih Blok Sensus"}
                      </Button>
                    </PopoverTrigger>
                    {kelDesa && (
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
                                    setSelectedBlokSensus({ id: String(bs.id), label: bs.id });
                                    setOpenBs(false)
                                    setQueryBs("")
                                  }}
                                >
                                  {bs.id}
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
                    )}
                  </Popover>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="nama_sls">SLS</Label>
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
                                setSelectedSLS({ id: String(sls.id), label: sls.text });
                                setOpenSls(false);
                                setQuerySls("");
                              }}
                            >
                              {sls.text}
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
              </>
            )}

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

            {jenisTanaman === "Palawija" && (
              <>
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
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="perkiraan_minggu_panen">Perkiraan Minggu Panen</Label>
                  <Input
                    id="perkiraan_minggu_panen"
                    name="perkiraan_minggu_panen"
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Masukkan minggu panen"
                    value={perkiraanMingguPanen}
                    onChange={e => setPerkiraanMingguPanen(e.target.value)}
                  />
                  {errors.perkiraan_minggu_panen && (
                    <p className="text-red-500 text-sm">{errors.perkiraan_minggu_panen}</p>
                  )}
                </div>
              </>
            )}
            
            {/* Field Strata */}
            {jenisTanaman === "Padi" && (
            <div className="flex flex-col space-y-2">
              <Label htmlFor="strata">Strata</Label>
              <Select onValueChange={setStrata} value={strata}>
                <SelectTrigger id="strata" className="w-full">
                  <SelectValue placeholder="Pilih Strata" />
                </SelectTrigger>
                <SelectContent>
                  {["S1","S2","S3"].map(code=>(
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.strata && (
                <p className="text-red-500 text-sm">{errors.strata}</p>
              )}
            </div>
            )}

            {/* Field Bulan Listing */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="bulan_listing">Bulan Listing</Label>
              <Select onValueChange={setBulanListing} value={bulanListing}>
                <SelectTrigger id="bulan_listing" className="w-full">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthNumber = String(i + 1).padStart(2, "0");
                    const monthName = new Intl.DateTimeFormat("id", { month: "long" }).format(
                      new Date(2020, i, 1)
                    );
                    return (
                      <SelectItem key={monthNumber} value={monthNumber}>
                        {monthName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.bulan_listing && (
                <p className="text-red-500 text-sm">{errors.bulan_listing}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="tahun_listing">Tahun Listing</Label>
              <Input
                id="tahun_listing"
                name="tahun_listing"
                placeholder="Contoh: 2025"
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
                placeholder="Contoh: 2"
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
                type="datetime-local"
                value={rilis}
                onChange={(e) => setRilis(e.target.value)}
              />
              {errors.rilis && (
                <p className="text-red-500 text-sm">{errors.rilis}</p>
              )}
            </div>

            {/* Field A Random */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="a_random">Angka Random</Label>
              <Input
                id="a_random"
                name="a_random"
                placeholder="Contoh: 0.52"
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
                placeholder="Contoh: 123456789"
                value={nks}
                onChange={(e) => setNks(e.target.value)}
              />
              {errors.nks && (
                <p className="text-red-500 text-sm">{errors.nks}</p>
              )}
            </div>

            {/* Field A Random */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="a_random">Subround</Label>
              <Input
                id="subround"
                name="subround"
                placeholder="Contoh: 2"
                value={subround}
                onChange={(e) => setSubround(e.target.value)}
              />
              {errors.subround && (
                <p className="text-red-500 text-sm">{errors.subround}</p>
              )}
            </div>

            {/* Field Longitude */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="long">Longitude</Label>
              <Input
                id="long"
                name="long"
                placeholder="Contoh: 112.34567"
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
                placeholder="Contoh: -7.78901"
                value={latVal}
                onChange={(e) => setLatVal(e.target.value)}
              />
              {errors.lat && (
                <p className="text-red-500 text-sm">{errors.lat}</p>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing || !isFormValid}
              >
                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSampelDialog
