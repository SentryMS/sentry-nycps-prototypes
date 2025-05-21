// --- Mapbox Configuration ---
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FydGlrc2hhbmthcjgiLCJhIjoiY21heDRzNWI2MG5ndzJqcTBwemRzb201biJ9.acWNHPsR3coetekAP0wTQA';

// Map instances for different views
// ... existing code ... 

// Initialize maps for different views
function initializeMaps() {
    // Clear and initialize Parent/Student Map
    if (document.getElementById('parent-map')) {
        // Clear previous map container to avoid Mapbox warnings
        const parentMapContainer = document.getElementById('parent-map');
        parentMapContainer.innerHTML = '';

        parentMap = new mapboxgl.Map({
            container: 'parent-map',
            style: darkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11',
            center: nycCoordinates.center,
            zoom: 12
        });

        // Add navigation controls
        parentMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add bus, school and route when map loads
        parentMap.on('load', () => {
            // Get first bus for demo
            const bus = sampleBusData[0];

            // Add school marker
            const schoolMarker = addSchoolMarker(parentMap, sampleSchoolData[0]);

            // Add bus marker
            const busMarker = addBusMarker(parentMap, bus);

            // Add student marker
            const studentMarker = addStudentMarker(parentMap, {
                id: 'student1',
                name: 'John Smith',
                grade: '5',
                location: sampleStudentLocations[0]
            });

            // Add stop markers
            addStopMarkers(parentMap, sampleStopData);

            // Add bus route
            addBusRoute(parentMap, sampleBusData[0].route);
        });
    }

    // Clear and initialize Driver Map
    if (document.getElementById('driver-map')) {
        // Clear previous map container to avoid Mapbox warnings
        const driverMapContainer = document.getElementById('driver-map');
        driverMapContainer.innerHTML = '';

        driverMap = new mapboxgl.Map({
            container: 'driver-map',
            style: darkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11',
            center: nycCoordinates.center,
            zoom: 11
        });

        // Add navigation controls
        driverMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add data when map loads
        driverMap.on('load', () => {
            // Add current bus location
            const busMarker = addBusMarker(driverMap, sampleBusData[0]);

            // Add all stop markers on the route
            addStopMarkers(driverMap, sampleStopData);

            // Add bus route
            addBusRoute(driverMap, sampleBusData[0].route);
        });
    }

    // Clear and initialize School Map
    if (document.getElementById('school-map')) {
        // Clear previous map container to avoid Mapbox warnings
        const schoolMapContainer = document.getElementById('school-map');
        schoolMapContainer.innerHTML = '';

        schoolMap = new mapboxgl.Map({
            container: 'school-map',
            style: darkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11',
            center: nycCoordinates.center,
            zoom: 11
        });

        // Add navigation controls
        schoolMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add data when map loads
        schoolMap.on('load', () => {
            // Add school marker
            const schoolMarker = addSchoolMarker(schoolMap, sampleSchoolData[0]);

            // Add all buses servicing this school
            sampleBusData.forEach(bus => {
                const busMarker = addBusMarker(schoolMap, bus);
            });

            // Add bus routes for all buses
            sampleBusData.forEach(bus => {
                addBusRoute(schoolMap, bus.route, bus.id);
            });
        });
    }

    // Clear and initialize Admin Map
    if (document.getElementById('admin-map')) {
        // Clear previous map container to avoid Mapbox warnings
        const adminMapContainer = document.getElementById('admin-map');
        adminMapContainer.innerHTML = '';

        adminMap = new mapboxgl.Map({
            container: 'admin-map',
            style: darkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11',
            center: nycCoordinates.center,
            zoom: 10
        });

        // Add navigation controls
        adminMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add data when map loads
        adminMap.on('load', () => {
            // Add all school markers
            sampleSchoolData.forEach(school => {
                const schoolMarker = addSchoolMarker(adminMap, school);
            });

            // Add all bus markers
            sampleBusData.forEach(bus => {
                const busMarker = addBusMarker(adminMap, bus);
            });

            // Add all bus routes
            sampleBusData.forEach(bus => {
                addBusRoute(adminMap, bus.route, bus.id);
            });
        });
    }
}

// Generate QR Code for student boarding pass
function generateQRCode() {
    const qrCodeContainer = document.getElementById('student-qr-code');
    if (!qrCodeContainer) return;

    // Clear any existing content
    qrCodeContainer.innerHTML = '';

    // Create a canvas element for the QR code
    const canvas = document.createElement('canvas');
    qrCodeContainer.appendChild(canvas);

    // Generate random student ID for demo purposes
    const studentId = 'NYCDOE-' + Math.floor(100000 + Math.random() * 900000);

    try {
        // Generate QR code using qrcode.js
        QRCode.toCanvas(canvas, studentId, {
            width: 180,
            margin: 4,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function (error) {
            if (error) {
                console.error('QR Code error:', error);
                qrCodeContainer.innerHTML = '<p>Error generating QR code</p>';
            }
        });

        // Add student ID below QR code
        const idText = document.createElement('p');
        idText.className = 'text-center mt-2 mb-0';
        idText.textContent = 'ID: ' + studentId;
        qrCodeContainer.appendChild(idText);

    } catch (error) {
        console.error('QR Code generation error:', error);
        qrCodeContainer.innerHTML = '<p>Error generating QR code</p>';
    }
}

// --- Event Listeners ---

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

// Helper function to add student marker to map
function addStudentMarker(map, student) {
    const markerElement = document.createElement('div');
    markerElement.className = 'student-marker';

    return new mapboxgl.Marker(markerElement)
        .setLngLat(student.location)
        .setPopup(new mapboxgl.Popup().setHTML(`
            <h4>${student.name}</h4>
            <p>Grade: ${student.grade}</p>
            <p>Student ID: ${student.id}</p>
        `))
        .addTo(map);
}

// Helper function to add sample data for demo purposes
function initializeSampleData() {
    // Sample student locations for demo
    window.sampleStudentLocations = [
        [-73.945, 40.692],  // Brooklyn
        [-73.965, 40.768],  // Manhattan
        [-73.876, 40.735]   // Queens
    ];
}

// Document ready event
document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme
    initTheme();

    // Initialize sample data
    initializeSampleData();

    // Initialize map access token
    initMapboxToken();

    // Show role selection view initially
    showView('role-selection');

    // Event listeners
    setupEventListeners();
});

// ... existing code ... 