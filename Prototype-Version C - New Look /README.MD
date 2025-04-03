# NYCPS Transportation Management System - Modern UI Prototype

This is a visually enhanced clickable prototype demonstrating a potential "ultra-modern" and "sophisticated" look, feel, and flow for the proposed NYCPS Transportation Management System, based on the requirements provided.

**Focus:** This version prioritizes a high-quality visual presentation intended to impress stakeholders, using a refined dark theme, improved layout, typography, and component styling.

## Design Highlights

*   **Sophisticated Dark Theme:** Uses a palette of dark blues and charcoals with a vibrant teal accent color for key actions and highlights.
*   **Modern Typography:** Employs the 'Inter' font family for clean, readable text with strong hierarchy.
*   **Refined Layouts:**
    *   Improved use of spacing and alignment.
    *   Dedicated layouts for different roles (e.g., multi-column for Driver view).
    *   **Sidebar Navigation:** Implemented for Admin roles (School & OPT) on larger screens for a professional desktop experience. Bottom navigation remains for other roles and smaller screens.
*   **Enhanced Components:**
    *   Cards have a cleaner look with subtle borders instead of heavy shadows.
    *   Buttons are refined with better icon integration and subtle hover effects (lift, brightness).
    *   Forms have improved styling with darker input fields and accent focus states.
    *   Map placeholders are styled more intentionally.
    *   Badges used in lists for clearer status indication.
*   **Subtle Transitions:** CSS transitions added for smoother hover effects and view fading.

## Features Demonstrated (Simulated - Includes Previous + Enhancements)

*   Role Selection Screen.
*   Modernized Login Screen (per role).
*   **Parent/Student:** Redesigned layout, map/status card, actions card, bus pass card, view alerts modal.
*   **Driver:** Redesigned multi-column layout, navigation card (with acknowledge alert), ridership card (with refined buttons), turn-by-turn list modal.
*   **School Admin:** Redesigned dashboard (KPIs, map overview with filters, actions, alerts list), sidebar navigation on desktop.
*   **OPT Admin:** Redesigned dashboard (KPIs, system map with search/filters, admin actions, event feed), sidebar navigation on desktop, clickable event feed items for simulated actions (e.g., approving requests).
*   Improved Modal Dialog styling.

## How to Use

1.  Ensure all files (`index.html`, `style.css`, `script.js`) are in the same directory.
2.  Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge recommended).
3.  Click the desired Role button.
4.  **On the Login screen, enter *any* text into the 'Username / ID' field and click the 'Login' button.**
5.  Explore the interface.
    *   **Admin Roles (Desktop):** Use the sidebar on the left for navigation.
    *   **Other Roles / Mobile:** Use the bottom navigation bar.
6.  Click on buttons and interactive elements to see simulated actions (mostly via pop-up modals).

## Limitations

This remains a **visual prototype** and not a functional application. It lacks:

*   Real data, backend logic, or API integration.
*   Actual GPS, mapping, routing, or ETA calculation.
*   Working authentication, user accounts, or data persistence.
*   Full accessibility compliance (WCAG).
*   Complete feature coverage.
*   Complex state management or error handling.

Its purpose is to showcase a potential *visual direction* and basic user flow for key areas, aiming for a high-quality, modern aesthetic.