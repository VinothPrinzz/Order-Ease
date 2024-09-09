# Order-Ease
Order-Ease is a web-based food ordering platform designed to streamline campus dining experiences. This platform allows students and staff to browse menus, place orders, and easily manage their dining experiences. Built using a combination of EJS (Embedded JavaScript), JavaScript, CSS, and MongoDB, Order-Ease simplifies food ordering in an intuitive and user-friendly way.

## 🍔 About Order-Ease
Order-Ease is designed to enhance the food ordering process, especially for campus dining:

- For Users (Students & Staff):
Quickly browse dining options, place orders, and manage personal dining preferences.

- For Campus Dining Facilities:
Provides an organized way to manage orders and improve the overall dining experience by reducing long queues and simplifying order processing.

## Key Features:
- User-friendly interface for browsing menus and placing orders.
- Dynamic pages built using EJS (Embedded JavaScript).
- MongoDB for managing order data and menu items.
- Responsive design for seamless use across desktop and mobile devices.
## 💻 Technology Stack
Order-Ease is built using the following technologies:

- EJS - For dynamic templating and rendering views.
- JavaScript - For handling the frontend logic.
- CSS - For styling the application.
- MongoDB - To store and manage orders, menus, and other data.
## 🛠️ Installation and Setup
To run Order-Ease locally, follow the steps below:

### Prerequisites:
1. Ensure you have Node.js and npm (Node Package Manager) installed on your machine. You can verify by running:

bash
Copy code
node -v
npm -v

2. Install MongoDB and ensure it's running. You can set it up by following the MongoDB Installation Guide.

### Clone the Repository:

git clone https://github.com/VinothPrinzz/Order-Ease.git
cd Order-Ease

### Install Dependencies:
In the project directory, install the necessary dependencies:

npm install

### Environment Variables:
Create a .env file in the root directory and add the following environment variables:

MONGO_URI=your_mongodb_connection_string
PORT=3000

Replace your_mongodb_connection_string with your actual MongoDB connection string.

### Running the Application:
Start the Node.js server by running:

npm start
Open your browser and navigate to http://localhost:3000/ to view the app.

The application should now be up and running locally!

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
