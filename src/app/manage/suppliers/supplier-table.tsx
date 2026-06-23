'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

import AutoPagination from '@/components/auto-pagination'
import { useEffect, useState, createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { DataTableViewOptions } from '@/components/data-table-view-options'
import AddSupplier from '@/app/manage/suppliers/add-supplier'
import EditSupplier from '@/app/manage/suppliers/edit-supplier'
import { SupplierListResType } from '@/schemaValidations/supplier.schema'
import { useGetSupplierList, useDeleteSupplierMutation } from '@/queries/useSupplier'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

type SupplierItem = SupplierListResType['data'][0]

const SupplierTableContext = createContext<{
  setSupplierIdEdit: (value: string | undefined) => void
  supplierIdEdit: string | undefined
  supplierDelete: SupplierItem | null
  setSupplierDelete: (value: SupplierItem | null) => void
}>({
  setSupplierIdEdit: () => { },
  supplierIdEdit: undefined,
  supplierDelete: null,
  setSupplierDelete: () => { }
})

export const columns: ColumnDef<SupplierItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    header: 'ID',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original._id}</span>
  },
  {
    accessorKey: 'supplier_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên nhà cung cấp" />
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Số điện thoại',
    cell: ({ row }) => <span>{row.original.phone || '-'}</span>
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span>{row.original.email || '-'}</span>
  },
  {
    accessorKey: 'supplier_address',
    header: 'Địa chỉ',
    cell: ({ row }) => <span className="max-w-[200px] truncate block">{row.original.supplier_address || '-'}</span>
  },
  {
    accessorKey: 'rating',
    header: 'Đánh giá',
    cell: ({ row }) => <span>{row.original.rating ? `${row.original.rating} ★` : '-'}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setSupplierIdEdit, setSupplierDelete } = useContext(SupplierTableContext)
      const openEditSupplier = () => {
        setSupplierIdEdit(row.original._id)
      }

      const openDeleteSupplier = () => {
        setSupplierDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditSupplier}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteSupplier}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeleteSupplier({
  supplierDelete,
  setSupplierDelete,
  onConfirm
}: {
  supplierDelete: SupplierItem | null
  setSupplierDelete: (value: SupplierItem | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(supplierDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setSupplierDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhà cung cấp?</AlertDialogTitle>
          <AlertDialogDescription>
            Nhà cung cấp <span className='bg-foreground text-primary-foreground rounded px-1'>{supplierDelete?.supplier_name}</span> sẽ bị xóa vĩnh viễn khỏi danh sách.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Tiếp tục</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const PAGE_SIZE = 10
export default function SupplierTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [supplierIdEdit, setSupplierIdEdit] = useState<string | undefined>()
  const [supplierDelete, setSupplierDelete] = useState<SupplierItem | null>(null)

  const { data: supplierListRes, isLoading } = useGetSupplierList()
  const data = supplierListRes?.payload?.data || []

  const deleteSupplierMutation = useDeleteSupplierMutation()

  const handleDeleteSupplier = async () => {
    if (!supplierDelete) return
    try {
      const result = await deleteSupplierMutation.mutateAsync(supplierDelete._id)
      toast.success(result.payload.message || 'Xóa nhà cung cấp thành công!')
      setSupplierDelete(null)
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <SupplierTableContext.Provider value={{ supplierIdEdit, setSupplierIdEdit, supplierDelete, setSupplierDelete }}>
      <div className='w-full'>
        <EditSupplier id={supplierIdEdit} setId={setSupplierIdEdit} />
        <AlertDialogDeleteSupplier
          supplierDelete={supplierDelete}
          setSupplierDelete={setSupplierDelete}
          onConfirm={handleDeleteSupplier}
        />
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc tên nhà cung cấp'
            value={(table.getColumn('supplier_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('supplier_name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddSupplier />
            <DataTableViewOptions table={table} />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                           ? null
                           : flexRender(
                             header.column.columnDef.header,
                             header.getContext()
                           )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Không có nhà cung cấp nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/suppliers'
            />
          </div>
        </div>
      </div>
    </SupplierTableContext.Provider>
  )
}
