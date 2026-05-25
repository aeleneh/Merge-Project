import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const MergedUserPage = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const user = state?.mergedUser

    if (!user) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">No merged user available.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-8">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-sm border border-black rounded-md px-4 py-2 hover:bg-gray-50 transition"
                >
                    ← Back
                </button>

                {/* Header */}
                <h1 className="text-3xl font-bold mb-1">Merged User</h1>
                <p className="text-sm text-gray-400 mb-8">Result of merging two entities</p>

                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-teal-400 flex items-center justify-center text-white text-2xl font-bold">
                        {user.name.first[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold uppercase">
                            {user.name.first} {user.name.last}
                        </h2>
                        <span className="text-xs text-teal-500 font-medium">+ Created</span>
                    </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { label: 'First Name', value: user.name.first },
                        { label: 'Last Name', value: user.name.last },
                        { label: 'Email', value: user.email },
                        { label: 'Gender', value: user.gender },
                        { label: 'Phone', value: user.phone },
                        { label: 'Country', value: user.location.country },
                        { label: 'Date of Birth', value: user.dob?.date ? new Date(user.dob.date).toLocaleDateString() : 'N/A' },
                        { label: 'Date Registered', value: new Date(user.registered.date).toLocaleDateString() },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-xs text-gray-400 mb-1">{label}</p>
                            <p className="text-sm font-semibold capitalize">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MergedUserPage