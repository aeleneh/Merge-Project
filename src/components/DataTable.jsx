import React, { useEffect, useState } from 'react'
import { flexRender, 
    getCoreRowModel, 
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel, 
    getFilteredRowModel,
} from '@tanstack/react-table'
import {
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow,
} from '@/components/ui/table'
import MergerModal from './MergerModal'
import { useNavigate } from 'react-router-dom'

const DataTable = () => {
    const navigate = useNavigate()
    const [globalFilter, setGlobalFilter] = useState("")
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMergerModal, setShowMergerModal] = useState(false)

    const columns = [
        {
            id: "select",
            header: () => null,
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-black cursor-pointer"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={(e) => row.toggleSelected(!!e.target.checked)}
                    aria-label="Select row"
                />
            ),
        },
        {
            id: "sn",
            header: "S/N",
            cell: ({ row, table }) => {
                const sortedRows = table.getRowModel().rows
                const globalIndex = sortedRows.findIndex(r => r.id === row.id)
                const { pageIndex, pageSize } = table.getState().pagination
                return (
                    <span className="text-gray-400 font-mono text-xs">
                        {String(pageIndex * pageSize + globalIndex + 1).padStart(2, '0')}
                    </span>
                )
            },
        },
        {
            header: "Name",
            id: "name",
            accessorFn: (row) => `${row.name.first} ${row.name.last}`,
            cell: ({ row }) => {
                const user = row.original
                const fullName = `${user.name.first} ${user.name.last}`
                const avatarUrl = user.picture.thumbnail
                return (
                    <div className="flex items-center gap-3">
                        <img
                            src={avatarUrl}
                            alt={fullName}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{fullName}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ getValue }) => (
                <span className="text-gray-500 text-sm">{getValue()}</span>
            )
        },
        {
            accessorKey: "gender",
            header: "Gender",
            cell: ({ getValue }) => {
                const gender = getValue()
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${gender === 'male'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-pink-50 text-pink-700'
                        }`}>
                        {gender}
                    </span>
                )
            }
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ getValue }) => (
                <span className="text-gray-500 text-sm font-mono">{getValue()}</span>
            )
        },
        {
            accessorKey: "location.country",
            header: "Country",
            cell: ({ getValue }) => (
                <span className="text-gray-700 text-sm">{getValue()}</span>
            )
        },
        {
            accessorKey: "registered.date",
            header: "Date Registered",
            cell: ({ getValue }) => (
                <span className="text-gray-400 text-sm">
                    {new Date(getValue()).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    })}
                </span>
            )
        },
    ]

   useEffect(() => {
    const fetchData = async () => {
        try {
            
            const saved = localStorage.getItem('users')
            if (saved) {
                setData(JSON.parse(saved))
                setLoading(false)
                return
            }

           
            const response = await fetch('https://randomuser.me/api?results=50&seed=users')
            const result = await response.json()
            setData(result.results)
        } catch (e) {
            console.log('Error fetching data:', e)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
}, [])
    const table = useReactTable({
        data,
        columns,
        state: { rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        enableRowSelection: true,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    const selectedCount = Object.keys(rowSelection).length

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading users...</p>
            </div>
        </div>
    )

    const handleMerger = () => {
        const selectedRows = table.getSelectedRowModel().rows
        if (selectedRows.length !== 2) {
            alert("Please select exactly 2 users to merge.")
            return
        }
        setShowMergerModal(true)
    }

    const handleConfirmMerge = (user1, user2) => {
        const mergedUser = {
            ...user1,
            name: { first: user1.name.first, last: user2.name.last },
            email: user1.email,
            phone: user2.phone,
            picture: user1.picture,
            location: user1.location,
            registered: user1.registered,
            dob: user1.dob,
            login: { uuid: crypto.randomUUID() },
        }

            const selectedIds = new Set(
            table.getSelectedRowModel().rows.map(r => r.original.login.uuid)
            )
            const remaining = data.filter(u => !selectedIds.has(u.login.uuid))
            const newData = [mergedUser, ...remaining]

            setData(newData)


            localStorage.setItem('users', JSON.stringify(newData))

            setRowSelection({})
            setShowMergerModal(false)
            navigate('/merged-user', { state: { mergedUser } })
        }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Header */}
                <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                {table.getFilteredRowModel().rows.length} total users
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={globalFilter ?? ""}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
                                />
                            </div>

                            {/* Merge button */}
                            <button
                                onClick={handleMerger}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                                    ${selectedCount === 2
                                        ? 'bg-black text-white hover:bg-gray-800 shadow-sm'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                disabled={selectedCount !== 2}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Merge Users
                                {selectedCount === 2 && (
                                    <span className="bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        2
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Selection banner */}
                    {selectedCount > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2">
                            <span className="w-2 h-2 rounded-full bg-black inline-block" />
                            {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
                            {selectedCount !== 2 && (
                                <span className="text-gray-400">— select exactly 2 to merge</span>
                            )}
                            <button
                                onClick={() => setRowSelection({})}
                                className="ml-auto text-xs text-gray-400 hover:text-black transition"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-gray-50 hover:bg-gray-50">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3"
                                        >
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className={`transition-colors border-b border-gray-50 hover:bg-gray-50
                                            ${row.getIsSelected() ? 'bg-gray-50' : ''}`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-6 py-3.5">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-gray-400">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-4 border-t border-gray-100">

                    {/* Page size */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value))
                                table.setPageIndex(0)
                            }}
                            className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                        >
                            {[10, 20, 30, 50].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    {/* Page info + buttons */}
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {table.getPageOptions().map((pageIndex) => (
                                <button
                                    key={pageIndex}
                                    onClick={() => table.setPageIndex(pageIndex)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                        ${table.getState().pagination.pageIndex === pageIndex
                                            ? 'bg-black text-white shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageIndex + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Merger Modal */}
            {showMergerModal && (
                <MergerModal
                    users={table.getSelectedRowModel().rows.map(r => r.original)}
                    onClose={() => setShowMergerModal(false)}
                    onConfirm={handleConfirmMerge}
                />
            )}
        </div>
    )
}

export default DataTable