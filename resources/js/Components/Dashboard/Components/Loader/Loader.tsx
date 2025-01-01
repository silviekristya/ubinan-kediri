import { HashLoader, PulseLoader } from 'react-spinners';

export const LoaderDashboard = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-244px)]">
      <div className='bg-white-bps bg-gradient-to-r from-blue-bps-very-light/95 via-green-bps-very-light/95 to-orange-bps-very-light/95 rounded-full p-2'>
        <HashLoader size={50} color="white"/>
      </div>
      <div className='relative flex items-end gap-3 text-xl font-semibold'>
        {children}
        <div className='absolute bottom-[-0.1rem] right-[-1.35rem]'>
        {active && <PulseLoader size={3} color="black"/>}
        </div>
      </div>
    </div>
  );
};
