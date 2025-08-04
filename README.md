# HNCH App (HIre New Crew Here)

## Project Description

HNCH (Hire New Crew Here) solves a problem that has long since plagued super villains - finding good help. Gone are the days of 

------

## Technologies Used

- **Frontend:** React, Vite, React Router, CSS (custom & modular)
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Database:** MySQL
- **AI Integration:** Node.js Gemini AI server (Google Gemini API for Chatbot)
- **Testing:** Jest (React), Manual testing
- **Other:** Maven, Axios, REST API's

------

## Installation Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/hnch-app2.git
   cd hnch-app2
   ```

2. **Set up the MySQL database**
   - Install MySQL and create a database named `hnchdb`.
   - Update `src/main/resources/application.properties` with your MySQL username and password.
   - The app will auto-create tables and seed initial users from `data.sql`.

3. **Start the Spring Boot backend**
   ```sh
   cd hnch-app2
   mvn spring-boot:run
   ```

4. **Set up the Gemini AI server**
   - Go to `src/components/gemini-server.js`
   - Create a `.env` file with your Gemini API key:
     ```
     GEMINI_API_KEY=your_google_gemini_api_key
     ```
   - Start the server:
     ```sh
     node src/components/gemini-server.js
     ```

5. **Start the React frontend**
   ```sh
   npm install
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173)

------

## Wireframes

- [View wireframes (Google Drive)](https://drive.google.com/your-wireframes-link)
  *(Replace with your actual link or embed images)*

------

## ER Diagram

- [View ER diagram (Google Drive)](https://drive.google.com/your-er-diagram-link)
  *(Replace with your actual link or embed images)*

------

## Unsolved Problems & Future Features

- **Backend authentication:** Currently, login/logout is handled in the frontend only (localStorage). Adding JWT or session-based authentication would improve security.
- **Password hashing:** Passwords are stored in plain text; should use BCrypt or similar.
- **Admin panel:** More robust admin features for managing users and gigs.
- **Mobile polish:** Responsive design is present but could be improved for smaller screens.
- **Accessibility:** Add ARIA labels and improve keyboard navigation.
- **Deployment:** Add Dockerfile and deployment scripts for production.
- **Public API integration:** Optionally fetch data from a public API for extra features.

------

## Manual Testing Results
- All major features were tesetd in browser; user registration; login, logout, hiring/firing goons, posting gigs, messaging, & wallet management.
- No runtime errors or 404's encountered during normal use.

## Debugging Results
- Error handling implemented in both frontend and backend.
- All endpoints return appropriate error messages for invalid input or unathorized actions.
- Console and network logs checked for issues during development.

## Jest Testing in React App Results
- ran 'npm test' to execute all Jest tests
- tested helper functions (fee calculation, snitch detection, career experience)
- tested UserAccount component for message deletion (success, failure, networker error)
- all tests passed successfully

------

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.