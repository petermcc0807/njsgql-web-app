/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect, RefObject, ReactElement } from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { ChevronDown } from 'lucide-react';

import { useLazyQuery } from '@apollo/client/react';

import Book from '../../../lib/types';
import GET_BOOKS from '../../../lib/queries';

const columns: ColumnDef<Book>[] =
[
    {
        id: 'select',

        header: ({ table }) => (
            <Checkbox checked={ table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate') }
                      onCheckedChange={ (checked) => table.toggleAllPageRowsSelected(!!checked) } />
        ),

        cell: ({ row }) => (
            <Checkbox checked={ row.getIsSelected() }
                      onCheckedChange={ (checked) => row.toggleSelected(!!checked) } />
        ),

        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'title',

        accessorFn: (row) => row.title,

        header: 'Title',

        cell: ({ row }) => (
            <div className="capitalize">{ row.getValue('title') }</div>
        )
    },
    {
        accessorKey: 'author',

        accessorFn: (row) => row.author,

        header: 'Author',

        cell: ({ row }) => (
            <div className="capitalize">{ row.getValue('author') }</div>
        )
    },
    {
        accessorKey: 'isbn',

        accessorFn: (row) => row.isbn,

        header: 'ISBN',

        cell: ({ row }) => (
            <div className="capitalize">{ row.getValue('isbn') }</div>
        )
    }
];

export default function Books()
{
    const [ books, setBooks ] = useState<Array<Book>>(Array<Book>());

    const [ getBooks, { loading, error, data }] = useLazyQuery(GET_BOOKS);

    const useEffectCalled: RefObject<boolean> = useRef(false);

    useEffect(() =>
    {
        if (useEffectCalled.current === false)
        {
            useEffectCalled.current = true;

            getBooks();
        }
        else
        {
            if (data)
            {
                const books = (data as any).books as Array<Book>;

                setBooks(books);
            }
        }
    }, [ setBooks, getBooks, data ]);

    const [ sorting, setSorting ] = useState<SortingState>([ ]);
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([ ]);
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>({ });
    const [ rowSelection, setRowSelection ] = useState({ });

    const table = useReactTable({
        data: books,
        columns: columns,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        },

        meta: { },

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection
    });

    if (loading)
        return null;

    if (error)
        return null;

    const jsx: ReactElement =   <div className="w-full">
                                    <div className="flex items-center py-4">
                                        <Input className="max-w-sm"
                                               placeholder="Filter Title..."
                                               value={ (table.getColumn('title')?.getFilterValue() as string) ?? '' }
                                               onChange={ (event) => table.getColumn('title')?.setFilterValue(event.target.value) } />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className="ml-auto" variant="outline">Columns <ChevronDown /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {
                                                    table.getAllColumns()
                                                          .filter((column) => column.getCanHide())
                                                          .map((column) => {
                                                            return (
                                                                <DropdownMenuCheckboxItem key={ column.id }
                                                                                          className="capitalize"
                                                                                          checked={ column.getIsVisible() }
                                                                                          onCheckedChange={ (value) => column.toggleVisibility(!!value) }>
                                                                    { column.id }
                                                                </DropdownMenuCheckboxItem>
                                                            )
                                                        })
                                                }
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="overflow-hidden rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                {
                                                    table.getHeaderGroups().map((headerGroup) => (
                                                        <TableRow key={ headerGroup.id }>
                                                            {
                                                                headerGroup.headers.map((header) => {
                                                                    return (
                                                                        <TableHead key={ header.id }>
                                                                            {
                                                                                header.isPlaceholder
                                                                                ? null
                                                                                : flexRender(header.column.columnDef.header, header.getContext())
                                                                            }
                                                                        </TableHead>
                                                                    )
                                                                })
                                                            }
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    table.getRowModel().rows?.length ? (
                                                        table.getRowModel().rows.map((row) => (
                                                            <TableRow key={ row.id } data-state={ row.getIsSelected() && 'selected' }>
                                                                {
                                                                    row.getVisibleCells().map((cell) => (
                                                                        <TableCell key={ cell.id }>
                                                                            {
                                                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                                                            }
                                                                        </TableCell>
                                                                    ))
                                                                }
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell className="h-24 text-center" colSpan={ columns.length }>No books found</TableCell>
                                                        </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 py-4">
                                        <div className="text-muted-foreground flex-1 text-sm">
                                            { table.getFilteredSelectedRowModel().rows.length } of{ ' ' }
                                            { table.getFilteredRowModel().rows.length } row(s) selected
                                        </div>
                                        <div className="space-x-2">
                                            <Button variant="outline" size="sm" onClick={ (event) => table.previousPage() } disabled={ !table.getCanPreviousPage() }>Previous</Button>
                                            <Button variant="outline" size="sm" onClick={ (event) => table.nextPage() } disabled={ !table.getCanNextPage() }>Next</Button>
                                        </div>
                                    </div>
                                </div>

    return jsx;
};
