"use client"

import { useEffect, useRef, useState } from "react"

export default function MessageThread({ messages, currentUserId }) {
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [prevMessageCount, setPrevMessageCount] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    // On initial load, don't auto-scroll to prevent unwanted scrolling
    if (isInitialLoad && messages.length > 0) {
      setIsInitialLoad(false)
      setPrevMessageCount(messages.length)
      // Only scroll to bottom if user manually requests it or it's the first time
      return
    }

    // Only auto-scroll if a new message is added and user is near bottom
    if (messages.length > prevMessageCount && shouldAutoScroll && !isInitialLoad) {
      setTimeout(() => scrollToBottom("smooth"), 100)
    }
    setPrevMessageCount(messages.length)
  }, [messages, shouldAutoScroll, prevMessageCount, isInitialLoad])

  // Check if user is near bottom when they scroll
  useEffect(() => {
    const container = document.getElementById('messages-container')
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50
      setShouldAutoScroll(isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const formatMessageTime = (date) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diffInHours = (now - messageDate) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })
    } else {
      return messageDate.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    }
  }

  const groupMessagesByDate = (messages) => {
    const groups = []
    let currentGroup = null

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString()

      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: [message],
        }
        groups.push(currentGroup)
      } else {
        currentGroup.messages.push(message)
      }
    })

    return groups
  }

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString)
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (dateString === today) return "Today"
    if (dateString === yesterday) return "Yesterday"
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-neutral-500">No messages yet. Start the conversation!</p>
        </div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="space-y-6" ref={containerRef}>
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="flex justify-center mb-4">
            <span className="bg-neutral-100 text-neutral-600 text-xs px-3 py-1 rounded-full">
              {formatDateHeader(group.date)}
            </span>
          </div>

          <div className="space-y-4">
            {group.messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId

              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-lg ${isCurrentUser ? "order-2" : "order-1"}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isCurrentUser
                          ? "bg-primary-600 text-white rounded-br-md"
                          : "bg-neutral-100 text-neutral-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <div className={`mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                      <span className="text-xs text-neutral-500">{formatMessageTime(message.createdAt)}</span>
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-neutral-500">{message.read ? "Read" : "Delivered"}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
