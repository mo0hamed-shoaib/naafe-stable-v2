# Real-Time Chat System Implementation

## Overview
This document describes the real-time chat system implemented using Socket.IO for the Naafe service marketplace. The chat system enables 1-to-1 communication between seekers and providers after an offer is accepted.

## Architecture

### Database Schema

#### Conversations Collection
```javascript
{
  jobRequestId: ObjectId,        // Reference to JobRequest
  participants: {
    seeker: ObjectId,            // Reference to User (seeker)
    provider: ObjectId           // Reference to User (provider)
  },
  lastMessage: {
    content: String,
    senderId: ObjectId,
    timestamp: Date
  },
  unreadCount: {
    seeker: Number,
    provider: Number
  },
  isActive: Boolean,
  timestamps: true
}
```

#### Messages Collection
```javascript
{
  conversationId: ObjectId,      // Reference to Conversation
  senderId: ObjectId,           // Reference to User
  receiverId: ObjectId,         // Reference to User
  content: String,
  timestamp: Date,
  read: Boolean,
  readAt: Date,
  timestamps: true
}
```

### Key Features

1. **1-to-1 Chat Only**: No group chats or public rooms
2. **Job Request Based**: Each conversation is tied to a specific job request
3. **Automatic Creation**: Conversation is created when an offer is accepted
4. **Real-time Messaging**: Using Socket.IO for instant message delivery
5. **Read Status Tracking**: Messages can be marked as read
6. **Unread Count**: Track unread messages per user
7. **Authentication**: JWT-based authentication for both HTTP and WebSocket connections

## API Endpoints

### HTTP REST API

#### GET `/api/chat/conversations`
Get user's conversations with pagination
- **Query Params**: `page`, `limit`
- **Auth**: Required
- **Response**: List of conversations with metadata

#### GET `/api/chat/conversations/:conversationId/messages`
Get messages for a specific conversation
- **Query Params**: `page`, `limit`
- **Auth**: Required
- **Response**: Messages with pagination info

#### PATCH `/api/chat/conversations/:conversationId/read`
Mark messages as read in a conversation
- **Auth**: Required
- **Response**: Number of messages marked as read

#### GET `/api/chat/job-requests/:jobRequestId/conversation`
Get conversation for a specific job request
- **Auth**: Required
- **Response**: Conversation details

#### GET `/api/chat/unread-count`
Get total unread message count for user
- **Auth**: Required
- **Response**: Total unread count

### Socket.IO Events

#### Client to Server Events

**`send-message`**
```javascript
{
  conversationId: "conversation_id",
  receiverId: "receiver_user_id",
  content: "Message content"
}
```

**`join-conversation`**
```javascript
{
  conversationId: "conversation_id"
}
```

**`leave-conversation`**
```javascript
{
  conversationId: "conversation_id"
}
```

**`mark-read`**
```javascript
{
  conversationId: "conversation_id"
}
```

#### Server to Client Events

**`receive-message`**
```javascript
{
  messageId: "message_id",
  conversationId: "conversation_id",
  senderId: "sender_user_id",
  content: "Message content",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

**`message-sent`** (confirmation)
```javascript
{
  messageId: "message_id",
  conversationId: "conversation_id",
  content: "Message content",
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

**`messages-read`**
```javascript
{
  conversationId: "conversation_id",
  readCount: 5
}
```

**`error`**
```javascript
{
  message: "Error description",
  error: "Detailed error message"
}
```

## Authentication

### HTTP API Authentication
- Uses existing JWT authentication middleware
- Token passed in Authorization header: `Bearer <token>`

### Socket.IO Authentication
- Token passed in handshake auth: `{ auth: { token: "jwt_token" } }`
- Or in headers: `Authorization: Bearer <token>`
- Unauthenticated connections are rejected

## File Structure

```
backend/
├── models/
│   ├── Conversation.js          # Conversation model
│   ├── Message.js               # Message model
│   └── index.js                 # Updated to export new models
├── services/
│   ├── chatService.js           # Chat business logic
│   ├── socketService.js         # Socket.IO event handling
│   └── offerService.js          # Updated to create conversations
├── controllers/
│   └── chatController.js        # HTTP API controllers
├── routes/
│   └── chatRoutes.js            # Chat API routes
├── middlewares/
│   └── socketAuth.middleware.js # Socket authentication
├── app.js                       # Updated to include chat routes
└── server.js                    # Updated to initialize Socket.IO
```

## Usage Flow

1. **Offer Acceptance**: When a seeker accepts an offer, a conversation is automatically created
2. **Connection**: Users connect to Socket.IO with their JWT token
3. **Join Conversation**: Users join the conversation room for their job request
4. **Send Messages**: Users can send messages via Socket.IO or HTTP API
5. **Real-time Delivery**: Messages are delivered instantly to online users
6. **Read Status**: Messages can be marked as read via Socket.IO or HTTP API

## Security Considerations

1. **Authentication**: All connections require valid JWT tokens
2. **Authorization**: Users can only access conversations they're participants in
3. **Input Validation**: Message content is validated and sanitized
4. **Rate Limiting**: Consider implementing rate limiting for message sending
5. **Message Size**: Messages are limited to 2000 characters

## Performance Considerations

1. **Indexing**: Proper database indexes for efficient querying
2. **Pagination**: Messages are paginated to avoid loading large datasets
3. **Room-based Broadcasting**: Messages are sent only to relevant users
4. **Connection Management**: Efficient socket connection tracking

## Frontend Integration

The frontend should use `socket.io-client` to connect to the Socket.IO server:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'jwt_token_here'
  }
});

// Listen for incoming messages
socket.on('receive-message', (message) => {
  console.log('New message:', message);
});

// Send a message
socket.emit('send-message', {
  conversationId: 'conversation_id',
  receiverId: 'receiver_id',
  content: 'Hello!'
});
```

## Testing

The chat system can be tested using:
1. **HTTP API**: Use tools like Postman or curl
2. **Socket.IO**: Use Socket.IO client libraries or browser console
3. **Integration**: Test the complete flow from offer acceptance to messaging

## Future Enhancements

1. **Message Types**: Support for images, files, and rich content
2. **Typing Indicators**: Show when users are typing
3. **Message Status**: Delivered, read receipts
4. **Push Notifications**: For offline users
5. **Message Search**: Search within conversations
6. **Message History**: Export conversation history 