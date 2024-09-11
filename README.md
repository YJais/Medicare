# Niyogya - Hospital Management System

**Niyogya** is a full-stack hospital management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The system is designed to manage various operations of a hospital such as patient registration, appointment scheduling, billing, and more. It provides an intuitive interface for doctors, patients, and administrators to handle their respective tasks efficiently.

## Features

- **Patient Management**: Register new patients, maintain personal details, and view medical history.
- **Appointment Scheduling**: Patients can book, modify, or cancel appointments; doctors can view their schedules.
- **Billing System**: Automatically generate bills based on patient treatment and services provided.
- **Inventory Management**: Track hospital inventory like medicines and equipment.
- **User Authentication**: Role-based access for administrators, doctors, and patients using JWT (JSON Web Tokens).
- **Responsive UI**: Accessible on both mobile and desktop devices.

## Technologies Used

- **MongoDB**: NoSQL database for storing patient records, appointments, and other data.
- **Express.js**: Web framework for Node.js, handling routing and server-side logic.
- **React.js**: Front-end library for building the user interface.
- **Node.js**: Back-end JavaScript runtime for handling requests and connecting to the database.

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/)

### Steps to Set Up Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/niyogya-hospital-management.git
   ```

2. Navigate to the project directory:

   ```bash
   cd niyogya-hospital-management
   ```

3. Install server-side dependencies:

   ```bash
   cd server
   npm install
   ```

4. Install client-side dependencies:

   ```bash
   cd ../client
   npm install
   ```

5. Set up environment variables:

   Create a `.env` file in the `server` directory and include the following:

   ```bash
   MONGO_URI=mongodb://localhost:27017/niyogya
   JWT_SECRET=your_jwt_secret
   ```

6. Start the MongoDB server:

   ```bash
   mongod
   ```

7. Start the development server (both backend and frontend):

   In the `server` directory, run:

   ```bash
   npm run dev
   ```

   In the `client` directory, run:

   ```bash
   npm start
   ```

8. Open the application:

   Visit `http://localhost:3000` in your browser to access the application.

## Folder Structure

```
|-- client/
    |-- public/
    |-- src/
        |-- components/      # Reusable React components
        |-- pages/           # Different application pages
        |-- services/        # API service files
        |-- App.js           # Main app component
        |-- index.js         # React entry point
|-- server/
    |-- config/              # Database connection and environment setup
    |-- controllers/         # Application logic
    |-- models/              # MongoDB models (patients, doctors, etc.)
    |-- routes/              # API routes
    |-- server.js            # Express server entry point
```

## API Endpoints

- **Patient Management**:
  - `POST /api/patients` - Register a new patient
  - `GET /api/patients/:id` - Retrieve patient details
  - `PUT /api/patients/:id` - Update patient information
  - `DELETE /api/patients/:id` - Remove patient

- **Appointments**:
  - `POST /api/appointments` - Schedule a new appointment
  - `GET /api/appointments/:doctorId` - Get appointments for a doctor

- **Billing**:
  - `POST /api/billing` - Generate a bill for a patient

## Future Enhancements

- Integration with external diagnostic systems
- Telemedicine functionality for remote consultations
- Real-time chat between doctors and patients
- Advanced reporting and analytics on hospital operations

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

For any queries or feedback, feel free to reach out:

- **Email**: support@niyogya.com
- **GitHub**: [https://github.com/your-username/niyogya-hospital-management](https://github.com/your-username/niyogya-hospital-management)

---

This README provides a detailed overview of Niyogya's setup, usage, and project structure. You can modify it as per your project's specific details.
