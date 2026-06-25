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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import AutoPagination from '@/components/auto-pagination'
import { useEffect, useState, useMemo, createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { DataTableViewOptions } from '@/components/data-table-view-options'
import AddProducts from '@/app/manage/products/add-product'
import EditProduct from '@/app/manage/products/edit-product'
import { ProductListResType } from '@/schemaValidations/product.schema'
import { useProductListQuery, useDeleteProductMutation } from '@/queries/useProduct'
import { toast } from 'sonner'
import { formatCurrency, handleErrorApi } from '@/lib/utils'

type ProductItem = ProductListResType['data'][0]

const ProductTableContext = createContext<{
  setProductIdEdit: (value: string | undefined) => void
  productIdEdit: string | undefined
  productDelete: ProductItem | null
  setProductDelete: (value: ProductItem | null) => void
}>({
  setProductIdEdit: (value: string | undefined) => { },
  productIdEdit: undefined,
  productDelete: null,
  setProductDelete: (value: ProductItem | null) => { }
})

export const columns: ColumnDef<ProductItem>[] = [
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
    accessorKey: 'image',
    header: 'Ảnh',
    cell: ({ row }) => (
      <Avatar className="w-10 h-10 rounded object-cover border border-charcoal/10">
        <AvatarImage src={row.original.image || ''} alt={row.original.product_name} />
        <AvatarFallback className="rounded-none">{row.original.product_name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    )
  },
  {
    accessorKey: 'product_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên món" />
    ),
  },
  {
    accessorKey: 'menu_name',
    header: 'Menu'
  },
  {
    accessorKey: 'price',
    header: 'Giá',
    cell: ({ row }) => <span>{formatCurrency(row.original.price)}</span>
  },
  {
    accessorKey: 'size',
    header: 'Size'
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          status === 'Available' ? 'bg-green-100 text-green-800' :
          status === 'Unavailable' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status === 'Available' ? 'Có sẵn' :
           status === 'Unavailable' ? 'Hết hàng' : 'Ẩn'}
        </span>
      )
    }
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => <span className="max-w-[200px] truncate block">{row.original.description}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setProductIdEdit, setProductDelete } = useContext(ProductTableContext)
      const openEditProduct = () => {
        setProductIdEdit(row.original._id)
      }

      const openDeleteProduct = () => {
        setProductDelete(row.original)
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
            <DropdownMenuItem onClick={openEditProduct}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteProduct}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeleteProduct({
  productDelete,
  setProductDelete,
  onConfirm
}: {
  productDelete: ProductItem | null
  setProductDelete: (value: ProductItem | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(productDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setProductDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món <span className='bg-primary/10 text-primary rounded px-1.5 py-0.5 font-semibold'>{productDelete?.product_name}</span> sẽ bị xóa vĩnh viễn.
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
export default function ProductTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [productIdEdit, setProductIdEdit] = useState<string | undefined>()
  const [productDelete, setProductDelete] = useState<ProductItem | null>(null)

  const { data: productListRes, isLoading } = useProductListQuery()
  const data = productListRes?.payload?.data || []

  const deleteProductMutation = useDeleteProductMutation()

  const handleDeleteProduct = async () => {
    if (!productDelete) return
    try {
      const result = await deleteProductMutation.mutateAsync(productDelete._id)
      toast.success(result.payload.message || 'Xóa món ăn thành công!')
      setProductDelete(null)
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
    <ProductTableContext.Provider value={{ productIdEdit, setProductIdEdit, productDelete, setProductDelete }}>
      <div className='w-full'>
        <EditProduct id={productIdEdit} setId={setProductIdEdit} />
        <AlertDialogDeleteProduct
          productDelete={productDelete}
          setProductDelete={setProductDelete}
          onConfirm={handleDeleteProduct}
        />
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc tên món ăn'
            value={(table.getColumn('product_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('product_name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddProducts />
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
                    Không có sản phẩm nào.
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
              pathname='/manage/products'
            />
          </div>
        </div>
      </div>
    </ProductTableContext.Provider>
  )
}
