# Culixur Platform

A luxury culinary experience management platform with role-based access control, QR-based member verification, and comprehensive admin oversight.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (running on `localhost:5432`)
- **Git**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd culixur

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

1. **Start PostgreSQL** (if not already running):
   ```bash
   # Windows: Start from Services
   # Mac: brew services start postgresql
   # Linux: sudo systemctl start postgresql
   # Or use Docker:
   docker run --name culixur-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

2. **Create the database**:
   ```bash
   psql -U postgres
   CREATE DATABASE culixur;
   \q
   ```

3. **Configure environment** (backend):
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed initial admin user** (optional):
   ```bash
   npx prisma studio
   # Manually create an admin user in the GUI
   ```

### Running the Application

#### Development Mode

```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Prisma Studio**: `npx prisma studio` (database GUI)

#### Production Build

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

---

## 📁 Project Structure

```
culixur/
├── backend/                 # NestJS backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── member/         # Member management
│   │   ├── chef/           # Chef management
│   │   ├── admin/          # Admin dashboard
│   │   ├── apply/          # Application system
│   │   └── main.ts         # Entry point
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/  # Member dashboard
    │   │   ├── culinary/   # Chef dashboard
    │   │   ├── admin/      # Admin dashboard
    │   │   ├── apply/      # Application form
    │   │   └── refer-elite/# Referral system
    │   └── lib/
    │       └── api.ts      # API client
    └── package.json
```

---

## 🔑 Key Features

### Authentication & Access Control
- **Invitation-only** member registration
- **Admin-controlled** chef account creation
- **JWT-based** authentication
- **Role-based** access (Admin, Chef, Member)

### Membership Tiers
- **CULIXUR**: Standard tier (wine-themed)
- **ELITE**: Premium tier (black/gold-themed)
  - 15 orders per month limit
  - Priority booking
  - Exclusive event access
  - Referral privileges

### QR Verification System
- **Static QR codes** for each member (e.g., `CX-0001`)
- **Chef-side scanner** using `html5-qrcode`
- **Real-time verification** with active order display

### Order Management
- Complete booking-to-fulfillment lifecycle
- Status tracking (Pending → Accepted → En Route → Fulfilled)
- Chef assignment and availability management

### Admin Dashboard
- Application review and approval
- User management
- Analytics and insights
- Chef creation interface

### Referral System
- Elite members can refer new members
- Priority processing (24-hour review)
- Guest credit rewards

---

## 🔒 Security Features

### Implemented
- ✅ **Helmet.js**: Security headers
- ✅ **CORS**: Configured for production
- ✅ **Rate Limiting**: 10 requests/60s per IP
- ✅ **Global Validation**: Input sanitization
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Password Hashing**: Bcrypt (via Prisma/NestJS)

### Production Checklist

---

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Member
- `GET /api/member/dashboard` - Member dashboard data
- `GET /api/member/booking-details` - Available menus and chefs
- `POST /api/member/book` - Create new booking
- `POST /api/member/apply` - Submit membership application
- `POST /api/member/refer-elite` - Refer an elite member

### Chef
- `GET /api/chef/dashboard` - Chef dashboard data
- `POST /api/chef/orders/:id/update-status` - Update order status
- `POST /api/chef/availability` - Update availability slots
- `GET /api/chef/verify-member/:id` - Verify member by QR code

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - List all users
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/menus` - List all menus
- `POST /api/admin/applications/:id/approve` - Approve application
- `POST /api/admin/applications/:id/reject` - Reject application
- `POST /api/admin/chefs` - Create new chef account

---

## 🗄️ Database Schema

### Key Models

- **User**: Core user model with roles (Admin, Chef, Member)
- **MembershipApplication**: Pending membership applications
- **Order**: Booking and order management
- **ChefProfile**: Chef-specific information
- **ChefAvailability**: Chef availability slots
- **Referral**: Elite member referrals
- **Menu**: Curated menu offerings
- **Event**: Exclusive events

### Enums

- **Role**: `ADMIN`, `CHEF`, `MEMBER`
- **MembershipTier**: `CULIXUR`, `ELITE`
- **OrderStatus**: `PENDING`, `ASSIGNED`, `ACCEPTED`, `EN_ROUTE`, `COMPLETED`, `CANCELLED`
- **ApplicationStatus**: `PENDING`, `APPROVED`, `REJECTED`

---

## 🧪 Testing

### Run Tests
```bash
# Backend unit tests
cd backend
npm run test

# Backend e2e tests
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

### Manual Testing Checklist
- [ ] Member application submission
- [ ] Admin approval flow
- [ ] Member login and dashboard
- [ ] Order creation
- [ ] Chef order acceptance
- [ ] QR code scanning
- [ ] Referral submission

---

## 📦 Deployment

### Recommended Platforms

#### Backend
- **Railway**: Easy PostgreSQL + Node.js deployment
- **Heroku**: PostgreSQL addon available
- **AWS**: EC2 + RDS for full control
- **DigitalOcean**: App Platform with managed PostgreSQL

#### Frontend
- **Vercel**: Recommended for Next.js (automatic deployments)
- **Netlify**: Alternative with good Next.js support
- **AWS Amplify**: Full AWS integration

### Environment Variables

#### Backend (.env.production)
```env
DATABASE_URL="postgresql://user:password@host:5432/culixur"
JWT_SECRET="your-super-secret-key-here"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://your-frontend-domain.com"
```

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
```

---

## 🛠️ Development

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for both frontend and backend
- **Prettier**: Code formatting

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name
```

---

## 📚 Documentation

- [Production Readiness Checklist](./production-readiness.md)
- [System Walkthrough](./walkthrough.md)
- [Task List](./task.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change PORT in .env
```

### Frontend Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📄 License

Proprietary - Culixur Platform © 2025

---

## 👥 Support

For issues or questions, please contact the development team.

