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
import AddMenu from '@/app/manage/menus/add-menu'
import EditMenu from '@/app/manage/menus/edit-menu'
import { useGetMenuList, useDeleteMenuMutation } from '@/queries/useMenu'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

type MenuItemType = {
  _id: string
  menu_name: string
  description?: string
  createdAt?: string
}

const MenuTableContext = createContext<{
  setMenuIdEdit: (value: string | undefined) => void
  menuIdEdit: string | undefined
  menuDelete: MenuItemType | null
  setMenuDelete: (value: MenuItemType | null) => void
}>({
  setMenuIdEdit: (value: string | undefined) => { },
  menuIdEdit: undefined,
  menuDelete: null,
  setMenuDelete: (value: MenuItemType | null) => { }
})

export const columns: ColumnDef<MenuItemType>[] = [
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
    accessorKey: 'menu_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên danh mục" />
    ),
    cell: ({ row }) => <span className="font-semibold text-primary">{row.original.menu_name}</span>
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => <span className="text-sm font-light">{row.original.description || '-'}</span>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setMenuIdEdit, setMenuDelete } = useContext(MenuTableContext)
      const openEditMenu = () => {
        setMenuIdEdit(row.original._id)
      }

      const openDeleteMenu = () => {
        setMenuDelete(row.original)
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
            <DropdownMenuItem onClick={openEditMenu}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteMenu} className="text-destructive focus:bg-destructive/10">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteMenu({
  menuDelete,
  setMenuDelete,
  onConfirm
}: {
  menuDelete: MenuItemType | null
  setMenuDelete: (value: MenuItemType | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(menuDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setMenuDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa danh mục này?</AlertDialogTitle>
          <AlertDialogDescription>
            Danh mục <span className='bg-foreground text-primary-foreground rounded px-1 font-mono text-xs'>{menuDelete?.menu_name}</span> sẽ bị xóa vĩnh viễn khỏi danh sách hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const PAGE_SIZE = 10
export default function MenuTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [menuIdEdit, setMenuIdEdit] = useState<string | undefined>()
  const [menuDelete, setMenuDelete] = useState<MenuItemType | null>(null)

  const { data: menuListRes, isLoading } = useGetMenuList()
  const data = menuListRes?.payload?.data || []

  const deleteMenuMutation = useDeleteMenuMutation()

  const handleDeleteMenu = async () => {
    if (!menuDelete) return
    try {
      const result = await deleteMenuMutation.mutateAsync(menuDelete._id)
      toast.success(result.payload.message || 'Xóa danh mục thành công!')
      setMenuDelete(null)
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
    <MenuTableContext.Provider value={{ menuIdEdit, setMenuIdEdit, menuDelete, setMenuDelete }}>
      <div className='w-full'>
        <EditMenu id={menuIdEdit} setId={setMenuIdEdit} />
        <AlertDialogDeleteMenu
          menuDelete={menuDelete}
          setMenuDelete={setMenuDelete}
          onConfirm={handleDeleteMenu}
        />
        <div className='flex items-center gap-4 py-4'>
          <Input
            placeholder='Tìm kiếm danh mục...'
            value={(table.getColumn('menu_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('menu_name')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddMenu />
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Đang tải danh sách danh mục...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
                    Không tìm thấy danh mục nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='text-xs text-muted-foreground py-4 flex-1'>
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/menus'
            />
          </div>
        </div>
      </div>
    </MenuTableContext.Provider>
  )
}
