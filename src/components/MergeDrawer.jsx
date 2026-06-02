import React, { useState } from 'react'

const FIELDS = [
    { key: 'firstName', label: 'First Name', get: u => u.name.first },
    { key: 'lastName', label: 'Last Name', get: u => u.name.last },
    { key: 'email', label: 'Email', get: u => u.email },
    { key: 'gender', label: 'Gender', get: u => u.gender },
    { key: 'phone', label: 'Phone', get: u => u.phone },
    { key: 'country', label: 'Country', get: u => u.location.country },
    { key: 'dob', label: 'Date of Birth', get: u => u.dob?.date ? new Date(u.dob.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
    { key: 'registered', label: 'Date Registered', get: u => new Date(u.registered.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
]

const SearchInput = ({ label, value, onChange, results, onSelect, placeholder }) => {
    const [showResults, setShowResults] = useState(false)

    return (
        <div className="flex-1 relative">
            <label className="text-xs text-gray-400 mb-1 block">{label}</label>
            <input
                value={value}
                onChange={e => {
                    onChange(e.target.value)
                    setShowResults(true)
                }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {results.map(user => (
                        <button
                            key={user.login.uuid}
                            onMouseDown={() => {
                                onSelect(user)
                                setShowResults(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                        >
                            <img
                                src={user.picture.thumbnail}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {user.name.first} {user.name.last}
                                </p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const UserCard = ({ user, label, selectedFields, onToggleField, isSecondary }) => (
    <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-xs text-gray-400 mb-4">{label}</p>

        {user ? (
            <>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-teal-300 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                        {user.name.first[0]}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold uppercase tracking-wide">
                            {user.name.first} {user.name.last}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Registered: {new Date(user.registered.date).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                        <span className="text-xs text-teal-500 font-medium">+ Created</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 mb-4" />

                <div className="space-y-3">
                    {FIELDS.map(({ key, label, get }) => {
                        const isSelected = selectedFields.includes(key)
                        return (
                            <div
                                key={key}
                                onClick={() => isSecondary && onToggleField(key)}
                                className={`p-2 rounded-lg transition-all
                                    ${isSecondary ? 'cursor-pointer' : ''}
                                    ${isSecondary && isSelected
                                        ? 'bg-teal-50 border border-teal-300'
                                        : isSecondary
                                            ? 'hover:bg-gray-50 border border-transparent'
                                            : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                        <p className="text-sm font-semibold">{get(user)}</p>
                                    </div>
                                    {isSecondary && (
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0
                                            ${isSelected
                                                ? 'bg-teal-500 border-teal-500'
                                                : 'border-gray-300'
                                            }`}
                                        >
                                            {isSelected && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm">Search for a user above</p>
            </div>
        )}
    </div>
)

const MergeDrawer = ({ users: initialUsers, allUsers, onClose, onConfirm }) => {
    const [user1, setUser1] = useState(initialUsers[0])
    const [user2, setUser2] = useState(initialUsers[1])
    const [search1, setSearch1] = useState(`${initialUsers[0].name.first} ${initialUsers[0].name.last}`)
    const [search2, setSearch2] = useState(`${initialUsers[1].name.first} ${initialUsers[1].name.last}`)
    const [selectedFields, setSelectedFields] = useState([])

    const getResults = (query, excludeUser) => {
        if (!query || query.length < 1) return []
        return allUsers
            .filter(u =>
                u.login.uuid !== excludeUser?.login.uuid &&
                `${u.name.first} ${u.name.last}`.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
    }

    const handleSelect1 = (user) => {
        setUser1(user)
        setSearch1(`${user.name.first} ${user.name.last}`)
    }

    const handleSelect2 = (user) => {
        setUser2(user)
        setSearch2(`${user.name.first} ${user.name.last}`)
        setSelectedFields([])
    }

    const handleSwap = () => {
        setUser1(user2)
        setUser2(user1)
        setSearch1(`${user2.name.first} ${user2.name.last}`)
        setSearch2(`${user1.name.first} ${user1.name.last}`)
        setSelectedFields([])
    }

    const handleToggleField = (key) => {
        setSelectedFields(prev =>
            prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
        )
    }

    const handleConfirm = () => {
        if (!user1 || !user2) return

        const merged = {
            ...user1,
            name: {
                first: selectedFields.includes('firstName') ? user2.name.first : user1.name.first,
                last: selectedFields.includes('lastName') ? user2.name.last : user1.name.last,
            },
            email: selectedFields.includes('email') ? user2.email : user1.email,
            gender: selectedFields.includes('gender') ? user2.gender : user1.gender,
            phone: selectedFields.includes('phone') ? user2.phone : user1.phone,
            location: selectedFields.includes('country') ? user2.location : user1.location,
            dob: selectedFields.includes('dob') ? user2.dob : user1.dob,
            registered: selectedFields.includes('registered') ? user2.registered : user1.registered,
            login: { uuid: crypto.randomUUID() },
        }

        onConfirm(user1, user2, merged)
    }

    const results1 = getResults(search1, user2)
    const results2 = getResults(search2, user1)

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

                    {/* Header */}
                    <div className="flex items-start justify-between px-8 pt-8 pb-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">Merge Entities</h1>
                                <span className="text-sm text-teal-500 font-medium cursor-pointer hover:underline">
                                    How does it work?
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                Merge two different users to create a new one
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-black transition text-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Search inputs */}
                    <div className="flex items-end gap-3 px-8 pb-6">
                        <SearchInput
                            label="Primary Entity"
                            value={search1}
                            onChange={setSearch1}
                            results={results1}
                            onSelect={handleSelect1}
                            placeholder="Search by name..."
                        />
                        <div className="pb-1.5">
                            <button
                                onClick={handleSwap}
                                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-teal-300 hover:text-teal-500 transition"
                                title="Swap entities"
                            >
                                ⇄
                            </button>
                        </div>
                        <SearchInput
                            label="Secondary Entity"
                            value={search2}
                            onChange={setSearch2}
                            results={results2}
                            onSelect={handleSelect2}
                            placeholder="Search by name..."
                        />
                    </div>

                    {/* Helper tip */}
                    {user2 && (
                        <div className="mx-8 mb-4 px-4 py-2.5 bg-teal-50 border border-teal-100 rounded-lg">
                            <p className="text-xs text-teal-700">
                                <span className="font-semibold">Tip:</span> Click fields on the Secondary Entity card to override those values in the Primary Entity.
                                {selectedFields.length > 0 && (
                                    <span className="ml-1 font-semibold">
                                        {selectedFields.length} field{selectedFields.length > 1 ? 's' : ''} selected to override.
                                    </span>
                                )}
                            </p>
                        </div>
                    )}

                    {/* User Cards */}
                    <div className="flex flex-col md:flex-row gap-4 px-8 pb-6">
                        <UserCard
                            user={user1}
                            label="Primary Entity"
                            selectedFields={selectedFields}
                            onToggleField={handleToggleField}
                            isSecondary={false}
                        />
                        <UserCard
                            user={user2}
                            label="Secondary Entity"
                            selectedFields={selectedFields}
                            onToggleField={handleToggleField}
                            isSecondary={true}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="border border-gray-200 rounded-lg px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!user1 || !user2}
                            className="bg-teal-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-teal-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MergeDrawer