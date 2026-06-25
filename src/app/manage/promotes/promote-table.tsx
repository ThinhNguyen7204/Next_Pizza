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
import AddPromote from '@/app/manage/promotes/add-promote'
import EditPromote from '@/app/manage/promotes/edit-promote'
import { LoyaltyProgramListResType } from '@/schemaValidations/loyaltyProgram.schema'
import { useGetLoyaltyProgramList, useDeleteLoyaltyProgramMutation } from '@/queries/useLoyaltyProgram'
import { toast } from 'sonner'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { DiscountType } from '@/constants/type'

type PromoteItem = LoyaltyProgramListResType['data'][0]

const PromoteTableContext = createContext<{
  setPromoteIdEdit: (value: string | undefined) => void
  promoteIdEdit: string | undefined
  promoteDelete: PromoteItem | null
  setPromoteDelete: (value: PromoteItem | null) => void
}>({
  setPromoteIdEdit: () => { },
  promoteIdEdit: undefined,
  promoteDelete: null,
  setPromoteDelete: () => { }
})

export const columns: ColumnDef<PromoteItem>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên chương trình" />
    ),
  },
  {
    accessorKey: 'points_required',
    header: 'Điểm yêu cầu',
    cell: ({ row }) => <span>{row.original.points_required} điểm</span>
  },
  {
    accessorKey: 'discount_type',
    header: 'Loại giảm',
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
      const { setPromoteIdEdit, setPromoteDelete } = useContext(PromoteTableContext)
      const openEditPromote = () => {
        setPromoteIdEdit(row.original._id)
      }

      const openDeletePromote = () => {
        setPromoteDelete(row.original)
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
            <DropdownMenuItem onClick={openEditPromote}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeletePromote}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeletePromote({
  promoteDelete,
  setPromoteDelete,
  onConfirm
}: {
  promoteDelete: PromoteItem | null
  setPromoteDelete: (value: PromoteItem | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(promoteDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setPromoteDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa ưu đãi?</AlertDialogTitle>
          <AlertDialogDescription>
            Chương trình ưu đãi <span className='bg-primary/10 text-primary rounded px-1.5 py-0.5 font-semibold'>{promoteDelete?.name}</span> sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
export default function PromoteTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [promoteIdEdit, setPromoteIdEdit] = useState<string | undefined>()
  const [promoteDelete, setPromoteDelete] = useState<PromoteItem | null>(null)

  const { data: promoteListRes, isLoading } = useGetLoyaltyProgramList()
  const data = promoteListRes?.payload?.data || []

  const deletePromoteMutation = useDeleteLoyaltyProgramMutation()

  const handleDeletePromote = async () => {
    if (!promoteDelete) return
    try {
      const result = await deletePromoteMutation.mutateAsync(promoteDelete._id)
      toast.success(result.payload.message || 'Xóa ưu đãi thành công!')
      setPromoteDelete(null)
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
    onPaginationChange: setPagination,
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
    setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [pageIndex])

  return (
    <PromoteTableContext.Provider value={{ promoteIdEdit, setPromoteIdEdit, promoteDelete, setPromoteDelete }}>
      <div className='w-full'>
        <EditPromote id={promoteIdEdit} setId={setPromoteIdEdit} />
        <AlertDialogDeletePromote
          promoteDelete={promoteDelete}
          setPromoteDelete={setPromoteDelete}
          onConfirm={handleDeletePromote}
        />
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc tên chương trình'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddPromote />
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
                    Không có chương trình ưu đãi nào.
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
              pathname='/manage/promotes'
            />
          </div>
        </div>
      </div>
    </PromoteTableContext.Provider>
  )
}
