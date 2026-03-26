# Military Asset Management System

A comprehensive web application for managing military assets including vehicles, weapons, and ammunition across multiple bases with role-based access control.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Features

- **Dashboard**: View all assets with current balances and net movements
- **Purchases**: Record new asset purchases (Admin & Logistics Officer)
- **Transfers**: Transfer assets between bases
- **Assignments & Expenditures**: Assign assets to personnel and record expenditures
- **Role-Based Access Control (RBAC)**: Three user roles with different permissions
- **Filtering**: Filter assets by base and type
- **API Logging**: All API requests are logged with user information

## User Roles & Permissions

### Admin
- Full access to all features
- Can manage assets across all bases
- Can record purchases, transfers, assignments, and expenditures

### Base Commander
- Access to their assigned base only
- Can create transfers and assignments
- Can record expenditures
- Cannot record purchases

### Logistics Officer
- Access to their assigned base only
- Can record purchases and expenditures
- Can create transfers
- Cannot create assignments

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Edit `.env` file and update MongoDB URI if needed
   - Default: `mongodb://localhost:27017/military-asset-management`

4. Seed the database with demo users:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd military-asset-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Login Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### Base Commander (Alpha Base)
- Username: `commander_alpha`
- Password: `commander123`

### Base Commander (Bravo Base)
- Username: `commander_bravo`
- Password: `commander123`

### Logistics Officer (Alpha Base)
- Username: `logistics_alpha`
- Password: `logistics123`

### Logistics Officer (Bravo Base)
- Username: `logistics_bravo`
- Password: `logistics123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Assets
- `GET /api/assets` - Get all assets (with filters)
- `GET /api/assets/movements/:assetName/:base` - Get net movements for an asset

### Purchases
- `POST /api/purchases` - Record a purchase (Admin, Logistics Officer)
- `GET /api/purchases` - Get all purchases

### Transfers
- `POST /api/transfers` - Create a transfer
- `GET /api/transfers` - Get all transfers

### Assignments
- `POST /api/assignments` - Create an assignment (Admin, Base Commander)
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments/expenditure` - Record expenditure
- `GET /api/assignments/expenditure` - Get all expenditures

## Database Schema

### User
- username (String, unique)
- password (String, hashed)
- role (Enum: Admin, Base Commander, Logistics Officer)
- base (String, required for non-Admin roles)

### Asset
- assetName (String)
- assetType (Enum: Vehicle, Weapon, Ammunition)
- base (String)
- quantity (Number)

### Purchase
- assetName (String)
- assetType (Enum)
- base (String)
- quantity (Number)
- purchaseDate (Date)
- purchasedBy (User reference)

### Transfer
- assetName (String)
- assetType (Enum)
- fromBase (String)
- toBase (String)
- quantity (Number)
- transferDate (Date)
- initiatedBy (User reference)

### Assignment
- assetName (String)
- assetType (Enum)
- base (String)
- assignedTo (String)
- quantity (Number)
- assignmentDate (Date)
- assignedBy (User reference)
- purpose (String)

### Expenditure
- assetName (String)
- assetType (Enum)
- base (String)
- quantity (Number)
- expenditureDate (Date)
- recordedBy (User reference)
- reason (String)

## Project Structure

```
military-asset-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Asset.js
│   │   ├── Purchase.js
│   │   ├── Transfer.js
│   │   ├── Assignment.js
│   │   └── Expenditure.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── assets.js
│   │   ├── purchases.js
│   │   ├── transfers.js
│   │   └── assignments.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── logger.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── .env
│   ├── index.js
│   └── package.json
└── military-asset-management/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Navbar.js
    │   │   ├── Dashboard.js
    │   │   ├── Purchases.js
    │   │   ├── Transfers.js
    │   │   └── Assignments.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control middleware
- Protected API routes
- Token expiration (24 hours)

## Development Notes

- All API requests are logged with timestamp and user information
- Asset quantities are automatically updated on purchases, transfers, assignments, and expenditures
- Transfers validate sufficient quantity at source base before processing
- Users can only see data relevant to their role and base (except Admin)

## Future Enhancements

- Email notifications for transfers
- Asset maintenance tracking
- Reporting and analytics dashboard
- Export data to PDF/Excel
- Real-time updates using WebSockets
- Mobile application

## License

MIT
