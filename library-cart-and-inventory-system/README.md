# Church Library Management System

## Overview
This web application is designed to manage a church library's book inventory through a user-friendly interface. The system utilizes barcode scanning technology (ISBN) to facilitate both the addition of new books and the management of book checkouts through a shopping cart system.

## Key Features
- **Barcode Scanning**: 
  - ISBN barcode scanning capability for quick book identification
  - Used for both inventory management and checkout processes
  - Compatible with mobile device cameras
  - Smart camera selection based on device type
  - *(Planned)* Manual camera selection through dropdown menu

- **Inventory Management**:
  - Complete database of library books
  - Real-time inventory tracking
  - Book information display in a viewable format
  - Automatic book cover retrieval and updates
  - *(Planned)* Direct editing of book quantities and details
  - *(Planned)* Bulk book registration capabilities

- **Transaction System**:
  - *(Planned)* Shopping cart functionality for book checkouts
  - *(Planned)* Transaction history tracking
  - *(Planned)* Book return management

## Current Components

### 1. Inventory Component
- Displays all books registered in the database
- Shows book details in a structured format
- **Automatic Book Cover Updates**:
  - Automatically fetches and updates book covers in the database
  - Uses book title and author information for accurate cover retrieval
  - Maintains visual consistency in the inventory display
  - Reduces manual image management overhead
- *(Planned)* Will include direct editing capabilities for book details and quantities

### 2. Add to Inventory Component
- Implements barcode scanning functionality
- Tests ISBN scanning capabilities
- **Smart Camera Handling**:
  - Automatically detects available camera devices
  - Platform-aware camera selection:
    - Mobile devices: Defaults to back camera for barcode scanning
    - Desktop: Uses first available webcam
  - *(Planned)* Dropdown menu for manual camera selection
    - Will allow users to choose preferred camera device
    - Useful for devices with multiple cameras
    - Settings persistence for user preference
- Will be integrated with database operations for book registration

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd library-cart-and-inventory-system
```

3. Install dependencies:
```bash
npm install
```

### Running the Application

1. Start the development server:
```bash
ng serve
```

2. Open your browser and navigate to:
http://localhost:4200

### Mobile Testing

To test the application (including barcode scanning) on a mobile device:

1. Start the server with host configuration:
```bash
ng serve --host 0.0.0.0
```

2. Find your computer's IP address:
- Windows: Open Command Prompt and type `ipconfig`
- Look for IPv4 Address (usually starts with 192.168. or 10.0.)

3. On your mobile device:
- Connect to the same WiFi network as your computer
- Open browser and navigate to `http://<your-computer-ip>:4200`
- Allow camera permissions when prompted
- The app will automatically select the back camera for scanning

## Development Status
The application is currently in active development with the following status:

- ✅ Basic component structure established
- ✅ Barcode scanning functionality implemented
- ✅ Initial inventory display component created
- ✅ Automatic book cover retrieval system
- 🚧 Smart camera device selection (In Progress)
- 🚧 Manual camera selection UI (Planned)
- 🚧 Database integration (In Progress)
- 🚧 Shopping cart functionality (Planned)
- 🚧 Transaction system (Planned)

## Technical Stack
- Frontend: Angular 19.2.0
- Barcode Scanning: @zxing/browser
- Book Cover API: [Your chosen API]
- Styling: CSS with responsive design
- *(Planned)* Backend & Database: TBD

## Component Details

### Book Cover Update Function
The automatic book cover update system works as follows:
1. Monitors the inventory database for books without cover images
2. Uses book metadata (title and author) to search for cover images
3. Automatically updates the database with found cover images
4. Handles cases where covers aren't found with placeholder images
5. Implements rate limiting and caching for API efficiency

### Camera Device Selection
The camera handling system includes:
1. **Automatic Detection**:
   - Scans available video input devices
   - Identifies device type (mobile/desktop)
   - Categorizes cameras (front/back/external)

2. **Smart Selection Logic**:
   - Mobile: Prioritizes back camera for better barcode scanning
   - Desktop: Uses primary webcam
   - Handles permission requests automatically

3. *(Planned)* **Manual Selection UI**:
   - Dropdown menu listing all available cameras
   - Clear device labels for easy identification
   - Persistent selection storage
   - Real-time camera switching

## Future Enhancements
- Advanced search and filtering capabilities
- Book categorization system
- Member management system
- Checkout history tracking
- Statistical reports and analytics
- Email notifications for due dates
- Mobile-responsive design improvements
- Multiple camera support improvements
- Enhanced book cover management system

## Contributing
This project is currently in development. For major changes, please open an issue first to discuss what you would like to change.

## License
[Your chosen license]

## Contact
[Your contact information]