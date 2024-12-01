import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center p-2 bg-[url('/assets/img/bg-footer.png')]">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                className="!z-[999999]"
            />
                {/* <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg"> */}
                    {children}
                {/* </div> */}
            </div>
        </>

    );
}
