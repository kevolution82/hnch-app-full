# HNCH App (Hire New Crew Here)

## Project Description

## Out-of-character descrption
HNCH is a full-stack web application that lets users hire fictional henchpeople while managing money, contracts, and interactions through a playful but fully functional interface. It features user authentication with credential storage, a wallet UI that tracks available funds and adjusts after hiring or firing goons, and conditional pricing that changes depending on which goons are paired together. Some combinations increase cost, while others apply discounts. Users can post gigs, browse candidates, and perform full CRUD operations tied to a backend database. A built-in chat tab uses the Gemini API to simulate conversations with multiple custom personalities, adding an interactive layer to the experience while showcasing API integration and state management.

## In-Character Description
HNCH (Hire New Crew Here) solves a problem that has long since plagued super villains - finding good help. Gone are the days of settling for unreliable goons who barely show up or panic at the first sign of resistance. You're a villain who cares about results. You don't want to hire your cousin's friend of a friend. You don't want to deal with shady black market recruiters.

HNCH is here to solve all of your henchpeople hiring woes.

This platform eliminates the guesswork. Every candidate comes with a profile, complete with skills, experience, and a criminal background summary that’s actually useful. You’ll know who served time and who snitched.

Hiring is straightforward. Sort by cost, years of experience, or just scroll until someone stands out. You don’t need a middleman anymore. You need reliability.

HNCH exists because your operation deserves better than amateurs and secondhand referrals. If it all goes sideways, it won’t be because you hired the wrong crew.

------

## Technologies Used

- **Frontend:** React, Vite, React Router, CSS (custom & modular)
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Database:** MySQL
- **AI Integration:** Node.js Gemini AI server (Google Gemini API for Chatbot)
- **Testing:** Jest (React), Manual testing
- **Other:** Maven, REST API's

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

- [View wireframes (Google Drive)](https://drive.google.com/file/d/1gG_k6nwxRLm6LEPiEsL46inYkSyeeGXi/view?usp=sharing)

------

## ER Diagram

- [View ER diagram (Google Drive)](https://docs.google.com/document/d/1nNNy5MtXPg8vz8Mj7SaQBxTrZiQ2oGplDOd9HRUoFpY/edit?usp=sharing)

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