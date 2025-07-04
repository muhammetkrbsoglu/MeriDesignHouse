import Link from "next/link"

export default function UserList({ users = [], currentUserId }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">Mesaj gönderilebilecek başka kullanıcı yok.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/messages/${user.id}`}
          className="block p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-neutral-900">{user.name}</h3>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              {user.role === "admin" && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                  Admin
                </span>
              )}
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
