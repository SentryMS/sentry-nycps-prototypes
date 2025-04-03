document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // --- Get Element References ---
    const headerTitle = document.getElementById('header-title');
    const userInfoSpan = document.getElementById('user-info');
    const logoutButton = document.getElementById('logout-btn');
    const mainContent = document.getElementById('main-content'); // Reference to main area
    const sidebar = document.getElementById('app-sidebar');
    const sidebarNav = sidebar ? sidebar.querySelector('.sidebar-nav') : null; // CORRECTLY DEFINE sidebarNav
    const footer = document.getElementById('app-footer');
    const bottomNavContainer = document.querySelector('#app-footer .bottom-nav'); // Get bottom nav element

    // Views
    const views = document.querySelectorAll('section.view');
    const roleSelectionView = document.getElementById('role-selection');
    const loginView = document.getElementById('login-view');
    const parentStudentView = document.getElementById('parent-student-view');
    const driverView = document.getElementById('driver-view');
    const schoolAdminView = document.getElementById('school-admin-view');
    const optAdminView = document.getElementById('opt-admin-view');
    // Add references for other views later...

    // Login View Elements
    const loginForm = document.getElementById('login-form');
    const loginRoleTitle = document.getElementById('login-role-title');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Modal Elements
    const modal = document.getElementById('simpleModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const modalCloseHeader = document.getElementById('modalCloseHeader');
    const sidebarOverlay = document.getElementById('sidebar-overlay'); // Added overlay element
    let modalConfirmCallback = null;

    // Remove initial placeholder text
    const mainContentP = document.querySelector('.main-content p');
    if (mainContentP) { mainContentP.remove(); }

    // State Variables
    let currentRole = null;
    let loggedIn = false;

    // --- Sidebar Link Definitions ---
    const sidebarLinks = {
        'School Admin': [
            { icon: 'fa-tachometer-alt', text: 'Dashboard', target: 'school-admin-view' },
            { icon: 'fa-bus-alt', text: 'Bus Status', target: 'action:viewBusDetails' },
            { icon: 'fa-users-cog', text: 'Manage Students', target: 'action:manageStudents' },
            { icon: 'fa-flag', text: 'Report Issue', target: 'action:reportIssue' },
            { icon: 'fa-chart-line', text: 'Reports', target: 'action:generateReport' },
        ],
        'OPT Admin': [
            { icon: 'fa-tachometer-alt', text: 'System Dashboard', target: 'opt-admin-view' },
            { icon: 'fa-route', text: 'Routes', target: 'action:manageRoutes' },
            { icon: 'fa-map-marker-alt', text: 'Stops', target: 'action:manageStops' },
            { icon: 'fa-users', text: 'Users', target: 'action:manageUsers' },
            { icon: 'fa-bus-alt', text: 'Vehicles', target: 'action:manageVehicles' },
            { icon: 'fa-file-contract', text: 'Contracts', target: 'action:manageContracts' },
            { icon: 'fa-chart-bar', text: 'Reports', target: 'action:viewReports' },
            { icon: 'fa-bell', text: 'Alerts Config', target: 'action:configAlerts' },
            { icon: 'fa-exclamation-triangle', text: 'Escalations', target: 'action:viewEscalations' },
            { icon: 'fa-headset', text: 'Tickets', target: 'action:viewTickets' },
            { icon: 'fa-history', text: 'Route History', target: 'action:routeHistory' },
            { icon: 'fa-tools', text: 'Settings', target: 'action:viewSettings' },
        ]
    };

    // --- Bottom Nav Link Definitions ---
    const bottomNavLinks = {
        'Parent/Student': [
            { icon: 'fa-bus-alt', text: 'Status', target: 'parent-student-view' }, // Link to main view
            { icon: 'fa-qrcode', text: 'Bus Pass', target: 'action:showBusPassCard' }, // Action to scroll/focus? Or modal?
            { icon: 'fa-calendar-alt', text: 'Schedule', target: 'action:viewScheduleModal' },
            { icon: 'fa-exclamation-triangle', text: 'Report', target: 'action:reportIssueModal' },
        ],
        'Driver': [
            { icon: 'fa-route', text: 'Route', target: 'driver-view' }, // Link to main view
            { icon: 'fa-users', text: 'Riders', target: 'action:focusRidership' }, // Action to scroll/focus
            { icon: 'fa-list-ol', text: 'Stops', target: 'action:viewRouteListModal' },
            { icon: 'fa-bullhorn', text: 'Alert', target: 'action:sendAlertModal' },
        ],
        'School Admin': [
            { icon: 'fa-tachometer-alt', text: 'Dashboard', target: 'school-admin-view' },
            { icon: 'fa-search-location', text: 'Buses', target: 'action:focusBusOverview' },
            { icon: 'fa-bell', text: 'Alerts', target: 'action:focusAlertsList' },
            { icon: 'fa-users-cog', text: 'Students', target: 'action:manageStudentsModal' },
        ],
        'OPT Admin': [
            { icon: 'fa-tachometer-alt', text: 'Dashboard', target: 'opt-admin-view' },
            { icon: 'fa-search', text: 'Search', target: 'action:focusOptFilters' },
            { icon: 'fa-stream', text: 'Events', target: 'action:focusEventFeed' },
            { icon: 'fa-cogs', text: 'Actions', target: 'action:focusAdminActions' }
        ]
    };

    // --- Functions ---
    function showView(viewId) {
        let activeViewFound = false;
        views.forEach(view => {
            if (view.id === viewId) {
                view.classList.add('active');
                activeViewFound = true;
            } else {
                view.classList.remove('active');
            }
        });

        // Ensure role selection is shown if target view doesn't exist (fallback)
        if (!activeViewFound && viewId !== 'role-selection') {
            console.warn(`View ID '${viewId}' not found, falling back to role selection.`);
            roleSelectionView.classList.add('active');
            viewId = 'role-selection'; // Update viewId for subsequent logic
        }

        // Update header/UI based on view/login state
        if (loggedIn) {
            userInfoSpan.textContent = `Role: ${currentRole}`; // Basic user info
            logoutButton.style.display = 'inline-flex';
            document.body.classList.add('logged-in'); // Add logged-in class

            // Handle Sidebar Population/Visibility (Admins Only)
            if (currentRole === 'School Admin' || currentRole === 'OPT Admin') {
                document.body.classList.add('sidebar-active');
                populateSidebar(currentRole);
            } else {
                document.body.classList.remove('sidebar-active');
                populateSidebar(null);
            }

            // Populate Bottom Nav for ALL logged-in users
            populateBottomNav(currentRole);
        } else {
            // Reset on logout/initial view
            headerTitle.textContent = 'NYCPS Transportation';
            userInfoSpan.textContent = '';
            logoutButton.style.display = 'none';
            document.body.classList.remove('sidebar-active');
            document.body.classList.remove('logged-in');
            populateSidebar(null); // Clear sidebar on logout
            populateBottomNav(null); // Clear bottom nav on logout
        }

        // Update active state in sidebar/bottom nav after view change
        updateSidebarActiveState(viewId);
        updateBottomNavActiveState(viewId);

        console.log(`Switched to view: ${viewId}`);
    }

    // Function to populate the sidebar navigation
    function populateSidebar(role) {
        if (!sidebarNav) return; // Check if sidebarNav exists
        sidebarNav.innerHTML = ''; // Clear existing links

        const links = sidebarLinks[role];
        if (links) {
            links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = '#'; 
                linkElement.dataset.target = link.target; 
                linkElement.innerHTML = `
                    <i class="fas ${link.icon} fa-fw"></i>
                    <span>${link.text}</span>
                `;
                sidebarNav.appendChild(linkElement); // Append to sidebarNav
            });
        } 
    }

    // Function to populate the bottom navigation
    function populateBottomNav(role) {
        if (!bottomNavContainer) return;
        bottomNavContainer.innerHTML = ''; // Clear placeholder/old items

        const links = bottomNavLinks[role];
        if (links) {
            links.forEach(link => {
                const linkElement = document.createElement('div');
                linkElement.classList.add('nav-item');
                linkElement.dataset.target = link.target;
                linkElement.innerHTML = `
                    <i class="fas ${link.icon} fa-fw"></i>
                    <span>${link.text}</span>
                `;
                bottomNavContainer.appendChild(linkElement);
            });
        } else {
            // Keep footer empty if no links defined for role or not logged in
            bottomNavContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8em;">(Nav Unavailable)</span>'; 
        }
    }

    // Function to update the active link in the sidebar
    function updateSidebarActiveState(activeViewId) {
        if (!sidebarNav) return; // Check sidebarNav
        const currentLinks = sidebarNav.querySelectorAll('a'); // Query within sidebarNav
        currentLinks.forEach(link => {
            if (link.dataset.target === activeViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Function to update the active link in the bottom nav
    function updateBottomNavActiveState(activeViewId) {
        if (!bottomNavContainer) return;
        const currentItems = bottomNavContainer.querySelectorAll('.nav-item');
        currentItems.forEach(item => {
            // Only highlight if the target *is* the current view ID
            // Actions won't be highlighted here
            if (item.dataset.target === activeViewId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Modal Functions
    function showModal(title, message, showConfirm = false, confirmCallback = null, confirmText = 'Confirm', cancelText = 'Close') {
        modalTitle.textContent = title;
        if (typeof message === 'string') {
            modalMessage.innerHTML = `<p>${message}</p>`; // Allow simple HTML
        } else if (message instanceof HTMLElement) {
            modalMessage.innerHTML = ''; // Clear previous content
            modalMessage.appendChild(message);
        }
        modalConfirm.textContent = confirmText;
        modalCancel.textContent = cancelText;

        if (showConfirm) {
            modalConfirm.style.display = 'inline-flex';
            modalConfirmCallback = confirmCallback;
        } else {
            modalConfirm.style.display = 'none';
            modalConfirmCallback = null;
        }
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
        modalTitle.textContent = '';
        modalMessage.innerHTML = '';
        modalConfirmCallback = null;
    }

    // --- Event Listeners ---

    // Role Selection
    if (roleSelectionView) {
        roleSelectionView.addEventListener('click', (e) => {
            const roleButton = e.target.closest('.role-btn');
            if (roleButton) {
                currentRole = roleButton.getAttribute('data-role');
                console.log(`Role selected: ${currentRole}`);
                // Navigate to Login View
                loginRoleTitle.textContent = `${currentRole} Login`;
                showView('login-view');
                // Remove was-validated class if present from previous attempts
                loginForm.classList.remove('was-validated');
                loginForm.reset(); // Reset form fields
                usernameInput.focus(); // Focus on username field
                // alert(`Selected ${currentRole}. Login view not yet implemented.`); // Remove temporary alert
            }
        });
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            e.stopPropagation(); // Prevent it bubbling up

            if (loginForm.checkValidity()) {
                // Form is valid (HTML5 validation passed)
                const username = usernameInput.value;
                console.log(`Login attempt for role ${currentRole} with user ${username}`);

                // --- Simulate Successful Login --- 
                loggedIn = true;

                // Determine which dashboard to show
                let targetViewId = 'parent-student-view'; // Default
                if (currentRole === 'Driver') targetViewId = 'driver-view';
                else if (currentRole === 'School Admin') targetViewId = 'school-admin-view';
                else if (currentRole === 'OPT Admin') targetViewId = 'opt-admin-view';

                showView(targetViewId);
                loginForm.classList.remove('was-validated');

                // Show a temporary success message (optional)
                // showModal('Login Successful', `Welcome, ${username}! Loading your dashboard...`);

            } else {
                // Form is invalid, show validation feedback
                console.log('Login form invalid');
            }

            // Add was-validated class AFTER checking, so feedback shows on first invalid submit
            loginForm.classList.add('was-validated');
        });
    }

    // Logout Button
    logoutButton.addEventListener('click', () => {
        loggedIn = false;
        currentRole = null;
        showView('role-selection'); // This will handle removing sidebar-active and logged-in classes
    });

    // Modal Close/Confirm
    modalCancel.onclick = closeModal;
    modalCloseHeader.onclick = closeModal;
    modalConfirm.onclick = () => {
        if (modalConfirmCallback) {
            modalConfirmCallback();
        }
        closeModal();
    };
    // Close modal if clicking outside the content
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Close sidebar when clicking overlay (mobile only)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-active');
        });
    }

    // Sidebar Navigation Click Handler
    if (sidebarNav) { // Attach listener to sidebarNav
        sidebarNav.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('a');
            if (!link || !link.dataset.target) return;

            const target = link.dataset.target;

            // Remove active class from all links within sidebarNav
            sidebarNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            // Add active class to the clicked link
            link.classList.add('active');

            if (target.startsWith('action:')) {
                const action = target.substring(7);
                // Simulate actions - most will show a modal
                console.log(`Sidebar action clicked: ${action}`);
                showModal('Action Triggered', `Simulating action: ${link.textContent.trim()}... (Not Implemented)`);
                // Special cases can be added here if needed
            } else {
                // Navigate to the target view
                showView(target);
            }

            // Close sidebar on mobile after click (optional)
            // if (window.innerWidth < 992) { 
            //    document.body.classList.remove('sidebar-active');
            // }
        });
    }

    // Bottom Navigation Click Handler
    if (bottomNavContainer) {
        bottomNavContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (!item || !item.dataset.target) return;

            const target = item.dataset.target;

            // Update active state immediately for responsiveness
            bottomNavContainer.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            if (target.startsWith('action:')) {
                const action = target.substring(7);
                console.log(`Bottom nav action clicked: ${action}`);
                // Handle specific actions - TBD: focus/scroll or trigger modals
                if (action === 'viewScheduleModal') {
                    // Manually find and click the corresponding button in the main view
                    parentStudentView.querySelector('#view-schedule-btn')?.click();
                } else if (action === 'reportIssueModal') {
                    parentStudentView.querySelector('#report-issue-btn')?.click();
                } else if (action === 'viewRouteListModal') {
                    driverView.querySelector('#full-route-btn')?.click();
                } else if (action === 'sendAlertModal') {
                    driverView.querySelector('#driver-alert-btn')?.click();
                } else {
                    showModal('Mobile Action', `Simulating action: ${item.textContent.trim()}... (Focus/Scroll TBD)`);
                }
            } else {
                // Navigate to the target view
                showView(target);
            }
        });
    }

    // Parent/Student View Actions
    if (parentStudentView) {
        parentStudentView.addEventListener('click', (e) => {
            const target = e.target.closest('button'); // Find the closest button clicked
            if (!target) return; // Exit if click wasn't on or inside a button

            if (target.id === 'view-alerts-btn') {
                const alertContent = document.createElement('ul');
                alertContent.classList.add('simple-list');
                alertContent.innerHTML = `
                    <li>
                        <span class="badge danger"><i class="fas fa-exclamation-circle"></i> Delay</span> 
                        <div>
                            <strong>Bus BX41 Delay:</strong> Approx. 10-15 mins late due to unexpected traffic on Main St.
                            <small class="d-block text-muted">Reported: 7:58 AM</small>
                        </div>
                    </li>
                    <li>
                        <span class="badge info"><i class="fas fa-info-circle"></i> Update</span> 
                        <div>
                            <strong>PM Route Change (Tomorrow):</strong> Student will be on route BX45 tomorrow afternoon.
                             <small class="d-block text-muted">Updated: Yesterday</small>
                         </div>
                     </li>
                    <li>
                        <span class="badge success"><i class="fas fa-check-circle"></i> Resolved</span> 
                        <div>
                            <strong>Previous Issue Resolved:</strong> The mechanical issue reported yesterday was fixed.
                            <small class="d-block text-muted">Resolved: 6:30 PM Yesterday</small>
                        </div>
                    </li>
                `;
                showModal('Recent Notifications', alertContent);
            }
            else if (target.id === 'mark-absent-btn') {
                showModal(
                    'Mark Absent',
                    'Confirm student absence for today? This will notify the driver and school.',
                    true, // Show confirm button
                    () => { showModal('Confirmation', 'Student marked as absent for today.'); }, // Callback on confirm
                    'Confirm Absence',
                    'Cancel'
                );
            }
             else if (target.id === 'report-issue-btn') {
                 showModal('Report Issue', 'Issue reporting feature integration pending...');
             }
            else if (target.id === 'view-schedule-btn') {
                 // Reverted to simpler modal content to fix syntax errors
                 showModal('Student Schedule (Simulated)', 'AM: BX41 (8:00 AM), PM: BX45 (3:45 PM). Stop: Main St & 1st Ave.');
            }
            else if (target.id === 'request-info-update-btn') {
                showModal('Request Info Update', 'Info update request portal integration pending...');
            }
        });
    }

    // Driver View Actions
    if (driverView) {
        driverView.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            if (!targetButton) return;

            const boardedBtn = e.target.closest('.boarded-btn');
            const noShowBtn = e.target.closest('.no-show-btn');

            // Ridership Actions
            if (boardedBtn) {
                const listItem = boardedBtn.closest('li');
                if (listItem && !listItem.classList.contains('status-noshow')) {
                    listItem.classList.add('status-boarded');
                    // Disable buttons after action
                    listItem.querySelectorAll('.student-actions button').forEach(btn => btn.disabled = true);
                    // Optional: Confirmation modal (might be too noisy)
                    // showModal('Ridership', `${listItem.querySelector('.student-name').textContent.trim()} marked boarded.`);
                }
            } else if (noShowBtn) {
                 const listItem = noShowBtn.closest('li');
                if (listItem && !listItem.classList.contains('status-boarded')) {
                    listItem.classList.add('status-noshow');
                    listItem.querySelectorAll('.student-actions button').forEach(btn => btn.disabled = true);
                    // Optional: Confirmation modal
                    // showModal('Ridership', `${listItem.querySelector('.student-name').textContent.trim()} marked no-show.`);
                 }
            }
            // Other Driver Buttons
            else if (targetButton.id === 'scan-id-btn') {
                showModal('Scan Student ID', 'Simulating ID scan... Student [Jane Doe] identified & marked boarded.');
                // Find Jane Doe in the list and mark her as boarded visually
                const janeDoeItem = Array.from(driverView.querySelectorAll('.ridership-list li')).find(li => li.textContent.includes('Doe, Jane'));
                if(janeDoeItem && !janeDoeItem.classList.contains('status-boarded') && !janeDoeItem.classList.contains('status-noshow')) {
                    janeDoeItem.classList.add('status-boarded');
                    janeDoeItem.querySelectorAll('.student-actions button').forEach(btn => btn.disabled = true);
                }
            }
            else if (targetButton.id === 'audio-nav-btn') {
                showModal('Navigation', 'Audio navigation toggled.');
            }
            else if (targetButton.id === 'full-route-btn') {
                 // Reverted to simpler modal content to fix syntax errors
                 showModal('Route Stop List', 'Depot -> Stop 1 -> Stop 2 -> Stop 3 (Current) -> ... -> PS 123');
            }
            else if (targetButton.id === 'driver-alert-btn') {
                // Potential: Show a modal with alert options (breakdown, delay, etc.)
                showModal('Send Alert', 'Select Alert Type (e.g., Breakdown, Delay, Student Issue)... (Not Implemented)');
            }
            else if (targetButton.id === 'acknowledge-alert-btn') {
                showModal('Alert Acknowledged', 'Alert: [Heavy Traffic Reported Ahead] has been acknowledged.', false, null, '', 'OK');
                 targetButton.style.display = 'none'; // Hide button after ack
            }
        });
    }

    // School Admin View Actions
    if (schoolAdminView) {
        schoolAdminView.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            if (!targetButton) return;

            if (targetButton.id === 'apply-school-filter-btn') {
                const filterValue = schoolAdminView.querySelector('#school-bus-filter').value;
                showModal('Filter Applied', `Simulating map filter for: ${filterValue}`);
            }
            else if (targetButton.id === 'generate-otp-report-btn') {
                 showModal('Generate Report', 'Generating On-Time Performance Report for PS 123... (Report would download/display)', false, null, '', 'OK');
            }
            else if (targetButton.classList.contains('view-details-btn')) { // Handler for View Details in table
                const row = targetButton.closest('tr');
                const route = row.cells[0].textContent;
                const bus = row.cells[1].textContent;
                showModal(`Bus Details: ${route} (${bus})`, `Loading detailed status, location history, and assigned students for ${bus}... (Not Implemented)`);
            }
            else if (targetButton.closest('.action-buttons')) { // Generic handler for other action buttons
                const actionText = targetButton.textContent.trim();
                // Avoid re-triggering report generation
                if (targetButton.id !== 'generate-otp-report-btn' && targetButton.id !== 'manage-student-info-btn') { 
                     showModal('School Admin Action', `Initiating action: ${actionText}... (Not Implemented)`);
                }
            }
            // Handle Manage Students separately if needed
            else if (targetButton.id === 'manage-student-info-btn') {
                showModal('Manage Students', 'Navigating to student information portal for PS 123... (Not Implemented)');
            }
        });
    }

    // OPT Admin View Actions
    if (optAdminView) {
        optAdminView.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            const clickableEvent = e.target.closest('.clickable-event');

            // Filter/Search Button
            if (targetButton && targetButton.id === 'apply-opt-filter-btn') {
                const searchValue = optAdminView.querySelector('#opt-search').value;
                const statusFilter = optAdminView.querySelector('#opt-filter-status').value;
                const boroughFilter = optAdminView.querySelector('#opt-filter-borough').value;
                showModal('Filter/Search Applied', `Simulating OPT search/filter: Query='${searchValue || `(none)`}', Status='${statusFilter}', Borough='${boroughFilter}'`);
            }
            // Route History Button
            else if (targetButton && targetButton.id === 'view-route-history-btn') {
                 showModal('Route History', 'Select route and date range to view history/replay... (Not Implemented)');
            }
            // Generic Admin Action Buttons (excluding specific handled ones)
            else if (targetButton && targetButton.closest('.admin-actions')) {
                const actionText = targetButton.textContent.trim();
                const iconClass = targetButton.querySelector('i')?.classList[1]; // Get the specific icon class (e.g., fa-route)

                let actionTarget = actionText; // Default target description
                if (iconClass === 'fa-route') actionTarget = 'Route Management';
                else if (iconClass === 'fa-map-marker-alt') actionTarget = 'Stop Management';
                else if (iconClass === 'fa-users') actionTarget = 'User Management';
                else if (iconClass === 'fa-bus-alt') actionTarget = 'Vehicle Management';
                else if (iconClass === 'fa-file-contract') actionTarget = 'Contract Management';
                else if (iconClass === 'fa-chart-bar') actionTarget = 'Reporting Dashboard';
                else if (iconClass === 'fa-bell') actionTarget = 'Alert Configuration';
                else if (iconClass === 'fa-exclamation-triangle') actionTarget = 'Escalation Queue';
                else if (iconClass === 'fa-headset') actionTarget = 'Support Ticket System';
                else if (iconClass === 'fa-broadcast-tower') actionTarget = 'Notification Broadcast Tool';
                else if (iconClass === 'fa-tools') actionTarget = 'System Settings';
                else if (iconClass === 'fa-map') actionTarget = 'Map Data Configuration';
                // Exclude Route History button as it's handled separately
                if (targetButton.id !== 'view-route-history-btn') { 
                    showModal('Admin Action', `Navigating to ${actionTarget}... (Not Implemented)`);
                }
            }
            // Clickable Event Feed Items
            else if (clickableEvent) {
                 const eventType = clickableEvent.getAttribute('data-event-type');
                 const requestId = clickableEvent.getAttribute('data-request-id'); // Example attribute
                 let modalTitleText = 'Event Details';
                 let modalBodyText = 'Details for this event...';

                 // --- Simulate specific event interactions --- 
                 if (eventType === 'request' && requestId === 'RC123') { // Specific handler for route change
                    modalTitleText = `Route Change Request (${requestId})`;
                    modalBodyText = 'SBC requests modifying QN05 start time by +5min due to consistent traffic delays near Stop 2. Impact analysis suggests minimal disruption to other stops. Approve?';
                    showModal(
                        modalTitleText,
                        modalBodyText,
                        true, // Show confirm
                        () => { showModal('Request Approved', `Route QN05 start time change approved and scheduled.`); },
                        'Approve Request', // Confirm text
                        'Reject/Comment' // Cancel text
                    );
                } else if (eventType === 'request' && requestId === 'ADDR01') {
                    modalTitleText = `Address Change Request (${requestId})`;
                    modalBodyText = 'Parent request to change PM drop-off address for student #98765. Requires verification and potential route adjustment. View details?';
                     showModal(
                       modalTitleText,
                       modalBodyText,
                       true,
                       () => { showModal('View Request', `Loading details for address change ${requestId}... (Not Implemented)`); },
                       'View Details',
                       'Dismiss'
                    );
                 } else if (eventType === 'issue' && requestId === 'TKT1023') { // Handler for new issue event
                    modalTitleText = `New Issue Reported (${requestId})`;
                    modalBodyText = 'Driver #887 (Bus BK55) reports Flat Tire at [Location]. Vehicle requires immediate assistance. Assign nearest roadside assistance?';
                     showModal(
                       modalTitleText,
                       modalBodyText,
                       true,
                       () => { showModal('Action Logged', `Roadside assistance dispatched to Bus BK55.`); },
                       'Dispatch Assistance',
                       'View Details / Manual Assign'
                    );
                 } else {
                     // Generic handler for other clickable events (or non-clickable ones if needed)
                     // Non-clickable events won't trigger this due to the initial check for clickableEvent
                     showModal(modalTitleText, `${modalBodyText} (Event ID: ${requestId || 'N/A'})`);
                 }
             } // End of master if/else if for OPT Admin listener
        }); // End of OPT Admin event listener
    } // End of if (optAdminView)

    // --- Initial Setup ---
    showView('role-selection'); // Start at role selection

}); // END OF DOMContentLoaded listener