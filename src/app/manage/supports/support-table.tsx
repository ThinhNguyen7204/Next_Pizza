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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AutoPagination from '@/components/auto-pagination'
import { useEffect, useState, createContext, useContext, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { DataTableViewOptions } from '@/components/data-table-view-options'
import ViewSupport, { SupportMessage } from '@/app/manage/supports/view-support'
import { useGetSupportList, useUpdateSupportMutation } from '@/queries/useSupport'
import { toast } from 'sonner'

const SupportTableContext = createContext<{
  setSupportIdEdit: (value: string | undefined) => void
  supportIdEdit: string | undefined
  handleDelete: (id: string) => void
}>({
  setSupportIdEdit: (value: string | undefined) => { },
  supportIdEdit: undefined,
  handleDelete: (id: string) => { }
})

export const columns: ColumnDef<SupportMessage>[] = [
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
    accessorKey: 'id',
    header: 'Mã phiếu',
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khách hàng" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{row.original.name}</span>
        <span className="text-[10px] text-muted-foreground">{row.original.email}</span>
      </div>
    )
  },
  {
    accessorKey: 'message',
    header: 'Nội dung phản hồi',
    cell: ({ row }) => <span className="max-w-[250px] truncate block text-sm font-light" title={row.original.message}>{row.original.message}</span>
  },
  {
    accessorKey: 'date',
    header: 'Thời gian',
    cell: ({ row }) => <span>{new Date(row.original.createdAt || row.original.date).toLocaleString('vi-VN')}</span>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: function StatusCell({ row }) {
      const { handleUpdate } = useContext(SupportTableContext) as any
      const currentStatus = row.original.status

      const handleStatusChange = (value: string) => {
        const updated: SupportMessage = {
          ...row.original,
          status: value as any
        }
        handleUpdate(updated)
      }

      return (
        <Select modal={false} onValueChange={handleStatusChange} value={currentStatus}>
          <SelectTrigger className={`w-[130px] text-xs h-8 font-semibold rounded-full border ${
            currentStatus === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-900/50 dark:text-yellow-400' :
            currentStatus === 'Processing' ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400' :
            'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400'
          }`}>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="text-xs" position="popper">
            <SelectItem value="Pending">Chờ xử lý</SelectItem>
            <SelectItem value="Processing">Đang xử lý</SelectItem>
            <SelectItem value="Resolved">Đã phản hồi</SelectItem>
          </SelectContent>
        </Select>
      )
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setSupportIdEdit } = useContext(SupportTableContext)
      const openDetail = () => {
        setSupportIdEdit(row.original.id)
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
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openDetail}>Xem & Trả lời</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

const PAGE_SIZE = 10
export default function SupportTable() {
  const router = useRouter()
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [supportIdEdit, setSupportIdEdit] = useState<string | undefined>()
  
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: supportListRes } = useGetSupportList()
  const data = supportListRes?.payload?.data || []
  const updateSupportMutation = useUpdateSupportMutation()

  const handleUpdate = async (updated: SupportMessage) => {
    try {
      await updateSupportMutation.mutateAsync({
        id: updated.id,
        status: updated.status,
        replies: updated.replies
      })
      toast.success('Cập nhật trạng thái thành công!')
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại!')
    }
  }

  const handleDelete = (id: string) => {
    toast.info('Tính năng xoá góp ý chưa được hỗ trợ trên hệ thống.')
  }

  // Reset page to 1 when search query or status filter changes
  useEffect(() => {
    if (page !== 1) {
      const params = new URLSearchParams(searchParam.toString())
      params.set('page', '1')
      router.replace(`/manage/supports?${params.toString()}`)
    }
  }, [searchQuery, statusFilter])

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [data, statusFilter, searchQuery])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE
  })

  const table = useReactTable({
    data: filteredData,
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
    autoResetPageIndex: false,
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
    <SupportTableContext.Provider value={{ supportIdEdit, setSupportIdEdit, handleDelete, handleUpdate } as any}>
      <div className='w-full'>
        <ViewSupport id={supportIdEdit} setId={setSupportIdEdit} onUpdate={handleUpdate} />
        
        <div className='flex flex-wrap items-center gap-4 py-4'>
          <Input
            placeholder='Tìm theo tên, email, nội dung...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='max-w-xs'
          />

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trạng thái:</span>
            <Select modal={false} onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="All">Tất cả</SelectItem>
                <SelectItem value="Pending">Chờ xử lý</SelectItem>
                <SelectItem value="Processing">Đang xử lý</SelectItem>
                <SelectItem value="Resolved">Đã phản hồi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='ml-auto flex items-center gap-4'>
            <DataTableViewOptions table={table} />
          </div>
        </div>

        <div className='rounded-md border'>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
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
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Không tìm thấy yêu cầu hỗ trợ nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{filteredData.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/supports'
            />
          </div>
        </div>
      </div>
    </SupportTableContext.Provider>
  )
}
