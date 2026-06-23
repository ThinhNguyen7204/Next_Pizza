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
import { Badge } from '@/components/ui/badge'

import AutoPagination from '@/components/auto-pagination'
import { useEffect, useState, createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { DataTableViewOptions } from '@/components/data-table-view-options'
import AddVoucher from '@/app/manage/vouchers/add-voucher'
import EditVoucher from '@/app/manage/vouchers/edit-voucher'
import { VoucherListResType } from '@/schemaValidations/voucher.schema'
import { useGetVoucherList, useDeleteVoucherMutation } from '@/queries/useVoucher'
import { toast } from 'sonner'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { DiscountType } from '@/constants/type'

type VoucherItem = VoucherListResType['data'][0]

const VoucherTableContext = createContext<{
  setVoucherIdEdit: (value: string | undefined) => void
  voucherIdEdit: string | undefined
  voucherDelete: VoucherItem | null
  setVoucherDelete: (value: VoucherItem | null) => void
}>({
  setVoucherIdEdit: () => { },
  voucherIdEdit: undefined,
  voucherDelete: null,
  setVoucherDelete: () => { }
})

export const columns: ColumnDef<VoucherItem>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã Code" />
    ),
  },
  {
    accessorKey: 'discount_type',
    header: 'Loại',
    cell: ({ row }) => {
      const type = row.original.discount_type
      return (
        <span>{type === DiscountType.Percentage ? 'Phần trăm' : 'Cố định'}</span>
      )
    }
  },
  {
    accessorKey: 'discount_value',
    header: 'Mức giảm',
    cell: ({ row }) => {
      const value = row.original.discount_value
      const type = row.original.discount_type
      return (
        <span>
          {type === DiscountType.Percentage ? `${value}%` : formatCurrency(value)}
        </span>
      )
    }
  },
  {
    accessorKey: 'min_order_value',
    header: 'Đơn tối thiểu',
    cell: ({ row }) => <span>{row.original.min_order_value ? formatCurrency(row.original.min_order_value) : '-'}</span>
  },
  {
    accessorKey: 'max_discount',
    header: 'Giảm tối đa',
    cell: ({ row }) => <span>{row.original.max_discount ? formatCurrency(row.original.max_discount) : '-'}</span>
  },
  {
    accessorKey: 'start_date',
    header: 'Bắt đầu',
    cell: ({ row }) => {
      const d = row.original.start_date
      return <span>{d ? new Date(d).toLocaleDateString('vi-VN') : '-'}</span>
    }
  },
  {
    accessorKey: 'end_date',
    header: 'Kết thúc',
    cell: ({ row }) => {
      const d = row.original.end_date
      return <span>{d ? new Date(d).toLocaleDateString('vi-VN') : '-'}</span>
    }
  },
  {
    accessorKey: 'usage_limit',
    header: 'Lượt dùng',
    cell: ({ row }) => {
      const limit = row.original.usage_limit
      const used = row.original.used_count || 0
      return <span>{used}/{limit || '∞'}</span>
    }
  },
  {
    accessorKey: 'is_active',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const active = row.original.is_active
      return (
        <Badge variant={active ? 'default' : 'secondary'}>
          {active ? 'Hoạt động' : 'Tạm ngưng'}
        </Badge>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setVoucherIdEdit, setVoucherDelete } = useContext(VoucherTableContext)
      const openEditVoucher = () => {
        setVoucherIdEdit(row.original._id)
      }

      const openDeleteVoucher = () => {
        setVoucherDelete(row.original)
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
            <DropdownMenuItem onClick={openEditVoucher}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteVoucher}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeleteVoucher({
  voucherDelete,
  setVoucherDelete,
  onConfirm
}: {
  voucherDelete: VoucherItem | null
  setVoucherDelete: (value: VoucherItem | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(voucherDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setVoucherDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa voucher?</AlertDialogTitle>
          <AlertDialogDescription>
            Voucher <span className='bg-foreground text-primary-foreground rounded px-1'>{voucherDelete?.code}</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
export default function VoucherTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [voucherIdEdit, setVoucherIdEdit] = useState<string | undefined>()
  const [voucherDelete, setVoucherDelete] = useState<VoucherItem | null>(null)

  const { data: voucherListRes, isLoading } = useGetVoucherList()
  const data = voucherListRes?.payload?.data || []

  const deleteVoucherMutation = useDeleteVoucherMutation()

  const handleDeleteVoucher = async () => {
    if (!voucherDelete) return
    try {
      const result = await deleteVoucherMutation.mutateAsync(voucherDelete._id)
      toast.success(result.payload.message || 'Xóa voucher thành công!')
      setVoucherDelete(null)
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
    <VoucherTableContext.Provider value={{ voucherIdEdit, setVoucherIdEdit, voucherDelete, setVoucherDelete }}>
      <div className='w-full'>
        <EditVoucher id={voucherIdEdit} setId={setVoucherIdEdit} />
        <AlertDialogDeleteVoucher
          voucherDelete={voucherDelete}
          setVoucherDelete={setVoucherDelete}
          onConfirm={handleDeleteVoucher}
        />
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc mã code'
            value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('code')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddVoucher />
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
                    Không có voucher nào.
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
              pathname='/manage/vouchers'
            />
          </div>
        </div>
      </div>
    </VoucherTableContext.Provider>
  )
}
