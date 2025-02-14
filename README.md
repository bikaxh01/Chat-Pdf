# Project Name

## Getting Started

**Install Dependencies**  
Live Link:- https://chat-pdf-mu-ten.vercel.app/

Follow these steps to run the project locally:

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn
- PostgreSQL (if required by Prisma)

### Installation

1. **Get Environment Variables**  
   Check out the `.env.example` file for required environment variables.

2. **Create a `.env` File**  
   Copy the contents of `.env.example` and paste them into a new `.env` file.

3. **Install Dependencies**  
   Run the following command to install all required dependencies:
   ```sh
   npm install
   ```

4. **Set Up the Database**  
   Run the following Prisma commands:
   ```sh
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the Development Server**  
   Run the project using:
   ```sh
   npm run dev
   ```

### Notes
- Make sure to grab all the necessary environment variables before running the project.
- Ensure your database is running if Prisma is being used.



