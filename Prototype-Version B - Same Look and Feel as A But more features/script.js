document.addEventListener('DOMContentLoaded', () => {
    // Query Selectors (keep existing ones)
    const views = document.querySelectorAll('.view');
    const roleSelectionView = document.getElementById('role-selection');
    const loginView = document.getElementById('login-view');
    const parentStudentView = document.getElementById('parent-student-view');
    const driverView = document.getElementById('driver-view');
    const schoolAdminView = document.getElementById('school-admin-view');
    const optAdminView = document.getElementById('opt-admin-view');
    const appFooter = document.querySelector('.app-footer');
    const appHeader = document.querySelector('.app-header');
    const headerTitle = document.getElementById('header-title');
    const userInfoSpan = document.getElementById('user-info');
    const logoutButton = document.getElementById('logout-btn');
    const modal = document.getElementById("simpleModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalConfirm = document.getElementById("modalConfirm");
    const modalCancel = document.getElementById("modalCancel");
    const footerNavContainer = document.querySelector('.app-footer .bottom-nav'); // Container for nav items

    let currentRole = null;
    let loggedIn = false;
    let currentView = 'role-selection';

    // --- Core Functions (showView, updateHeader, showModal, closeModal - Keep Existing) ---
    function showView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            currentView = viewId;
            updateFooterNav(viewId); // Update footer based on current view & role
        } else {
            console.error(`View with ID ${viewId} not found.`);
            // Fallback logic (e.g., show role selection or dashboard)
            const fallbackViewId = loggedIn ? `${currentRole.toLowerCase().replace(/[/ ]/g, '-')}-view` : 'role-selection';
            const fallbackView = document.getElementById(fallbackViewId) || roleSelectionView;
            fallbackView.classList.add('active');
            currentView = fallbackView.id;
            updateFooterNav(currentView); // Update footer for fallback view
        }
        updateHeader();
    }

    function updateHeader() {
        if (loggedIn && currentRole) {
            logoutButton.style.display = 'inline-block';
            userInfoSpan.textContent = `Role: ${currentRole}`; // Simple user info
            // Set title based on view
            switch (currentView) {
                case 'parent-student-view': headerTitle.textContent = 'Parent/Student Portal'; break;
                case 'driver-view': headerTitle.textContent = 'Driver Portal'; break;
                case 'school-admin-view': headerTitle.textContent = 'School Admin Portal'; break;
                case 'opt-admin-view': headerTitle.textContent = 'OPT Admin Portal'; break;
                // Add cases for other potential views if needed
                default: headerTitle.textContent = 'NYCPS Transportation';
            }
        } else {
            logoutButton.style.display = 'none';
            userInfoSpan.textContent = '';
            headerTitle.textContent = 'NYCPS Transportation';
        }
    }

     function showModal(title, message, showConfirm = false, onConfirm = null, confirmText = 'Confirm', cancelText = 'Close') {
        modalTitle.textContent = title;
        // Allow HTML in message for slightly richer content
        if (typeof message === 'string') {
             modalMessage.textContent = message;
        } else {
             modalMessage.innerHTML = ''; // Clear previous
             modalMessage.appendChild(message); // Append DOM element if passed
        }

        if (showConfirm) {
            modalConfirm.style.display = 'inline-block';
            modalConfirm.textContent = confirmText;
            modalCancel.textContent = cancelText; // Use provided cancel text or default
            modalConfirm.onclick = () => {
                closeModal();
                if (onConfirm) onConfirm();
            };
        } else {
            modalConfirm.style.display = 'none';
            modalCancel.textContent = cancelText; // Use provided cancel text or default 'Close'
        }
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
        modalConfirm.onclick = null; // Remove previous confirm action
    }

    // --- Footer Navigation Logic ---
    function updateFooterNav(activeViewId) {
        if (!loggedIn || !currentRole) {
            appFooter.style.display = 'none';
            return;
        }
        appFooter.style.display = 'block';
        footerNavContainer.innerHTML = ''; // Clear existing items

        let navItems = [];
        // Define nav items based on role
        switch (currentRole) {
            case 'Parent/Student':
                navItems = [
                    { icon: 'fa-home', text: 'Home', view: 'parent-student-view' },
                    { icon: 'fa-calendar-alt', text: 'Schedule', view: 'schedule-view' }, // Placeholder view
                    { icon: 'fa-bell', text: 'Alerts', view: 'alerts-view' },       // Placeholder view
                    { icon: 'fa-cog', text: 'Settings', view: 'settings-view' }     // Placeholder view
                ];
                break;
            case 'Driver':
                navItems = [
                    { icon: 'fa-route', text: 'Route', view: 'driver-view' },
                    { icon: 'fa-users', text: 'Ridership', view: 'driver-view' }, // Can link to same view, maybe scroll to section
                    { icon: 'fa-bell', text: 'Alerts', view: 'driver-alerts-view' }, // Placeholder view
                    { icon: 'fa-cog', text: 'Settings', view: 'driver-settings-view' } // Placeholder view
                ];
                break;
            case 'School Admin':
                 navItems = [
                    { icon: 'fa-tachometer-alt', text: 'Dashboard', view: 'school-admin-view' },
                    { icon: 'fa-map-marked-alt', text: 'Map View', view: 'school-map-view' }, // Placeholder
                    { icon: 'fa-flag', text: 'Issues', view: 'school-issues-view' }, // Placeholder
                    { icon: 'fa-users-cog', text: 'Students', view: 'school-students-view' } // Placeholder
                ];
                break;
            case 'OPT Admin':
                 navItems = [
                    { icon: 'fa-tachometer-alt', text: 'Dashboard', view: 'opt-admin-view' },
                    { icon: 'fa-route', text: 'Routes', view: 'opt-routes-view' }, // Placeholder
                    { icon: 'fa-headset', text: 'Tickets', view: 'opt-tickets-view' }, // Placeholder
                    { icon: 'fa-chart-bar', text: 'Reports', view: 'opt-reports-view' } // Placeholder
                ];
                break;
        }

        // Create and append nav items
        navItems.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('nav-item');
            div.setAttribute('data-view', item.view);
            if (item.view === activeViewId) {
                div.classList.add('active');
            }
            div.innerHTML = `<i class="fas ${item.icon}"></i><span>${item.text}</span>`;
            footerNavContainer.appendChild(div);
        });
    }


    // --- Event Listeners (Keep existing Login, Logout, Role Selection, Modal Close) ---

    // Role Selection
    roleSelectionView.addEventListener('click', (e) => {
        if (e.target.classList.contains('role-btn')) {
            currentRole = e.target.getAttribute('data-role');
            document.getElementById('login-role-title').textContent = `${currentRole} Login`;
            showView('login-view');
        }
    });

    // Login
    loginView.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission
        const username = document.getElementById('username').value;
        if (username) { // Simulate successful login if username is entered
            loggedIn = true;
            // Redirect based on role
            let initialView = 'role-selection'; // Default fallback
             switch (currentRole) {
                case 'Parent/Student': initialView = 'parent-student-view'; break;
                case 'Driver': initialView = 'driver-view'; break;
                case 'School Admin': initialView = 'school-admin-view'; break;
                case 'OPT Admin': initialView = 'opt-admin-view'; break;
            }
             showView(initialView);
             document.getElementById('login-form').reset(); // Clear form
        } else {
            showModal('Login Failed', 'Please enter a username.');
        }
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        loggedIn = false;
        currentRole = null;
        showView('role-selection');
        appFooter.style.display = 'none'; // Hide footer on logout
    });

    // Modal Close
    modalCancel.onclick = closeModal;
    window.onclick = (event) => { // Close if clicking outside the modal content
        if (event.target == modal) {
            closeModal();
        }
    };

     // Footer Navigation Click Handler
    appFooter.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem && loggedIn) {
            const targetViewId = navItem.getAttribute('data-view');
            if (targetViewId) {
                 if (targetViewId !== currentView) {
                     // Attempt to show the view. If it doesn't exist, show a modal.
                     const targetViewElement = document.getElementById(targetViewId);
                     if (targetViewElement && targetViewElement.classList.contains('view')) {
                         showView(targetViewId);
                     } else {
                         // If the view ID doesn't correspond to a main section, treat as placeholder
                         showModal('Navigation', `Navigating to ${navItem.textContent.trim()}... (Not Implemented in Prototype)`);
                     }
                 }
            } else {
                 // Fallback if data-view attribute is missing or action is different
                 showModal('Navigation', `Action for ${navItem.textContent.trim()}... (Not Implemented)`);
            }
        }
    });

    // ---- Specific View Interactions (Update/Add) ----

    // Parent/Student View Buttons
    parentStudentView.addEventListener('click', (e) => {
        if (e.target.id === 'mark-absent-btn') {
            showModal('Mark Absent', 'Are you sure you want to mark the student as absent for today?', true, () => {
                showModal('Confirmation', 'Student marked as absent for today.');
            });
        } else if (e.target.id === 'report-issue-btn') {
            showModal('Report Issue', 'Issue reporting feature coming soon...');
        } else if (e.target.id === 'view-schedule-btn') {
            // Simulate richer modal content
             const scheduleContent = document.createElement('div');
             scheduleContent.innerHTML = `
                <p><strong>AM Route:</strong> BX41 (Est. Pickup: 8:00 AM)</p>
                <p><strong>PM Route:</strong> BX45 (Est. Dropoff: 3:45 PM)</p>
                <p><small>(Schedules subject to change based on conditions)</small></p>
             `;
            showModal('Student Schedule (Simulated)', scheduleContent);
        } else if (e.target.id === 'request-info-update-btn') {
            showModal('Request Update', 'Update request form/process coming soon...');
        } else if (e.target.id === 'view-alerts-btn') {
            const alertContent = document.createElement('ul');
            alertContent.classList.add('simple-list');
            alertContent.innerHTML = `
                <li><strong>Delay Alert:</strong> Bus BX41 may be 10-15 mins late due to traffic (10:15 AM)</li>
                <li><strong>Info:</strong> PM Route changed to BX45 effective tomorrow.</li>
                <li><strong>Resolved:</strong> Earlier reported issue with Bus QN05 resolved.</li>
            `;
            showModal('Recent Notifications', alertContent);
        }
    });

    // Driver View Buttons
    driverView.addEventListener('click', (e) => {
        if (e.target.classList.contains('boarded-btn')) {
            const listItem = e.target.closest('li');
            listItem.style.backgroundColor = '#d4edda'; // Light green background
            e.target.disabled = true;
            listItem.querySelector('.no-show-btn').disabled = true;
            showModal('Ridership', `${listItem.querySelector('.student-name').textContent} marked as boarded.`);
        } else if (e.target.classList.contains('no-show-btn')) {
             const listItem = e.target.closest('li');
            listItem.style.backgroundColor = '#f8d7da'; // Light red background
             listItem.style.textDecoration = 'line-through';
            e.target.disabled = true;
            listItem.querySelector('.boarded-btn').disabled = true;
            showModal('Ridership', `${listItem.querySelector('.student-name').textContent} marked as no-show.`);
        } else if (e.target.id === 'scan-id-btn') {
            showModal('Scan ID', 'Simulating ID scan... Student identified: [Placeholder Name]');
        } else if (e.target.id === 'audio-nav-btn') {
            showModal('Navigation', 'Audio navigation toggled (Simulation)...');
        } else if (e.target.id === 'full-route-btn') {
            // Simulate showing turn-by-turn
             const routeDetails = document.createElement('div');
             routeDetails.style.textAlign = 'left';
             routeDetails.style.maxHeight = '300px';
             routeDetails.style.overflowY = 'auto';
             routeDetails.innerHTML = `
                <h4>Route BX41 AM - Turn-by-Turn (Simulated)</h4>
                <ul class="simple-list">
                    <li>Start at Depot</li>
                    <li>Turn Right on Main St</li>
                    <li>Continue 0.5 miles</li>
                    <li><strong>Stop 1:</strong> 123 Main St (ETA: 7:50 AM)</li>
                    <li>Turn Left on Oak Ave</li>
                    <li>Continue 1.2 miles</li>
                     <li><strong>Stop 2:</strong> Oak Ave & 1st St (ETA: 7:58 AM)</li>
                    <li>Turn Left on Elm St</li>
                     <li>Continue 0.2 miles</li>
                     <li><strong>Stop 3:</strong> 45 Elm St (ETA: 8:05 AM)</li>
                     <li>... (remaining stops) ...</li>
                     <li>Arrive at PS 123 (ETA: 8:25 AM)</li>
                </ul>
             `;
            showModal('Full Route Details', routeDetails);
        } else if (e.target.id === 'driver-alert-btn') {
            showModal('Send Alert', 'Alert sending options (e.g., Breakdown, Delay, Student Issue)... (Not Implemented)');
        } else if (e.target.id === 'acknowledge-alert-btn') {
            showModal('Acknowledge Alert', 'Alert: [Weather Warning - High Winds]. Acknowledged.', false, null, '', 'OK');
             e.target.style.display = 'none'; // Hide button after ack
        }
    });

     // School Admin Buttons
    schoolAdminView.addEventListener('click', (e) => {
        if (e.target.id === 'view-bus-details-btn') {
            showModal('Bus Details', 'Showing detailed map and status for selected school buses... (Not Implemented)');
        } else if (e.target.id === 'manage-student-info-btn') {
            showModal('Student Info', 'Navigating to student management section... (Not Implemented)');
        } else if (e.target.id === 'school-report-issue-btn') {
            showModal('Report Issue', 'Issue reporting interface for schools... (Not Implemented)');
        } else if (e.target.id === 'apply-school-filter-btn') {
            const filterValue = document.getElementById('school-bus-filter').value;
            showModal('Filter Applied', `Simulating map filter for: ${filterValue}`);
        } else if (e.target.id === 'generate-otp-report-btn') {
             showModal('Generate Report', 'Generating On-Time Performance Report for PS 123... (Simulated - Report would download/display)', false, null, '', 'OK');
        }
    });

     // OPT Admin Buttons
    optAdminView.addEventListener('click', (e) => {
        // Specific button actions
         if (e.target.id === 'apply-opt-filter-btn') {
            const searchValue = document.getElementById('opt-search').value;
            const statusFilter = document.getElementById('opt-filter-status').value;
            const boroughFilter = document.getElementById('opt-filter-borough').value;
            showModal('Filter/Search Applied', `Simulating search/filter: Query='${searchValue}', Status='${statusFilter}', Borough='${boroughFilter}'`);
         } else if (e.target.id === 'view-route-history-btn') {
             showModal('Route History', 'Simulating display of route history/replay for a selected route... (Not Implemented)');
         }
         // Catch other generic admin buttons
         else if (e.target.classList.contains('btn') && !e.target.id.includes('filter') && e.target.id !== 'logout-btn') {
            const actionText = e.target.textContent.trim();
            showModal('Admin Action', `Executing action: ${actionText}... (Not Implemented)`);
         }
         // Handle clickable event feed items
         else if (e.target.closest('.clickable-event')) {
             const eventItem = e.target.closest('.clickable-event');
             const eventType = eventItem.getAttribute('data-event-type');
             const requestId = eventItem.getAttribute('data-request-id');
             if (eventType === 'request') {
                showModal(
                    `Route Change Request (${requestId})`,
                    'SBC requested modifying QN05 start time by +5min due to traffic patterns. View full details?',
                    true,
                    () => { showModal('Request Action', `Request ${requestId} action (Approve/Reject/Comment) interface... (Not Implemented)`); },
                    'View Details',
                    'Dismiss'
                );
             }
         }
    });


    // Initial Setup
    showView('role-selection'); // Start at role selection
    appFooter.style.display = 'none'; // Hide footer initially
    logoutButton.style.display = 'none'; // Hide logout initially

});