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
import { useEffect, useState, createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { DataTableViewOptions } from '@/components/data-table-view-options'
import ViewSupport, { SupportMessage } from '@/app/manage/supports/view-support'
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

const initialMockSupports: SupportMessage[] = [
  {
    id: "SUP_101",
    name: "Khánh Minh",
    email: "customer@order.com",
    phone: "0901122334",
    message: "Tôi đặt pizza Pepperoni nhưng shipper giao nhầm sang Margherita. Mong nhà hàng kiểm tra và đổi lại giúp tôi.",
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Pending',
    replies: []
  },
  {
    id: "SUP_102",
    name: "Nguyễn Văn Nam",
    email: "customer2@order.com",
    phone: "0987654321",
    message: "Chất lượng bánh rất ngon, vỏ bánh giòn xốp đúng chuẩn lò nướng củi Ý. Tuy nhiên xốt cà chua hơi chua quá một chút.",
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'Processing',
    replies: [
      {
        sender: 'Admin',
        content: 'Chào anh Nam, cảm ơn đóng góp ý kiến của anh về xốt bánh. Nhà hàng sẽ lưu ý điều chỉnh độ chua cân bằng hơn ạ.',
        timestamp: new Date(Date.now() - 3600000 * 17).toLocaleString('vi-VN')
      }
    ]
  },
  {
    id: "SUP_103",
    name: "Trần Thị Thuỳ",
    email: "customer3@order.com",
    phone: "0912345678",
    message: "Chào nhà hàng, tôi muốn đặt bàn tiệc sinh nhật cho 15 người vào thứ 7 tuần này lúc 19h00. Nhà hàng có set menu hay chương trình ưu đãi gì không?",
    date: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'Resolved',
    replies: [
      {
        sender: 'Admin',
        content: 'Chào chị Thuỳ, nhà hàng đã liên hệ qua số điện thoại để tư vấn set menu tiệc nhóm và giữ bàn cho chị rồi nhé.',
        timestamp: new Date(Date.now() - 3600000 * 34).toLocaleString('vi-VN')
      }
    ]
  },
  {
    id: "SUP_104",
    name: "Lê Hoàng Long",
    email: "longle@gmail.com",
    phone: "0933445566",
    message: "Tính năng tích điểm đổi voucher của tiệm dùng rất hay. Hi vọng trong tương lai tiệm ra mắt thêm nhiều loại pizza nhân nhồi mới.",
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'Resolved',
    replies: []
  },
  {
    id: "SUP_105",
    name: "Phạm Minh Trang",
    email: "trangpham@yahoo.com",
    phone: "0955667788",
    message: "Hôm qua mình đặt hàng giao về hơi chậm 15 phút, bánh nguội một xíu. Mong lần sau quán giao hàng đúng hẹn hơn.",
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'Pending',
    replies: []
  }
]

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
    cell: ({ row }) => <span>{new Date(row.original.date).toLocaleString('vi-VN')}</span>
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
        <Select onValueChange={handleStatusChange} value={currentStatus}>
          <SelectTrigger className={`w-[130px] text-xs h-8 font-semibold rounded-full border ${
            currentStatus === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-900/50 dark:text-yellow-400' :
            currentStatus === 'Processing' ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400' :
            'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400'
          }`}>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="text-xs">
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
      const { setSupportIdEdit, handleDelete } = useContext(SupportTableContext)
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
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-destructive focus:bg-destructive/10">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

const PAGE_SIZE = 10
export default function SupportTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [supportIdEdit, setSupportIdEdit] = useState<string | undefined>()
  
  const [data, setData] = useState<SupportMessage[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Load from localStorage or populate defaults
  useEffect(() => {
    const stored = localStorage.getItem('la_pizzaia_supports')
    if (stored) {
      setData(JSON.parse(stored))
    } else {
      localStorage.setItem('la_pizzaia_supports', JSON.stringify(initialMockSupports))
      setData(initialMockSupports)
    }
  }, [])

  const handleUpdate = (updated: SupportMessage) => {
    setData((prev) => {
      const index = prev.findIndex(item => item.id === updated.id)
      if (index === -1) return prev
      const next = [...prev]
      next[index] = updated
      localStorage.setItem('la_pizzaia_supports', JSON.stringify(next))
      return next
    })
  }

  const handleDelete = (id: string) => {
    setData((prev) => {
      const next = prev.filter(item => item.id !== id)
      localStorage.setItem('la_pizzaia_supports', JSON.stringify(next))
      return next
    })
    toast.success('Xoá phiếu hỗ trợ thành công!')
  }

  // Filter & Search Logic
  const filteredData = data.filter(item => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

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
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
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
