import { Link } from '@inertiajs/react';
import { FaEnvelope, FaGlobe, FaFacebook, FaInstagram, FaXTwitter, FaArrowUp, FaYoutube } from "react-icons/fa6";
import { useEffect, useState } from 'react';

import '@/../css/home/footer.css';

export const Footer = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* <footer className="bg-muted p-6 pb-0 w-full bg-[url('/assets/img/bg-footer.webp')]"> */}
            <footer className="bg-muted p-6 pb-0 w-full')]">
                <div className="container-fluid mx-auto text-black-bps px-4 min-[480px]:px-8 lg:px-16 xl:px-36">
                    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 xl:gap-6 py-4">
                        <div className="min-[480px]:col-span-2 md:col-span-1 lg:col-span-2 mb-6 lg:mb-0">
                            <div className="flex gap-2 min-[480px]:gap-4 items-center mb-2 min-[480px]:mb-4">
                                <img src="/assets/img/logo.webp" alt="Logo BPS" className="h-auto max-h-8 min-[480px]:max-h-12 w-auto" width={100} height={100} />
                                <div className="font-bold mb-2 font-text-title-footer-home">
                                    <div className="italic font-arial font-bold text-xl">
                                        BADAN PUSAT STATISTIK
                                    </div>
                                    <div className="italic font-arial font-bold text-xl">
                                        KABUPATEN KEDIRI
                                    </div>
                                </div>
                            </div>
                            <div className="leading-relaxed space-y-2">
                                <div className="font-text-medium-footer-home">Jl. Pamenang No. 42 Kediri</div>
                                <div className="font-text-medium-footer-home">Telp (62-354) 689673</div>
                                <div className="font-text-medium-footer-home">Fax (62-354) 689673</div>
                            </div>
                        </div>
                        <div className="mb-6 lg:mb-0">
                            <h4 className="font-bold mb-2 font-text-large-footer-home">
                                <span className="border-b-2 border-black-bps">Tentang Kami</span>
                            </h4>
                        </div>
                        <div className="mb-6 lg:mb-0">
                            <h4 className="font-bold mb-2 font-text-large-footer-home">
                                <span className="border-b-2 border-black-bps">
                                    Tautan Lainnya
                                </span>
                            </h4>
                            <ul className="flex flex-col gap-1">
                                <li>
                                    <Link href="https://kedirikab.bps.go.id" className="text-footer-home">
                                        <FaGlobe className="text-lg !min-w-6" />
                                        <div>
                                            BPS Kabupaten Kediri
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="mb-6 lg:mb-0" id="social-media-container">
                            <h4 className="font-bold mb-2 font-text-large-footer-home md:text-left">
                                <span className="border-b-2 border-black-bps">
                                    Sosial Media
                                </span>
                            </h4>
                            <ul className="flex flex-col gap-1">
                                <li>
                                    <Link href="mailto:bps3506@bps.go.id" className="text-footer-home">
                                        <FaEnvelope className="text-lg !min-w-6" />
                                        bps3506@bps.go.id
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://www.facebook.com/bpskediri" className="text-footer-home">
                                        <FaFacebook className="text-lg !min-w-6" />
                                        BPS Kabupaten Kediri
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://www.instagram.com/bps_kediri" className="text-footer-home">
                                        <FaInstagram className="text-lg !min-w-6" />
                                        bps_kediri
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://x.com/bps_kediri" className="text-footer-home">
                                        <FaXTwitter className="text-lg !min-w-6" />
                                        bps_kediri
                                    </Link>
                                </li>
                                <li>
                                    <Link href="https://www.youtube.com/@KegiatanBPSKabupatenKediri" className="text-footer-home">
                                        <FaYoutube className="text-lg !min-w-6" />
                                        BPS Kabupaten Kediri
                                    </Link>
                                </li>
                            </ul>
                            <img src="/assets/img/berakhlak.webp" alt="Berakhlak Logo" className="h-auto max-h-20 mt-4 hidden md:block w-full" />
                        </div>
                    </div>
                    <div className="mb-6 lg:mb-0 flex md:hidden items-center flex-col" id="social-media-container">
                        <img src="/assets/img/berakhlak.webp" alt="Berakhlak Logo" className="h-auto max-h-20 mt-4 w-full" />
                    </div>
                    <div className="font-text-footer-home border-t border-black-bps py-4 text-center">
                        <div>Hak Cipta © 2024 Badan Pusat Statistik Kabupaten Kediri</div>
                    </div>
                </div>
            </footer>
            <div
                className={`back-to-top flex items-center justify-center ${isVisible ? 'active' : ''}`}
                onClick={scrollToTop}
            >
                <FaArrowUp />
            </div>
        </>
    );
};
