import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MessagesClient from "@/components/MessagesClient"

export default async function MessagesPage({ searchParams }) {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  let currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // If user doesn't exist in database, create them
  if (!currentUser) {
    
    try {
      const userData = sessionClaims || {}
      const email = userData.email || ""
      const firstName = userData.given_name || userData.first_name || ""
      const lastName = userData.family_name || userData.last_name || ""
      const name = userData.name || (firstName && lastName ? `${firstName} ${lastName}` : email.split("@")[0] || "İsimsiz Kullanıcı")
      
      currentUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          name: name,
          role: "user",
        },
      })
      
    } catch (error) {
      console.error("Error creating user:", error)
      redirect("/sign-in")
    }
  }

  const users = await prisma.user.findMany({
    where: {
      NOT: { id: currentUser.id },
      // If current user is not admin, only show admin users
      ...(currentUser.role !== "admin" && { role: "admin" })
    },
    orderBy: { name: "asc" },
  })

  // Get all conversations for the current user
  const conversations = await prisma.message.findMany({
    where: {
      OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
    },
    include: {
      sender: true,
      receiver: true,
    },
    orderBy: { createdAt: "desc" },
  })

  // Group conversations by the other user
  const conversationMap = new Map()

  conversations.forEach((message) => {
    const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId
    const otherUser = message.senderId === currentUser.id ? message.receiver : message.sender

    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, {
        id: message.id,
        otherUser: otherUser,
        content: message.content,
        createdAt: message.createdAt,
        read: message.read,
        senderId: message.senderId,
        receiverId: message.receiverId,
      })
    }
  })

  const uniqueConversations = Array.from(conversationMap.values())

  // Await searchParams before using its properties
  const awaitedSearchParams = await searchParams
  const fromContact = awaitedSearchParams?.from === "contact"

  return (
    <MessagesClient
      users={users}
      conversations={uniqueConversations}
      currentUser={currentUser}
      fromContact={fromContact}
      conversationId={awaitedSearchParams?.conversationId}
    />
  )
}

