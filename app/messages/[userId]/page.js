import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MessageThread from "@/components/messages/MessageThread"
import MessageForm from "@/components/messages/MessageForm"

export default async function MessageThreadPage({ params }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const awaitedParams = await params
  const otherUserId = awaitedParams.userId

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!currentUser) {
    redirect("/sign-in")
  }

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
  })

  if (!otherUser) {
    redirect("/messages")
  }

  // Get messages between current user and other user
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: currentUser.id,
          receiverId: otherUser.id,
        },
        {
          senderId: otherUser.id,
          receiverId: currentUser.id,
        },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
    orderBy: { createdAt: "asc" },
  })

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      senderId: otherUser.id,
      receiverId: currentUser.id,
      read: false,
    },
    data: {
      read: true,
    },
  })

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-primary-50 px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <a
                    href="/messages"
                    className="text-neutral-600 hover:text-neutral-800 transition-colors"
                    title="Back to messages"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </a>
                  <div>
                    <h1 className="text-xl font-semibold text-neutral-900">{otherUser.name}</h1>
                    <p className="text-sm text-neutral-600">{otherUser.email}</p>
                  </div>
                </div>
                <div className="text-sm text-neutral-500">{messages.length} messages</div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-6" id="messages-container">
              <MessageThread messages={messages} currentUserId={currentUser.id} />
            </div>

            <div className="border-t border-neutral-200 p-6">
              <MessageForm currentUserId={currentUser.id} otherUserId={otherUser.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
