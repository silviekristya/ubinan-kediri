import { useEffect } from "react"
import { useForm as useRHF } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import { usePage, useForm as useInertiaForm } from "@inertiajs/react"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

interface ImportFormValues {
  file: FileList
}

interface AddImportSegmenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddImportSegmenDialog({ isOpen, onClose }: AddImportSegmenDialogProps) {
  // Ambil CSRF token
  const { csrf_token } = usePage().props as any

  // React Hook Form untuk validasi client‐side
  const rhf = useRHF<ImportFormValues>({
    defaultValues: { file: null as any },
  })

  // Inertia form untuk POST ke server
  const { setData, post, processing, errors: inertiaErrors } =
    useInertiaForm({
      file: null as File | null,
      _token: csrf_token,
    })

  // Sync file dari RHF → Inertia form
  useEffect(() => {
    const list = rhf.watch("file")
    if (list && list.length > 0) {
      setData("file", list[0])
    }
  }, [rhf.watch("file")])

  // Submit handler
  const onSubmit = () => {
    post("/dashboard/admin/wilayah/segmen/import", {
      forceFormData: true,
      onSuccess: ({props}) => {
        // toast.success('Import berhasil!');
        const flash  = (props as any).flash;
        if (flash.error) {
          toast.error(flash.error)
        } else if (flash.warning) {
          toast.warn(flash.warning, { autoClose: false })
        } else if (flash.success) {
          toast.success(flash.success)
        }
        onClose();
      },
      onError: () => {toast.error('Gagal mengunggah file');

      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Data Sampel</DialogTitle>
          <DialogDescription>Unggah file Excel (.xlsx/.xls)</DialogDescription>
        </DialogHeader>

        {/* Context provider untuk shadcn/ui form */}
        <Form {...rhf}>
          {/* HTML <form> yang menerima onSubmit */}
          <form onSubmit={rhf.handleSubmit(onSubmit)} encType="multipart/form-data">
            <input type="hidden" name="_token" value={csrf_token} />

            <FormField
              control={rhf.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Pilih File Excel</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Format: .xlsx atau .xls, maksimal 2MB.
                  </FormDescription>
                  <FormMessage>
                    {rhf.formState.errors.file?.message?.toString()}
                    {inertiaErrors.file && ` • ${inertiaErrors.file}`}
                  </FormMessage>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={processing}
              >
                Batal
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  "Unggah"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
