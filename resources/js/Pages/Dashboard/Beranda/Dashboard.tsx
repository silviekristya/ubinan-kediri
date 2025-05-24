// // resources/js/Pages/Dashboard/index.tsx
// import React from 'react'
// import { usePage } from '@inertiajs/react'
// import AdminDashboard from '../Admin/Beranda/Dashboard'
// import PmlDashboard   from '../Pml/Beranda/Dashboard'
// import PclDashboard   from '../Mitra/Beranda/Dashboard'
// import DashboardLayout from '@/Layouts/DashboardLayout'

// export default function DashboardDispatcher() {
//   // Ambil props Inertia
//   const page = usePage().props as any
//   const user = page.auth?.user

//   // Pastikan kita tidak crash kalau user atau pegawai null
//   const pegawai = user?.pegawai ?? null
//   const role    = pegawai?.role       // "ADMIN" | "PEGAWAI" | undefined
//   const isPml   = pegawai?.is_pml     // true | false | undefined

//   // Tentukan komponen yang akan dirender
//   let Content: React.FC
//   if (role === 'ADMIN') {
//     Content = AdminDashboard
//   } else if (role === 'PEGAWAI' && isPml) {
//     Content = PmlDashboard
//   } else {
//     // Kalau bukan admin, bukan PML, maka PCL
//     Content = PclDashboard
//   }

//   return (
//     <DashboardLayout>
//       <Content />
//     </DashboardLayout>
//   )
// }
