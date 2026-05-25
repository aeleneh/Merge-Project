import React from 'react'

const UserCard = ({ user, label }) => (
    <div className="flex-1 border border-gray-200 rounded-xl p-6 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">{label}</p>

        <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-teal-400 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {user.name.first[0]}
            </div>
            <div>
                <h2 className="text-lg font-bold uppercase">
                    {user.name.first} {user.name.last}
                </h2>
                <p className="text-xs text-gray-400">
                    Registered: {new Date(user.registered.date).toLocaleDateString()}
                </p>
                <span className="text-xs text-teal-500 font-medium">+ Created</span>
            </div>
        </div>

        <div className="space-y-3">
            {[
                { label: 'First Name', value: user.name.first },
                { label: 'Last Name', value: user.name.last },
                { label: 'Email', value: user.email },
                { label: 'Gender', value: user.gender },
                { label: 'Phone', value: user.phone },
                { label: 'Country', value: user.location.country },
                { label: 'Date Registered', value: new Date(user.registered.date).toLocaleDateString() },
            ].map(({ label, value }) => (
                <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold capitalize">{value}</p>
                </div>
            ))}
        </div>
    </div>
)

const MergerModal = ({ users, onClose, onConfirm }) => {
    const [user1, user2] = users

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg font-bold"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Merge Entities</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Merge two different users to create a new one
                    </p>
                </div>

                {/* Cards */}
                <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
                    <UserCard user={user1} label="Primary Entity" />

                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                            ⇄
                        </div>
                    </div>

                    <UserCard user={user2} label="Secondary Entity" />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="border border-black rounded-md px-6 py-2 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(user1, user2)}
                        className="bg-black text-white rounded-md px-6 py-2 text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MergerModal