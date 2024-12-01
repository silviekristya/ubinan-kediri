import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { FaArrowRight, FaUserPlus } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/Components/ui/skeleton';
import HomeLayout from '@/Layouts/HomeLayout';
import { PageProps } from '@/types';

export default function HomePage({ auth }: PageProps<{ auth: any }>) {
  const [isPending, setIsPending] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.user);

  const handleLoginClick = () => {
    setIsPending(true);

    // Simulasi proses login
    setTimeout(() => {
      setIsPending(false);
    }, 2000);
  };

  useEffect(() => {
    setIsLoggedIn(!!auth.user);
  }, [auth]);

  return (
    <HomeLayout auth={auth}>
      <main className="flex-1">
        <section id="hero" className="w-full py-12 md:py-24 lg:py-32 border-b flex justify-center">
          <div className="flex justify-center items-center container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-12 justify-center items-center">
              <img
                src="/assets/img/logo.webp"
                alt="Logo BPS Kabupaten Kediri"
                className="w-full h-auto aspect-[40/31] object-cover max-w-[200px] max-h-[200px] sm:max-w-[400px] sm:max-h-[400px] lg:order-last"
              />
              <div className="flex flex-col space-y-4">
                <div className="space-y-2 text-center sm:text-left">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Ubinan Kediri
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground sm:text-base lg:text-lg">
                    Platform informasi berita resmi statistik dari BPS Kabupaten Kediri.
                  </p>
                </div>
                <div className="flex flex-col justify-center sm:justify-start items-center gap-2 min-[400px]:flex-row w-full">
                  <Button onClick={handleLoginClick} disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Harap tunggu...
                      </>
                    ) : isLoggedIn ? (
                      <Link href={route('dashboard.beranda')} className="flex gap-2 items-center">
                        <span>Dashboard</span>
                        <FaArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link href={route('register')} className="flex gap-2 items-center">
                        <span>Registrasi</span>
                        <FaUserPlus className="h-4 w-4" />
                      </Link>
                    )}
                  </Button>
                  <Button>
                    <Link href='#' className="flex gap-2 items-center">
                      Lihat Berita
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-4xl font-bold tracking-tighter">Berita Resmi Statistik Kabupaten Kediri</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-base lg:text-lg">
                  Platform kami menyajikan data statistik terbaru dari BPS Kabupaten Kediri dengan cepat dan akurat. Manfaatkan fitur otomatisasi, integrasi data, dan laporan terperinci untuk mendukung analisis Anda.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Skeleton className="mx-auto aspect-video h-[310px] w-[550px] overflow-hidden rounded-xl sm:w-full lg:order-last" />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Kolaborasi</h3>
                      <p className="text-muted-foreground">
                        Memudahkan kolaborasi dengan alat ulasan data yang terintegrasi.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Otomatisasi</h3>
                      <p className="text-muted-foreground">
                        Otomatisasikan alur kerja dengan integrasi data otomatis.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Skalabilitas</h3>
                      <p className="text-muted-foreground">
                        Akses data dengan mudah dan skalakan sesuai kebutuhan.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t flex justify-center">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Hadiri Kegiatan</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:text-lg xl:text-xl">
                Dapatkan informasi terbaru dan terkini tentang data statistik terbaru dari BPS Kabupaten Kediri. Ikuti kegiatan kami secara langsung.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button>
                <Link href='#' className="flex gap-2 items-center">
                  Pergi ke Kegiatan
                  <FaArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
}
