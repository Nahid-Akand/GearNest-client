# GearNest - Frontend Client

GearNest is a modern equipment rental marketplace where customers can discover and rent equipment, owners can list and manage their equipment, and administrators can manage the platform.

This repository contains the frontend application built with Next.js and TypeScript.

## Technologies Used

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Axios
- Lucide React
- Framer Motion
- Recharts
- React Hot Toast

## Main Features

### Authentication
- User registration and login
- JWT-based authentication
- Google authentication
- Protected routes
- Role-based dashboard access

### Public Pages
- Home page
- All Equipment page
- Equipment details page
- Search and filtering
- Equipment sorting

### Customer Dashboard
- My Rentals
- Favorites
- Profile management

### Owner Dashboard
- Add Equipment
- My Equipment
- My Equipment Rental
- Profile management

### Admin Dashboard
- Manage users
- Manage equipment
- Review equipment approval requests
- Administrative management

### Equipment Features
- Equipment listing cards
- Equipment details
- Category filtering
- Location search
- Rental type selection
- Price range filtering
- Availability filtering

### Booking and Payment
- Equipment rental booking
- Rental date selection
- Booking information
- Stripe Checkout
- Payment success and status pages

### User Profile
- Update name
- Update email where supported
- Update profile image
- Update phone number
- Update address
- Default cartoon profile image for new registrations

### User Experience
- Responsive design
- Modern dashboard layouts
- Loading states
- Error handling
- Toast notifications
- Interactive UI components

## Installation

Clone the repository:

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

Navigate to the frontend directory:

```bash
cd grernext-client
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the frontend root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

Add other public configuration variables only if required by your existing implementation.

**Never put private API secrets in frontend environment variables.**

## Run the Development Server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## Backend Connection

The frontend communicates with the GearNest backend through Axios.

Default local API URL:

```text
http://localhost:5001/api/v1
```

Configure `NEXT_PUBLIC_API_URL` when connecting to a deployed backend.

## Project Structure

```text
grernext-client/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── owner/
│   │   ├── equipment/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   └── types/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

The actual folder structure may vary depending on the implementation.

## User Roles

| Role | Dashboard |
|---|---|
| Customer | My Rentals, Favorites, Profile |
| Owner | Add Equipment, My Equipment, My Equipment Rental, My Profile |
| Admin | Administrative management |

## Backend Repository

The frontend connects to the GearNest backend API.

Backend repository: Add your server GitHub repository URL here.

## License

This project was developed as an equipment rental marketplace project.