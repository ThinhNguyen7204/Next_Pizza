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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import AutoPagination from '@/components/auto-pagination'
import { useEffect, useState, useMemo, createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { DataTableViewOptions } from '@/components/data-table-view-options'
import EditOrder from '@/app/manage/orders/edit-order'
import { OrderListResType } from '@/schemaValidations/order.schema'
import { useGetOrderList, useUpdateOrderMutation, useDeleteOrderMutation } from '@/queries/useOrder'
import { useAppStore } from '@/components/app-provider'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatCurrency, handleErrorApi, getVietnameseOrderStatus } from '@/lib/utils'
import { OrderStatus } from '@/constants/type'

type OrderItem = OrderListResType['data'][0]

const OrderTableContext = createContext<{
  setOrderIdEdit: (value: string | undefined) => void
  orderIdEdit: string | undefined
  orderDelete: OrderItem | null
  setOrderDelete: (value: OrderItem | null) => void
}>({
  setOrderIdEdit: (value: string | undefined) => { },
  orderIdEdit: undefined,
  orderDelete: null,
  setOrderDelete: (value: OrderItem | null) => { }
})

export const columns: ColumnDef<OrderItem>[] = [
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
    accessorKey: 'customer_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khách hàng" />
    ),
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.customer_name || 'Khách hàng'}</span>
  },
  {
    accessorKey: 'order_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày đặt" />
    ),
    cell: ({ row }) => <span>{new Date(row.original.order_date).toLocaleString('vi-VN')}</span>
  },
  {
    accessorKey: 'delivery_type',
    header: 'Hình thức',
    cell: ({ row }) => (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${row.original.delivery_type === 'Delivery' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
        }`}>
        {row.original.delivery_type === 'Delivery' ? 'Giao tận nơi' : 'Nhận tại tiệm'}
      </span>
    )
  },
  {
    accessorKey: 'items',
    header: 'Sản phẩm',
    cell: ({ row }) => {
      const items = row.original.items || []
      const text = items.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ')
      return <span className="max-w-[200px] truncate block" title={text}>{text}</span>
    }
  },
  {
    accessorKey: 'finalPrice',
    header: 'Tổng tiền',
    cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.finalPrice)}</span>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: function StatusCell({ row }) {
      const updateOrderMutation = useUpdateOrderMutation()
      const currentStatus = row.original.status

      const handleStatusChange = async (value: string) => {
        try {
          await updateOrderMutation.mutateAsync({
            id: row.original._id,
            status: value
          })
          toast.success('Cập nhật trạng thái đơn hàng thành công!')
        } catch (error) {
          handleErrorApi({ error })
        }
      }

      return (
        <Select modal={false} onValueChange={handleStatusChange} value={currentStatus} disabled={updateOrderMutation.isPending}>
          <SelectTrigger className={`w-[140px] text-xs h-8 font-semibold rounded-full border ${currentStatus === OrderStatus.Pending ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-900/50 dark:text-yellow-400' :
              currentStatus === OrderStatus.Processing ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400' :
                currentStatus === OrderStatus.Shipping ? 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-400' :
                  currentStatus === OrderStatus.Delivered ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400' :
                    currentStatus === OrderStatus.Paid ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-900/50 dark:text-green-400 font-bold' :
                      'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400'
            }`}>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="text-xs" position="popper">
            <SelectItem value={OrderStatus.Pending}>Chờ xử lý</SelectItem>
            <SelectItem value={OrderStatus.Processing}>Đang chế biến</SelectItem>
            <SelectItem value={OrderStatus.Shipping}>Đang giao</SelectItem>
            <SelectItem value={OrderStatus.Delivered}>Đã giao hàng</SelectItem>
            <SelectItem value={OrderStatus.Paid}>Đã thanh toán</SelectItem>
            <SelectItem value={OrderStatus.Cancelled}>Đã huỷ</SelectItem>
          </SelectContent>
        </Select>
      )
    }
  },
  {
    accessorKey: 'address',
    header: 'Địa chỉ',
    cell: ({ row }) => <span className="max-w-[150px] truncate block" title={row.original.address || ''}>{row.original.address || '-'}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setOrderIdEdit, setOrderDelete } = useContext(OrderTableContext)
      const openEditOrder = () => {
        setOrderIdEdit(row.original._id)
      }

      const openDeleteOrder = () => {
        setOrderDelete(row.original)
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
            <DropdownMenuItem onClick={openEditOrder}>Chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteOrder}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeleteOrder({
  orderDelete,
  setOrderDelete,
  onConfirm
}: {
  orderDelete: OrderItem | null
  setOrderDelete: (value: OrderItem | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(orderDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setOrderDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa đơn hàng?</AlertDialogTitle>
          <AlertDialogDescription>
            Đơn hàng mã <span className='bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-semibold'>{orderDelete?._id}</span> sẽ bị xóa vĩnh viễn.
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
export default function OrderTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [orderIdEdit, setOrderIdEdit] = useState<string | undefined>()
  const [orderDelete, setOrderDelete] = useState<OrderItem | null>(null)

  const [statusFilter, setStatusFilter] = useState<string>('All')

  const queryParams = useMemo(() => {
    const params: any = {}
    if (statusFilter !== 'All') params.status = statusFilter
    return params
  }, [statusFilter])

  const { data: orderListRes, isLoading } = useGetOrderList(queryParams)
  const data = orderListRes?.payload?.data || []

  const deleteOrderMutation = useDeleteOrderMutation()
  const queryClient = useQueryClient()
  const socket = useAppStore((state) => state.socket)

  // Realtime Socket Sync
  useEffect(() => {
    if (!socket) return

    const handleNewOrder = (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.info(`Có đơn hàng mới từ khách: ${payload?.guestName || 'Ẩn danh'}!`, {
        description: `Mã đơn: ${payload?._id || ''}`
      })
    }

    const handleUpdateOrder = (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.info(`Đơn hàng ${payload?._id} được chuyển sang: ${getVietnameseOrderStatus(payload?.status)}`)
    }

    const handlePayment = (payload: any) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(`Đơn hàng ${payload?._id} đã được thanh toán thành công!`)
    }

    socket.on('new-order', handleNewOrder)
    socket.on('update-order', handleUpdateOrder)
    socket.on('payment', handlePayment)

    return () => {
      socket.off('new-order', handleNewOrder)
      socket.off('update-order', handleUpdateOrder)
      socket.off('payment', handlePayment)
    }
  }, [socket, queryClient])

  const handleDeleteOrder = async () => {
    if (!orderDelete) return
    try {
      const result = await deleteOrderMutation.mutateAsync(orderDelete._id)
      toast.success(result.payload.message || 'Xóa đơn hàng thành công!')
      setOrderDelete(null)
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
    <OrderTableContext.Provider value={{ orderIdEdit, setOrderIdEdit, orderDelete, setOrderDelete }}>
      <div className='w-full'>
        <EditOrder id={orderIdEdit} setId={setOrderIdEdit} />
        <AlertDialogDeleteOrder
          orderDelete={orderDelete}
          setOrderDelete={setOrderDelete}
          onConfirm={handleDeleteOrder}
        />
        <div className="text-muted-foreground flex-1 text-sm mb-4">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex flex-wrap items-center gap-4 py-4 border-b border-charcoal/10 mb-4'>
          {/* Tìm kiếm khách hàng */}
          <Input
            placeholder='Tìm kiếm khách hàng...'
            value={(table.getColumn('customer_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('customer_name')?.setFilterValue(event.target.value)}
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
                <SelectItem value={OrderStatus.Pending}>Chờ xử lý</SelectItem>
                <SelectItem value={OrderStatus.Processing}>Đang chế biến</SelectItem>
                <SelectItem value={OrderStatus.Shipping}>Đang giao</SelectItem>
                <SelectItem value={OrderStatus.Delivered}>Đã giao hàng</SelectItem>
                <SelectItem value={OrderStatus.Paid}>Đã thanh toán</SelectItem>
                <SelectItem value={OrderStatus.Cancelled}>Đã huỷ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='ml-auto flex items-center gap-4'>
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
                    Đang tải dữ liệu đơn hàng...
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
                    Không tìm thấy đơn hàng nào.
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
              pathname='/manage/orders'
            />
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  )
}
