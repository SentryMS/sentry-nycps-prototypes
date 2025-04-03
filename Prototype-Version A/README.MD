# NYCPS Transportation Management System - Clickable Prototype

This is a basic clickable prototype demonstrating the potential look, feel, and flow of the proposed NYCPS Transportation Management System, based on the requirements provided.

## Features Demonstrated (Simulated)

*   **Role Selection:** Choose between Parent/Student, Driver, School Admin, and OPT Admin roles.
*   **Login:** Simple login screen tailored to the selected role.
*   **Parent/Student Module:**
    *   View simulated map with bus location and ETA.
    *   Buttons to simulate marking a student absent, reporting an issue, viewing schedule, and requesting info updates.
    *   Placeholder for student scannable bus pass (QR code).
    *   Basic bottom navigation.
*   **Driver Module:**
    *   Simulated map view with next turn/stop information.
    *   Route control buttons (Audio Nav, Full Route, Send Alert).
    *   Ridership list with buttons to mark students as boarded or no-show.
    *   Button to simulate scanning a student ID.
    *   Basic bottom navigation.
*   **School Admin Module:**
    *   Dashboard with placeholder KPIs (Buses en route, On-time %, etc.).
    *   Simulated map overview for the school's buses.
    *   Action buttons (View Bus Details, Manage Student Info, Report Issue).
    *   Recent alerts list.
    *   Basic bottom navigation (could be sidebar on desktop).
*   **OPT Admin Module:**
    *   Dashboard with placeholder system-wide KPIs.
    *   Simulated system-wide map view.
    *   Extensive action buttons for managing routes, stops, users, reports, etc.
    *   Live event feed simulation.
    *   Basic bottom navigation (could be sidebar on desktop).
*   **Modern UI:** Uses a clean, modern design with a blue/white/grey color scheme and standard web fonts (Roboto).
*   **Responsiveness:** Basic responsive design adjustments for different screen sizes.
*   **Clickable Navigation:** JavaScript is used to switch between different "views" (simulated screens) based on user interaction.
*   **Modal Dialogs:** Simple pop-up dialogs for confirmations and placeholder messages.

## How to Use

1.  Ensure all files (`index.html`, `style.css`, `script.js`) are in the same directory.
2.  Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge recommended).
3.  Click on the desired Role button.
4.  **On the Login screen, enter *any* text into the 'Username / ID' field and click the 'Login' button to simulate a successful login and access the selected role's dashboard.**
5.  Click through the different features within the module. The navigation at the bottom (footer) and the Logout button in the header should now be active.


## Limitations

This is a **prototype** and not a functional application. It lacks:

*   Real data or backend integration.
*   Actual GPS tracking or map functionality (uses placeholder images).
*   Real routing logic or ETA calculations.
*   Working authentication or user accounts.
*   Full accessibility compliance (though basic structure is considered).
*   Complete feature coverage of the extensive requirements list.
*   Persistent state (refreshing the browser will reset it).

Its purpose is solely to visualize the user interface and basic user flow.