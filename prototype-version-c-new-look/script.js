document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // --- Mobile optimization functions ---
    function handleMobileOptimization() {
        const headerTitle = document.getElementById('header-title');

        // Apply short title for small screens
        if (window.innerWidth <= 767 && headerTitle) {
            // Store original text if not already stored
            if (!headerTitle.dataset.originalTitle) {
                headerTitle.dataset.originalTitle = headerTitle.textContent;
            }

            // Use CSS-based content replacement for better performance
            headerTitle.dataset.shortTitle = "true";
            // Hide the original text for screens that support ::after
            headerTitle.textContent = "";
        } else if (headerTitle && headerTitle.dataset.originalTitle) {
            // Restore original title on larger screens
            headerTitle.dataset.shortTitle = "false";
            headerTitle.textContent = headerTitle.dataset.originalTitle;
        }

        // Force recalculate map sizes if present (for orientation changes)
        if (window.innerWidth <= 768) {
            setTimeout(resizeAllMaps, 300);
        }
    }

    // Initialize mobile optimizations
    handleMobileOptimization();

    // Re-apply on resize and orientation change
    window.addEventListener('resize', handleMobileOptimization);
    window.addEventListener('orientationchange', handleMobileOptimization);

    // --- Mapbox Configuration ---
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2FydGlrc2hhbmthcjgiLCJhIjoiY21heDRzNWI2MG5ndzJqcTBwemRzb201biJ9.acWNHPsR3coetekAP0wTQA';

    // Map instances for different views
    let parentMap = null;
    let driverMap = null;
    let schoolMap = null;
    let adminMap = null;

    // NYC Coordinates (City Hall as center)
    const nycCoordinates = {
        center: [-73.9979, 40.7128],
        zoom: 10
    };

    // Sample data for map elements
    const busData = [
        { id: 'B1234', routeId: 'BX41', lat: -73.9800, lng: 40.7140, status: 'active', speed: 18, heading: 90, nextStop: 'Main St & 1st Ave', studentCount: 23 },
        { id: 'B5678', routeId: 'QN05', lat: -73.9700, lng: 40.7220, status: 'delayed', speed: 10, heading: 180, nextStop: 'Broadway & 34th St', studentCount: 18 },
        { id: 'B9012', routeId: 'BK22', lat: -73.9500, lng: 40.6900, status: 'inactive', speed: 0, heading: 270, nextStop: 'Atlantic Ave & Court St', studentCount: 0 }
    ];

    const schoolData = [
        { id: 'PS123', name: 'PS 123', lat: -73.9750, lng: 40.7200, busCount: 8, studentCount: 120 },
        { id: 'PS456', name: 'PS 456', lat: -73.9650, lng: 40.7150, busCount: 5, studentCount: 85 },
        { id: 'MS789', name: 'MS 789', lat: -73.9550, lng: 40.7250, busCount: 12, studentCount: 220 }
    ];

    const stopData = [
        { id: 'ST001', name: 'Main St & 1st Ave', lat: -73.9820, lng: 40.7160, time: '7:45 AM', studentCount: 5 },
        { id: 'ST002', name: 'Park Ave & 42nd St', lat: -73.9770, lng: 40.7190, time: '7:52 AM', studentCount: 3 },
        { id: 'ST003', name: 'Lexington Ave & 86th St', lat: -73.9570, lng: 40.7280, time: '8:05 AM', studentCount: 4 }
    ];

    // Routes (paths) for buses
    const routeData = {
        'BX41': [
            [-73.9820, 40.7160], // Stop 1
            [-73.9800, 40.7140], // Current bus position
            [-73.9770, 40.7190], // Stop 2
            [-73.9750, 40.7200]  // School
        ]
    };

    // Initialize maps for different views
    function initializeMaps() {
        // Initialize Parent/Student Map
        if (document.getElementById('parent-map')) {
            parentMap = new mapboxgl.Map({
                container: 'parent-map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: nycCoordinates.center,
                zoom: 12,
                width: '100%',
                height: '100%'
            });

            // Add navigation controls
            parentMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Force resize to ensure map fills container
            parentMap.resize();

            // Add bus, school and route when map loads
            parentMap.on('load', () => {
                // Force resize again after load
                setTimeout(() => parentMap.resize(), 100);

                // Get first bus for display
                const bus = busData[0];

                // Add bus marker
                const busMarkerElement = document.createElement('div');
                busMarkerElement.className = 'bus-marker';

                new mapboxgl.Marker(busMarkerElement)
                    .setLngLat([bus.lat, bus.lng])
                    .setPopup(new mapboxgl.Popup().setHTML(`
                        <h4>Bus #${bus.id}</h4>
                        <p>Route: ${bus.routeId}</p>
                        <p>Next Stop: ${bus.nextStop}</p>
                        <p>Status: ${bus.status === 'active' ? 'On time' : 'Delayed'}</p>
                    `))
                    .addTo(parentMap);

                // Add route line
                parentMap.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': routeData['BX41']
                        }
                    }
                });

                parentMap.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#10b981',
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });

                // Add stop markers
                routeData['BX41'].forEach((coord, index) => {
                    if (index !== 1) { // Skip bus position
                        const stopElement = document.createElement('div');
                        stopElement.className = 'stop-marker';

                        new mapboxgl.Marker(stopElement)
                            .setLngLat(coord)
                            .setPopup(new mapboxgl.Popup().setHTML(`
                                <h4>Bus Stop ${index + 1}</h4>
                                <p>${index === 0 ? 'First pickup' : index === routeData['BX41'].length - 1 ? 'Final destination' : 'Intermediate stop'}</p>
                            `))
                            .addTo(parentMap);
                    }
                });

                // Set map view
                parentMap.fitBounds([
                    [Math.min(...routeData['BX41'].map(coord => coord[0])) - 0.01, Math.min(...routeData['BX41'].map(coord => coord[1])) - 0.01],
                    [Math.max(...routeData['BX41'].map(coord => coord[0])) + 0.01, Math.max(...routeData['BX41'].map(coord => coord[1])) + 0.01]
                ], { padding: 50 });
            });
        }

        // Initialize Driver Map
        if (document.getElementById('driver-map')) {
            driverMap = new mapboxgl.Map({
                container: 'driver-map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: nycCoordinates.center,
                zoom: 14,
                width: '100%',
                height: '100%'
            });

            // Add navigation and geolocate controls
            driverMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
            driverMap.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }), 'top-right');

            // Force resize to ensure map fills container
            driverMap.resize();

            // Add route and stops when map loads
            driverMap.on('load', () => {
                // Force resize again after load
                setTimeout(() => driverMap.resize(), 100);

                // Add route line
                driverMap.addSource('driver-route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': routeData['BX41']
                        }
                    }
                });

                driverMap.addLayer({
                    'id': 'driver-route',
                    'type': 'line',
                    'source': 'driver-route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#10b981',
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });

                // Add driver's position marker
                const driverPositionElement = document.createElement('div');
                driverPositionElement.className = 'bus-marker';

                new mapboxgl.Marker(driverPositionElement)
                    .setLngLat(routeData['BX41'][1]) // Current position
                    .addTo(driverMap);

                // Add stop markers with more detailed info
                routeData['BX41'].forEach((coord, index) => {
                    if (index !== 1) { // Skip current position
                        const stopElement = document.createElement('div');
                        stopElement.className = 'stop-marker';

                        let stopInfo;
                        if (index === 0) {
                            stopInfo = `
                                <h4>Stop 1: Pickup</h4>
                                <p>Main St & 1st Ave</p>
                                <p>Scheduled: 7:45 AM</p>
                                <p>Students: 5</p>
                            `;
                        } else if (index === routeData['BX41'].length - 1) {
                            stopInfo = `
                                <h4>Final Stop: School</h4>
                                <p>PS 123</p>
                                <p>ETA: 8:15 AM</p>
                            `;
                        } else {
                            stopInfo = `
                                <h4>Stop ${index + 1}</h4>
                                <p>Park Ave & 42nd St</p>
                                <p>ETA: 8:05 AM</p>
                                <p>Students: 3</p>
                            `;
                        }

                        new mapboxgl.Marker(stopElement)
                            .setLngLat(coord)
                            .setPopup(new mapboxgl.Popup().setHTML(stopInfo))
                            .addTo(driverMap);
                    }
                });

                // Set map view for driver - slightly closer
                driverMap.fitBounds([
                    [Math.min(...routeData['BX41'].map(coord => coord[0])) - 0.005, Math.min(...routeData['BX41'].map(coord => coord[1])) - 0.005],
                    [Math.max(...routeData['BX41'].map(coord => coord[0])) + 0.005, Math.max(...routeData['BX41'].map(coord => coord[1])) + 0.005]
                ], { padding: 50 });
            });
        }

        // Initialize School Admin Map
        if (document.getElementById('school-map')) {
            schoolMap = new mapboxgl.Map({
                container: 'school-map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: nycCoordinates.center,
                zoom: 11,
                width: '100%',
                height: '100%'
            });

            // Add navigation controls
            schoolMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Force resize to ensure map fills container
            schoolMap.resize();

            // Add school and all buses for this school
            schoolMap.on('load', () => {
                // Force resize again after load
                setTimeout(() => schoolMap.resize(), 100);

                // Add school marker
                const schoolMarkerElement = document.createElement('div');
                schoolMarkerElement.className = 'school-marker';

                new mapboxgl.Marker(schoolMarkerElement)
                    .setLngLat([schoolData[0].lat, schoolData[0].lng])
                    .setPopup(new mapboxgl.Popup().setHTML(`
                        <h4>${schoolData[0].name}</h4>
                        <p>Buses: ${schoolData[0].busCount}</p>
                        <p>Students: ${schoolData[0].studentCount}</p>
                    `))
                    .addTo(schoolMap);

                // Add all bus markers
                busData.forEach(bus => {
                    const busElement = document.createElement('div');
                    busElement.className = 'bus-marker';

                    // Add different styling for delayed buses
                    if (bus.status === 'delayed') {
                        busElement.style.filter = 'hue-rotate(150deg)';
                    }

                    new mapboxgl.Marker(busElement)
                        .setLngLat([bus.lat, bus.lng])
                        .setPopup(new mapboxgl.Popup().setHTML(`
                            <h4>Bus #${bus.id}</h4>
                            <p>Route: ${bus.routeId}</p>
                            <p>Students: ${bus.studentCount}</p>
                            <p>Status: ${bus.status === 'active' ? 'On time' : bus.status === 'delayed' ? 'Delayed' : 'Inactive'}</p>
                            <button class="btn btn-sm btn-primary" onclick="alert('Bus details view would open here')">View Details</button>
                        `))
                        .addTo(schoolMap);
                });

                // Set bounds to include school and all buses
                const allCoords = [
                    [schoolData[0].lat, schoolData[0].lng],
                    ...busData.map(bus => [bus.lat, bus.lng])
                ];

                schoolMap.fitBounds([
                    [Math.min(...allCoords.map(coord => coord[0])) - 0.01, Math.min(...allCoords.map(coord => coord[1])) - 0.01],
                    [Math.max(...allCoords.map(coord => coord[0])) + 0.01, Math.max(...allCoords.map(coord => coord[1])) + 0.01]
                ], { padding: 50 });
            });
        }

        // Initialize OPT Admin Map
        if (document.getElementById('admin-map')) {
            adminMap = new mapboxgl.Map({
                container: 'admin-map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: nycCoordinates.center,
                zoom: 10,
                width: '100%',
                height: '100%'
            });

            // Add navigation controls
            adminMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Force resize to ensure map fills container
            adminMap.resize();

            // Add all schools and buses
            adminMap.on('load', () => {
                // Force resize again after load
                setTimeout(() => adminMap.resize(), 100);

                // Add all school markers
                schoolData.forEach(school => {
                    const schoolElement = document.createElement('div');
                    schoolElement.className = 'school-marker';

                    new mapboxgl.Marker(schoolElement)
                        .setLngLat([school.lat, school.lng])
                        .setPopup(new mapboxgl.Popup().setHTML(`
                            <h4>${school.name}</h4>
                            <p>Buses: ${school.busCount}</p>
                            <p>Students: ${school.studentCount}</p>
                        `))
                        .addTo(adminMap);
                });

                // Add all bus markers
                busData.forEach(bus => {
                    const busElement = document.createElement('div');
                    busElement.className = 'bus-marker';

                    // Add different styling for different statuses
                    if (bus.status === 'delayed') {
                        busElement.style.filter = 'hue-rotate(150deg)';
                    } else if (bus.status === 'inactive') {
                        busElement.style.opacity = '0.5';
                    }

                    new mapboxgl.Marker(busElement)
                        .setLngLat([bus.lat, bus.lng])
                        .setPopup(new mapboxgl.Popup().setHTML(`
                            <h4>Bus #${bus.id}</h4>
                            <p>Route: ${bus.routeId}</p>
                            <p>Students: ${bus.studentCount}</p>
                            <p>Status: ${bus.status === 'active' ? 'On time' : bus.status === 'delayed' ? 'Delayed' : 'Inactive'}</p>
                            <button class="btn btn-sm btn-primary" onclick="alert('Bus details view would open here')">View Details</button>
                        `))
                        .addTo(adminMap);
                });

                // Add borough boundaries (placeholder)
                adminMap.addSource('boroughs', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [[
                                [-74.03, 40.69],
                                [-73.98, 40.69],
                                [-73.98, 40.73],
                                [-74.03, 40.73],
                                [-74.03, 40.69]
                            ]]
                        }
                    }
                });

                adminMap.addLayer({
                    'id': 'borough-boundaries',
                    'type': 'line',
                    'source': 'boroughs',
                    'layout': {},
                    'paint': {
                        'line-color': '#0ea5e9',
                        'line-width': 2,
                        'line-opacity': 0.5
                    }
                });
            });
        }
    }

    // Initialize QR code generator
    function generateQRCode() {
        const qrCodeContainer = document.getElementById('student-qr-code');
        if (qrCodeContainer) {
            // Generate a QR code for student ID
            const studentId = '12345';

            // Clear existing content
            qrCodeContainer.innerHTML = '';

            // Generate QR code using the qrcode.js library
            QRCode.toCanvas(qrCodeContainer, studentId, {
                width: 180,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                errorCorrectionLevel: 'H'
            }, function (error) {
                if (error) console.error(error);

                // Add student ID text below QR code
                const idElement = document.createElement('div');
                idElement.className = 'student-id';
                idElement.textContent = `Student ID: ${studentId}`;
                qrCodeContainer.appendChild(idElement);

                // Add instruction text
                const instructionElement = document.createElement('div');
                instructionElement.className = 'qr-code-text';
                instructionElement.textContent = 'Present this pass to the driver when boarding';
                qrCodeContainer.appendChild(instructionElement);
            });
        }
    }

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

            // Initialize maps when their view becomes active
            if (viewId === 'parent-student-view') {
                if (!parentMap) initializeMaps();
                generateQRCode();
                // Force resize after a short delay to ensure proper rendering
                setTimeout(() => {
                    if (parentMap) parentMap.resize();
                }, 300);
            } else if (viewId === 'driver-view') {
                if (!driverMap) initializeMaps();
                // Force resize after a short delay to ensure proper rendering
                setTimeout(() => {
                    if (driverMap) driverMap.resize();
                }, 300);
            } else if (viewId === 'school-admin-view') {
                if (!schoolMap) initializeMaps();
                // Force resize after a short delay to ensure proper rendering
                setTimeout(() => {
                    if (schoolMap) schoolMap.resize();
                }, 300);
            } else if (viewId === 'opt-admin-view') {
                if (!adminMap) initializeMaps();
                // Force resize after a short delay to ensure proper rendering
                setTimeout(() => {
                    if (adminMap) adminMap.resize();
                }, 300);
            }

            // For any view with maps, trigger resize after animation completes
            setTimeout(resizeAllMaps, 500);
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

    // Close sidebar when clicking close button
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', () => {
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
                if (janeDoeItem && !janeDoeItem.classList.contains('status-boarded') && !janeDoeItem.classList.contains('status-noshow')) {
                    janeDoeItem.classList.add('status-boarded');
                    janeDoeItem.querySelectorAll('.student-actions button').forEach(btn => btn.disabled = true);
                }
            }
            else if (targetButton.id === 'audio-nav-btn') {
                showModal('Audio Navigation', 'Audio navigation activated: "Turn left on Elm Street in 200 feet."');
            }
            else if (targetButton.id === 'full-route-btn') {
                // Create route list content
                const routeListContent = document.createElement('ul');
                routeListContent.classList.add('simple-list');
                routeListContent.innerHTML = `
                    <li class="current-stop"><span class="badge warning">Current</span> <strong class="stop-name">Stop 3:</strong> Oak Hill Apartments (8:05 AM)</li>
                    <li><span class="badge">Next</span> <strong class="stop-name">Stop 4:</strong> Central Park West (8:12 AM)</li>
                    <li><span class="badge">Next</span> <strong class="stop-name">Stop 5:</strong> Metro Heights (8:19 AM)</li>
                    <li><span class="badge">Next</span> <strong class="stop-name">Stop 6:</strong> West Village (8:26 AM)</li>
                    <li><span class="badge success">School</span> <strong class="stop-name">PS 123</strong> (8:35 AM)</li>
                `;
                showModal('Route BX41 - All Stops', routeListContent);
            }
            else if (targetButton.id === 'driver-alert-btn') {
                // Create alert form content
                const alertFormContent = document.createElement('div');
                alertFormContent.innerHTML = `
                    <div class="form-group">
                        <label for="alert-type">Alert Type:</label>
                        <select id="alert-type" class="form-control">
                            <option>Bus Delay</option>
                            <option>Road Closure</option>
                            <option>Mechanical Issue</option>
                            <option>Student Incident</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="alert-desc">Description:</label>
                        <textarea id="alert-desc" class="form-control" rows="3" placeholder="Describe the issue..."></textarea>
                    </div>
                `;
                showModal('Send Alert to Dispatch', alertFormContent, true, () => {
                    showModal('Alert Sent', 'Your alert has been sent to dispatch. Someone will contact you shortly.');
                }, 'Send Alert');
            }
            else if (targetButton.id === 'acknowledge-alert-btn') {
                showModal('New Alert', 'Traffic advisory: Accident reported ahead on Main St near your route. Consider alternate route.', true, () => {
                    targetButton.classList.remove('btn-warning');
                    targetButton.classList.add('btn-secondary');
                }, 'Acknowledge');
            }
        });
    }

    // School Admin View Actions
    if (schoolAdminView) {
        schoolAdminView.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            if (!targetButton) return;

            if (targetButton.id === 'view-bus-details-btn') {
                showModal('Bus Detail View', 'Bus detail view would display current location, status, and student list for selected buses.');
            }
            else if (targetButton.id === 'manage-student-info-btn') {
                showModal('Student Management', 'Student management interface would allow viewing and updating student transportation details.');
            }
            else if (targetButton.id === 'school-report-issue-btn') {
                showModal('Report Issue', 'Issue reporting form would allow school staff to submit transportation-related issues.');
            }
            else if (targetButton.id === 'generate-otp-report-btn') {
                showModal('On-Time Performance Report', 'On-time performance reporting would display metrics for bus arrival/departure times.');
            }
            else if (targetButton.id === 'apply-school-filter-btn') {
                const filterSelect = document.getElementById('school-bus-filter');
                if (filterSelect) {
                    showModal('Filter Applied', `Buses filtered by: ${filterSelect.value}`);
                }
            }
        });
    }

    // OPT Admin View Actions
    if (optAdminView) {
        optAdminView.addEventListener('click', (e) => {
            const targetButton = e.target.closest('button');
            if (!targetButton) return;

            if (targetButton.id === 'apply-opt-filter-btn') {
                const searchInput = document.getElementById('opt-search');
                const statusFilter = document.getElementById('opt-filter-status');
                const boroughFilter = document.getElementById('opt-filter-borough');

                showModal('Search/Filter Applied', `Filtered by: ${searchInput?.value || 'No search term'} | Status: ${statusFilter?.value || 'All'} | Borough: ${boroughFilter?.value || 'All'}`);
            } else if (targetButton.id === 'view-route-history-btn') {
                showModal('Route History', 'Route history viewer would allow accessing historical bus routes and replaying them on the map.');
            } else if (targetButton.classList.contains('clickable-event')) {
                showModal('Event Action', `You clicked on event: ${targetButton.textContent}`);
            }
        });

        // Make clickable events in the feed work
        const clickableEvents = optAdminView.querySelectorAll('.event-item.clickable-event');
        clickableEvents.forEach(item => {
            item.addEventListener('click', () => {
                const eventType = item.dataset.eventType;
                const eventId = item.dataset.eventId || item.dataset.requestId || 'Unknown';

                showModal(`${eventType.toUpperCase()} Details`, `You clicked on ${eventType} with ID: ${eventId}. This would open the full details view.`);
            });
        });
    }

    // Initialize view (first time)
    showView('role-selection');

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    let darkMode = localStorage.getItem('darkMode') === 'enabled';

    // Initialize theme from localStorage
    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.querySelector('i').classList.remove('fa-moon');
        themeToggleBtn.querySelector('i').classList.add('fa-sun');
    }

    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            themeToggleBtn.querySelector('i').classList.remove('fa-moon');
            themeToggleBtn.querySelector('i').classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            themeToggleBtn.querySelector('i').classList.remove('fa-sun');
            themeToggleBtn.querySelector('i').classList.add('fa-moon');
        }

        // Update maps with appropriate styling
        const newStyle = darkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11';
        const updateMap = (map) => {
            if (map) {
                const currentCenter = map.getCenter();
                const currentZoom = map.getZoom();

                // Save the current state
                map.once('styledata', () => {
                    // After style loads, restore view and resize
                    map.setCenter(currentCenter);
                    map.setZoom(currentZoom);
                    map.resize();

                    // Force another resize after a delay
                    setTimeout(() => {
                        map.resize();
                        console.log("Map resized after style change");
                    }, 300);
                });

                // Apply the new style
                map.setStyle(newStyle);
            }
        };

        // Update all maps with the proper style
        updateMap(parentMap);
        updateMap(driverMap);
        updateMap(schoolMap);
        updateMap(adminMap);

        // Force resize all maps after a delay to ensure they render correctly
        setTimeout(resizeAllMaps, 600);
    });

    // Function to force resize maps properly
    function resizeAllMaps() {
        console.log("Forcing map resize");
        if (parentMap) {
            parentMap.resize();
            console.log("Parent map resized");
            setTimeout(() => parentMap.resize(), 100);
            setTimeout(() => parentMap.resize(), 500);
        }
        if (driverMap) {
            driverMap.resize();
            console.log("Driver map resized");
            setTimeout(() => driverMap.resize(), 100);
            setTimeout(() => driverMap.resize(), 500);
        }
        if (schoolMap) {
            schoolMap.resize();
            console.log("School map resized");
            setTimeout(() => schoolMap.resize(), 100);
            setTimeout(() => schoolMap.resize(), 500);
        }
        if (adminMap) {
            adminMap.resize();
            console.log("Admin map resized");
            setTimeout(() => adminMap.resize(), 100);
            setTimeout(() => adminMap.resize(), 500);
        }
    }

    // Window resize handler for maps
    window.addEventListener('resize', () => {
        // Resize all maps when window size changes
        resizeAllMaps();
    });

    // Call resize maps on tab/window focus
    window.addEventListener('focus', resizeAllMaps);
    window.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            resizeAllMaps();
        }
    });
});