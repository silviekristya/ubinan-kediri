import {
    CheckCircledIcon,
    CircleBackslashIcon,
    QuestionMarkCircledIcon,
    InfoCircledIcon,
  } from "@radix-ui/react-icons";
  
  // Warna untuk filter sampel
  export const sampelFilterStyles: Record<string, string> = {
    ['UTAMA']: "bg-green-500 hover:bg-green-400 text-white",
    ['CADANGAN']: "bg-red-500 hover:bg-red-400 text-white",
  };
  
  // Filter untuk data tabel sampel
  export const dataTableFilterSampel = [
    {
      value: 'UTAMA',
      label: "Utama",
      icon: CheckCircledIcon,
      color: sampelFilterStyles['UTAMA'],
    },
    {
      value: 'CADANGAN',
      label: "Cadangan",
      icon: CircleBackslashIcon,
      color: sampelFilterStyles['CADANGAN'],
    },
  ];
  