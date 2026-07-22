# TourBuddy Backend

RESTful API server for **TourBuddy** — a travel companion platform where travelers can post tours, join tours, message hosts, and manage their journeys.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | HTTP server & routing |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Multer | File upload (images) |
| CORS | Cross-origin requests |
| tsx + nodemon | Dev server with hot reload |

## Project Structure

```
backend/
├── server.ts                  # Entry point — Express app, MongoDB connection, route mounting
├── seed.ts                    # Seed admin & demo traveler accounts
├── types/
│   ├── index.ts               # AuthRequest interface
│   └── modules.d.ts           # Module declarations
├── middleware/
│   ├── auth.ts                # JWT auth + adminOnly middleware
│   └── upload.ts              # Multer disk storage (uploads/)
├── models/
│   ├── User.ts                # name, email, password, phone, gender, role, profilePicture, address
│   ├── Post.ts                # Tour listing — title, amount, place, date, status, image, traveler ref
│   ├── Blog.ts                # Travel blog — title, details, status, blog_image, traveler ref
│   ├── Connect.ts             # Join request — post ref, traveler ref, status
│   ├── Message.ts             # Chat — sender, receiver, post ref, text, read
│   ├── Notification.ts        # Notification — user, fromUser, type, post, connect, text, read, link
│   ├── Slider.ts              # Hero slider — title, slogan, image
│   ├── Banner.ts              # Banner image
│   ├── BannerText.ts          # Banner heading/description
│   ├── Guide.ts               # Tour guide — name, designation, phone, image
│   ├── About.ts               # About page content
│   ├── Contact.ts             # Contact page info
│   ├── Rating.ts              # Star ratings for travelers
│   └── Apply.ts               # Tour guide applications
├── controllers/
│   ├── authController.ts      # register, login (JWT + bcrypt)
│   ├── adminController.ts     # Dashboard stats, post approval, traveler management
│   ├── travelerController.ts  # Profile, CRUD posts/blogs, password change
│   ├── frontendController.ts  # Public API — home data, single post/blog, search, travelers
│   ├── connectController.ts   # Request join, cancel, approve, reject + auto-create notifications
│   ├── messageController.ts   # Send message, inbox, conversation, mark-read, unread count
│   ├── notificationController.ts  # Notifications CRUD, unread count, mark read
│   ├── bannerController.ts    # CRUD banners (admin)
│   ├── sliderController.ts    # CRUD sliders (admin)
│   ├── guideController.ts     # CRUD guides (admin)
│   ├── aboutController.ts     # Update about content (admin)
│   ├── contactController.ts   # Update contact info (admin)
│   ├── blogManageController.ts # Blog moderation (admin)
│   ├── applicationController.ts # Guide application management (admin)
│   ├── ratingController.ts    # Create/view ratings
│   └── applyController.ts     # Submit guide application
├── routes/
│   ├── authRoutes.ts          # POST /register, POST /login
│   ├── frontendRoutes.ts      # GET /home, /posts, /post/:id, /blogs, /search, /travelers
│   ├── adminRoutes.ts         # All admin CRUD routes
│   └── travelerRoutes.ts      # Profile, posts/blogs, connect, messaging, notifications
└── uploads/                   # Uploaded images (Multer storage)
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tourbuddy
JWT_SECRET=your_super_secret_key_here
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Seed admin + demo traveler accounts
pnpm seed

# Start dev server (with hot reload)
pnpm dev

# Production
pnpm start
```

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/register` | `{ name, email, password, phone }` | Register new traveler |
| POST | `/login` | `{ email, password }` | Login, returns JWT + user |

### Public (`/api/public`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/home` | Home page data (posts, blogs, sliders, banners) |
| GET | `/posts` | All active posts with pagination |
| GET | `/post/:id` | Single post + connects + myConnect (if JWT) |
| GET | `/blogs` | All approved blogs |
| GET | `/blog/:id` | Single blog |
| GET | `/search?q=` | Search posts by title/places |
| GET | `/travelers` | All travelers list |
| GET | `/travelers/:id` | Single traveler profile + ratings |

### Admin (`/api/admin`) — requires `admin` role

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Dashboard stats |
| GET | `/posts/all` | All posts |
| GET | `/posts/pending` | Pending posts |
| GET | `/posts/active` | Active posts |
| GET | `/posts/:id` | Single post |
| PUT | `/posts/accept/:id` | Approve post |
| GET | `/travelers` | All travelers |
| POST | `/users` | Create new user |
| GET/POST/PUT/DELETE | `/banners/*` | Banner CRUD (with image upload) |
| GET/POST/PUT/DELETE | `/sliders/*` | Slider CRUD (with image upload) |
| GET/POST/PUT/DELETE | `/guides/*` | Guide CRUD (with image upload) |
| GET/PUT | `/about` | About content |
| GET/PUT | `/contact` | Contact info |
| GET | `/blogs` | All blogs |
| PUT | `/blogs/:id/status` | Approve/reject blog |
| DELETE | `/blogs/:id` | Delete blog |
| GET | `/applications` | Guide applications |
| PUT | `/applications/:id/status` | Approve/reject application |
| DELETE | `/applications/:id` | Delete application |

### Traveler (`/api/traveler`) — requires authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard data |
| PUT | `/profile` | Update profile |
| PUT | `/change-password` | Change password |
| GET/POST/PUT/DELETE | `/posts/*` | CRUD my posts |
| GET/POST/PUT/DELETE | `/blogs/*` | CRUD my blogs |
| POST | `/connect/:postId` | Request to join tour |
| DELETE | `/connect/:postId` | Cancel join request |
| PUT | `/connect/approve/:connectId` | Approve join request (post owner) |
| PUT | `/connect/reject/:connectId` | Reject join request (post owner) |
| POST | `/message` | Send message `{ receiverId, postId, text }` |
| GET | `/inbox` | Conversation list with unread counts |
| GET | `/messages/:otherUserId/:postId` | Chat messages |
| PUT | `/messages/read/:senderId/:postId` | Mark messages as read |
| GET | `/unread-count` | Unread message count |
| GET | `/notifications` | Notifications list (excludes message type) |
| GET | `/notifications/unread-count` | Unread notification count |
| PUT | `/notifications/read/:id` | Mark notification read (`all` for all) |
| DELETE | `/notifications/:id` | Delete notification |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/apply` | Submit guide application (multipart + CV) |
| POST | `/api/ratings` | Rate a traveler (auth required) |
| GET | `/api/ratings/:id` | Get ratings for a traveler |
| POST | `/api/contact-submit` | Submit contact form |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tourbuddy.com | Admintourbuddy@1234 |
| Traveler | demo@tourbuddy.com | demo@1234 |

## Authentication

All protected routes require JWT in `Authorization` header:

```
Authorization: Bearer <token>
```

Token expires in **1 hour**. Payload: `{ userId, role }`.

## File Upload

Multer disk storage. Files saved to `uploads/`, served at `/uploads/filename.jpg`. Max: **5MB**, formats: `image/jpeg`, `image/png`.
