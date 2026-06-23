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
import AddIngredient from '@/app/manage/ingredients/add-ingredient'
import EditIngredient from '@/app/manage/ingredients/edit-ingredient'
import { IngredientListResType } from '@/schemaValidations/ingredient.schema'
import { useGetIngredientList, useDeleteIngredientMutation } from '@/queries/useIngredient'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

type IngredientItem = IngredientListResType['data'][0]

const IngredientTableContext = createContext<{
  setIngredientIdEdit: (value: string | undefined) => void
  ingredientIdEdit: string | undefined
  ingredientDelete: IngredientItem | null
  setIngredientDelete: (value: IngredientItem | null) => void
}>({
  setIngredientIdEdit: () => { },
  ingredientIdEdit: undefined,
  ingredientDelete: null,
  setIngredientDelete: () => { }
})

export const columns: ColumnDef<IngredientItem>[] = [
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
      <DataTableColumnHeader column={column} title="Tên nguyên liệu" />
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Số lượng',
    cell: ({ row }) => <span>{row.original.quantity ?? '-'}</span>
  },
  {
    accessorKey: 'expiration_date',
    header: 'Ngày hết hạn',
    cell: ({ row }) => {
      const exp = row.original.expiration_date
      if (!exp) return <span>-</span>
      try {
        return <span>{new Date(exp).toLocaleDateString('vi-VN')}</span>
      } catch {
        return <span>{exp}</span>
      }
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setIngredientIdEdit, setIngredientDelete } = useContext(IngredientTableContext)
      const openEditIngredient = () => {
        setIngredientIdEdit(row.original._id)
      }

      const openDeleteIngredient = () => {
        setIngredientDelete(row.original)
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
            <DropdownMenuItem onClick={openEditIngredient}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteIngredient}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeleteIngredient({
  ingredientDelete,
  setIngredientDelete,
  onConfirm
}: {
  ingredientDelete: IngredientItem | null
  setIngredientDelete: (value: IngredientItem | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(ingredientDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setIngredientDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nguyên liệu?</AlertDialogTitle>
          <AlertDialogDescription>
            Nguyên liệu <span className='bg-foreground text-primary-foreground rounded px-1'>{ingredientDelete?.name}</span> sẽ bị xóa vĩnh viễn khỏi kho hàng.
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
export default function IngredientTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [ingredientIdEdit, setIngredientIdEdit] = useState<string | undefined>()
  const [ingredientDelete, setIngredientDelete] = useState<IngredientItem | null>(null)

  const { data: ingredientListRes, isLoading } = useGetIngredientList()
  const data = ingredientListRes?.payload?.data || []

  const deleteIngredientMutation = useDeleteIngredientMutation()

  const handleDeleteIngredient = async () => {
    if (!ingredientDelete) return
    try {
      const result = await deleteIngredientMutation.mutateAsync(ingredientDelete._id)
      toast.success(result.payload.message || 'Xóa nguyên liệu thành công!')
      setIngredientDelete(null)
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
    <IngredientTableContext.Provider value={{ ingredientIdEdit, setIngredientIdEdit, ingredientDelete, setIngredientDelete }}>
      <div className='w-full'>
        <EditIngredient id={ingredientIdEdit} setId={setIngredientIdEdit} />
        <AlertDialogDeleteIngredient
          ingredientDelete={ingredientDelete}
          setIngredientDelete={setIngredientDelete}
          onConfirm={handleDeleteIngredient}
        />
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc tên nguyên liệu'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddIngredient />
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
                    Không có nguyên liệu nào.
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
              pathname='/manage/ingredients'
            />
          </div>
        </div>
      </div>
    </IngredientTableContext.Provider>
  )
}
