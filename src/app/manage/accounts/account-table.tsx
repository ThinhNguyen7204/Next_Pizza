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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import AddAccount from '@/app/manage/accounts/add-account'
import EditAccount from '@/app/manage/accounts/edit-account'
import { AccountType } from '@/schemaValidations/account.schema'
import { useGetAccountList, useDeleteAccountMutation } from '@/queries/useAccount'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

const AccountTableContext = createContext<{
  setAccountIdEdit: (value: string | undefined) => void
  accountIdEdit: string | undefined
  accountDelete: AccountType | null
  setAccountDelete: (value: AccountType | null) => void
}>({
  setAccountIdEdit: (value: string | undefined) => { },
  accountIdEdit: undefined,
  accountDelete: null,
  setAccountDelete: (value: AccountType | null) => { }
})

export const columns: ColumnDef<AccountType>[] = [
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
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <Avatar className="w-8 h-8 rounded-full border border-charcoal/10 object-cover">
        <AvatarImage src={row.original.avatar || ''} alt={row.original.username} />
        <AvatarFallback>{row.original.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
    )
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên nhân viên" />
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Vai trò'
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setAccountIdEdit, setAccountDelete } = useContext(AccountTableContext)
      const openEditAccount = () => {
        setAccountIdEdit(row.original._id)
      }

      const openDeleteAccount = () => {
        setAccountDelete(row.original)
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
            <DropdownMenuItem onClick={openEditAccount}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteAccount}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

function AlertDialogDeleteAccount({
  accountDelete,
  setAccountDelete,
  onConfirm
}: {
  accountDelete: AccountType | null
  setAccountDelete: (value: AccountType | null) => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog
      open={Boolean(accountDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setAccountDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản nhân viên <span className='bg-primary/10 text-primary rounded px-1.5 py-0.5 font-semibold'>{accountDelete?.username}</span> sẽ bị xóa
            vĩnh viễn.
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
export default function AccountTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  const [accountIdEdit, setAccountIdEdit] = useState<string | undefined>()
  const [accountDelete, setAccountDelete] = useState<AccountType | null>(null)

  const { data: accountListRes, isLoading } = useGetAccountList()
  const data = accountListRes?.payload?.data || []

  const deleteAccountMutation = useDeleteAccountMutation()

  const handleDeleteAccount = async () => {
    if (!accountDelete) return
    try {
      const result = await deleteAccountMutation.mutateAsync(accountDelete._id)
      toast.success(result.payload.message || 'Xóa nhân viên thành công!')
      setAccountDelete(null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex])

  return (
    <AccountTableContext.Provider value={{ accountIdEdit, setAccountIdEdit, accountDelete, setAccountDelete }}>
      <div className='w-full'>
        <EditAccount id={accountIdEdit} setId={setAccountIdEdit} />
        <AlertDialogDeleteAccount
          accountDelete={accountDelete}
          setAccountDelete={setAccountDelete}
          onConfirm={handleDeleteAccount}
        />
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc tên nhân viên'
            value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-4'>
            <AddAccount />
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
                    Không tìm thấy nhân viên nào.
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
              pathname='/manage/accounts'
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
