"use client"

import { useState } from 'react';
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/Components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Badge } from '@/Components/ui/badge';
import { Check } from 'lucide-react';


interface Schema {
  [key: string]: any;
};

interface DataTableRowActionsProps<TData> {
    name: string;
  row: Row<TData>
  onDetail?: (id: string, data: any) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onEdit?: (id: string, data: any, dataUser?: any) => void
  onCopy?: (data: any) => void;
  onDelete?: (id: string) => void;
  onRilis?: (id: string, data: any) => void,
}

// function uuidValidateV4(uuid : string) {
//   return uuidValidate(uuid) && uuidVersion(uuid) === 4;
// }


export function DataTableRowActions<TData>({
  name,
  row,
  onDetail,
  onUpdateStatus,
  onEdit,
  onCopy,
  onDelete,
  onRilis,
}: DataTableRowActionsProps<TData>) {
  let data: TData = row.original;
  const canEdit    = ['user','pegawai','mitra','tim','sampel','segmen','pengecekanUtama','mitraHasilUbinan','templatePesan','blokSensus', 'sls'].includes(name)
  const canDelete  = ['user','pegawai','mitra','tim','sampel','segmen','templatePesan', 'blokSensus', 'sls'].includes(name)
  const canDetail  = name === 'name'
  const handleDetail = () => {
    onDetail?.((data as any).id, data);
  }

  const handleEdit = () => {
    if ((data as any).id) {
      onEdit?.((data as any).id, data);
    }
  };

  const handleCopy = () => {
    onCopy?.(data);
  };

  const handleDelete = () => {
    onDelete?.((data as any).id);
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Buka Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {canDetail && (
          <>
            <DropdownMenuItem onSelect={handleDetail} className='cursor-pointer'>Lihat Detail</DropdownMenuItem>
          </>
        )}
        {canEdit && (
            <>
            <DropdownMenuItem onSelect={handleEdit} className='cursor-pointer'>Edit</DropdownMenuItem>
            </>
        )}
        <DropdownMenuItem onSelect={handleCopy} className='cursor-pointer'>Salin</DropdownMenuItem>
        {canDelete && (
          <>
            <DropdownMenuItem onSelect={handleDelete} className='cursor-pointer'>Hapus</DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
