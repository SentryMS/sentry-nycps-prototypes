document.addEventListener('DOMContentLoaded', () => {
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

    let currentRole = null;
    let loggedIn = false;
    let currentView = 'role-selection';

    function showView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            currentView = viewId;
        } else {
            console.error(`View with ID ${viewId} not found.`);
            roleSelectionView.classList.add('active'); // Fallback to role selection
            currentView = 'role-selection';
        }
        updateHeader();
        updateFooterNav(viewId); // Update footer based on current view
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
                default: headerTitle.textContent = 'NYCPS Transportation';
            }
        } else {
            logoutButton.style.display = 'none';
            userInfoSpan.textContent = '';
            headerTitle.textContent = 'NYCPS Transportation';
        }
    }

     function updateFooterNav(activeViewId) {
        if (!loggedIn) {
            appFooter.style.display = 'none';
            return;
        }
        appFooter.style.display = 'block';
        const navItems = appFooter.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Remove existing active class
            item.classList.remove('active');

            // Check if this nav item corresponds to the current view
            const targetView = item.getAttribute('data-view');
            if (targetView === activeViewId) {
                item.classList.add('active');
            }
            // Special handling for non-direct views (e.g., Settings)
            // Add more sophisticated logic if needed
        });
    }

    function showModal(title, message, showConfirm = false, onConfirm = null) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        if (showConfirm) {
            modalConfirm.style.display = 'inline-block';
            modalCancel.textContent = 'Cancel';
            modalConfirm.onclick = () => {
                closeModal();
                if (onConfirm) onConfirm();
            };
        } else {
            modalConfirm.style.display = 'none';
            modalCancel.textContent = 'Close';
        }
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show');
        modalConfirm.onclick = null; // Remove previous confirm action
    }

    // Event Listeners

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
        // Basic login simulation
        const username = document.getElementById('username').value;
        if (username) { // Simulate successful login if username is entered
            loggedIn = true;
            // Redirect based on role
            switch (currentRole) {
                case 'Parent/Student': showView('parent-student-view'); break;
                case 'Driver': showView('driver-view'); break;
                case 'School Admin': showView('school-admin-view'); break;
                case 'OPT Admin': showView('opt-admin-view'); break;
                default: showView('role-selection'); // Fallback
            }
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

    // Footer Navigation
    appFooter.addEventListener('click', (e) => {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            const targetViewId = navItem.getAttribute('data-view');
            if (targetViewId) {
                 if (targetViewId !== currentView) {
                     // Simple simulation: For non-dashboard views, just show a modal
                     if (targetViewId.includes('dashboard') || targetViewId.includes('view')) {
                         showView(targetViewId);
                     } else {
                         showModal('Navigation', `Navigating to ${navItem.textContent.trim()}... (Not Implemented)`);
                     }
                 }
            } else {
                 showModal('Navigation', `Action for ${navItem.textContent.trim()}... (Not Implemented)`);
            }
        }
    });

    // ---- Specific View Interactions ----

    // Parent/Student View Buttons
    parentStudentView.addEventListener('click', (e) => {
        if (e.target.id === 'mark-absent-btn') {
            showModal('Mark Absent', 'Are you sure you want to mark the student as absent for today?', true, () => {
                showModal('Confirmation', 'Student marked as absent for today.');
            });
        } else if (e.target.id === 'report-issue-btn') {
            showModal('Report Issue', 'Issue reporting feature coming soon...');
        } else if (e.target.id === 'view-schedule-btn') {
            showModal('View Schedule', 'Displaying student schedule details... (Not Implemented)');
        } else if (e.target.id === 'request-info-update-btn') {
            showModal('Request Update', 'Update request form/process coming soon...');
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
            showModal('Navigation', 'Displaying full route details... (Not Implemented)');
        } else if (e.target.id === 'driver-alert-btn') {
            showModal('Send Alert', 'Alert sending options... (Not Implemented)');
        }
    });

     // School Admin Buttons
    schoolAdminView.addEventListener('click', (e) => {
        if (e.target.id === 'view-bus-details-btn') {
            showModal('Bus Details', 'Showing detailed map and status for school buses... (Not Implemented)');
        } else if (e.target.id === 'manage-student-info-btn') {
            showModal('Student Info', 'Navigating to student management section... (Not Implemented)');
        } else if (e.target.id === 'school-report-issue-btn') {
            showModal('Report Issue', 'Issue reporting interface for schools... (Not Implemented)');
        }
    });

     // OPT Admin Buttons (Example)
    optAdminView.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) { // Catch any button click for now
            const actionText = e.target.textContent.trim();
             if (actionText !== 'Logout') { // Avoid double modal on logout
                showModal('Admin Action', `Executing action: ${actionText}... (Not Implemented)`);
             }
        }
    });


    // Initial Setup
    showView('role-selection'); // Start at role selection
    appFooter.style.display = 'none'; // Hide footer initially
    logoutButton.style.display = 'none'; // Hide logout initially

});