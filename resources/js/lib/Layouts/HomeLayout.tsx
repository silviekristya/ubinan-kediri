import { Footer } from "@/Components/Home/Layouts/Footer/Index";
import { Navbar } from "@/Components/Home/Layouts/Navbar/Index";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function HomeLayout({ auth, children }: { auth: any; children: React.ReactNode }) {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                className="!z-[999999]"
            />
            <Navbar auth={auth} csrf_token={auth.csrf_token} />
            {/* <main className="min-h-[calc(100vh-80px)] w-full bg-[url('/assets/img/bg-bps-kab-kediri.webp')]"> */}
            <main className="min-h-[calc(100vh-80px)] w-full')]">
                {children}
            </main>
            <Footer />
        </>
    );
}
