# NYCPS Transportation Management System - Clickable Prototype

This is a basic clickable prototype demonstrating the potential look, feel, and flow of the proposed NYCPS Transportation Management System, based on the requirements provided.

### VERSION B (THIS ONE) - CONTAINS THE FOLLOWING EXTRA DEMO FEATURES:

- 1. Parent/Student Module:
View Alerts Button: A new button (<i class="fas fa-bell"></i> View Alerts) was added. Clicking it opens a modal displaying a simulated list of recent relevant notifications (e.g., delays, route changes).

Richer Schedule Modal: Clicking the "View Schedule" button now shows a modal with slightly more specific (though still simulated) AM and PM route/time information.

- 2. Driver Module:
Acknowledge Alert Button: A new button (<i class="fas fa-exclamation-triangle"></i> Acknowledge Alert) appears near the navigation header. Clicking it simulates acknowledging a received alert (like a weather warning) via a modal, and the button then disappears.

Simulated Turn-by-Turn: Clicking the "Full Route Details" button now opens a modal containing a simulated, scrollable list of turn-by-turn directions for the route.

- 3. School Admin Module:
Simulated Map Filters: Basic dropdown and button controls have been added above the map placeholder to simulate filtering the map view (e.g., by bus status). Clicking "Apply" shows a confirmation modal.

Generate On-Time Report Button: A new button (<i class="fas fa-chart-line"></i> On-Time Report) was added. Clicking it simulates the generation of a school-specific performance report via a modal.

- 4. OPT Admin Module:
Simulated Search/Filter Controls: Basic text input and dropdowns were added above the map placeholder to simulate more advanced searching and filtering capabilities for the system-wide map view. Clicking "Search/Filter" shows a confirmation modal.

View Route History Button: A new button (<i class="fas fa-history"></i> View Route History) was added to the "Admin Actions". Clicking it opens a modal simulating the action of viewing historical route data or a replay.

Clickable Event Feed Item: One of the items in the "Live Event Feed" (the route change request) is now styled to look clickable. Clicking it opens a modal simulating the viewing of details for that specific request, with options to take further action (like Approve/Reject).



## Features Demonstrated (Simulated)

*   **Role Selection:** Choose between Parent/Student, Driver, School Admin, and OPT Admin roles.
*   **Login:** Simple login screen tailored to the selected role.
*   **Parent/Student Module:**
    *   View simulated map with bus location and ETA.
    *   Buttons to simulate marking a student absent, reporting an issue, viewing schedule (with basic details), requesting info updates, and viewing alerts/notifications.
    *   Placeholder for student scannable bus pass (QR code).
    *   Basic bottom navigation.
*   **Driver Module:**
    *   Simulated map view with next turn/stop information.
    *   Route control buttons (Audio Nav, Full Route, Send Alert).
    *   Button to view simulated Turn-by-Turn directions (via modal).
    *   Button to acknowledge a received alert (e.g., weather).
    *   Ridership list with buttons to mark students as boarded or no-show.
    *   Button to simulate scanning a student ID.
    *   Basic bottom navigation.
*   **School Admin Module:**
    *   Dashboard with placeholder KPIs (Buses en route, On-time %, etc.).
    *   Simulated map overview for the school's buses with basic filter controls.
    *   Action buttons (View Bus Details, Manage Student Info, Report Issue, Generate On-Time Report).
    *   Recent alerts list.
    *   Basic bottom navigation.
*   **OPT Admin Module:**
    *   Dashboard with placeholder system-wide KPIs.
    *   Simulated system-wide map view with basic search/filter controls.
    *   Extensive action buttons for managing routes, stops, users, reports, etc.
    *   Button to simulate viewing Route History/Replay.
    *   Live event feed simulation, including clickable request for viewing/action.
    *   Basic bottom navigation.
*   **Modern UI:** Uses a clean, modern design with a blue/white/grey color scheme and standard web fonts (Roboto).
*   **Responsiveness:** Basic responsive design adjustments for different screen sizes.
*   **Clickable Navigation:** JavaScript is used to switch between different "views" (simulated screens) based on user interaction.
*   **Modal Dialogs:** Simple pop-up dialogs for confirmations and placeholder messages, sometimes with basic lists or formatted text.

## How to Use

1.  Ensure all files (`index.html`, `style.css`, `script.js`) are in the same directory.
2.  Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge recommended).
3.  Click on the desired Role button.
4.  **On the Login screen, enter *any* text into the 'Username / ID' field and click the 'Login' button to simulate a successful login and access the selected role's dashboard.**
5.  Click through the different features within the module. The navigation at the bottom (footer) and the Logout button in the header should now be active. Try the newly added buttons and interactions.

## Limitations

This is a **prototype** and not a functional application. It lacks:

*   Real data or backend integration.
*   Actual GPS tracking or map functionality (uses placeholder images/text).
*   Real routing logic or ETA calculations.
*   Working authentication or user accounts.
*   Full accessibility compliance (though basic structure is considered).
*   Complete feature coverage of the extensive requirements list.
*   Persistent state (refreshing the browser will reset it).
*   Complex interactions or data manipulation (most actions show a placeholder modal).

Its purpose is solely to visualize the user interface and basic user flow for selected features.