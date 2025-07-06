// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pathSegments = window.location.pathname.split('/');
    let currentFileName = pathSegments[pathSegments.length - 1].split('.html')[0];
    if (currentFileName === '' || currentFileName === '/') {
        currentFileName = 'index'; // Handle root index.html
    }

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        let linkFileName = linkHref.split('.html')[0];
        if (linkFileName === '' || linkFileName === '/') {
            linkFileName = 'index'; // Handle root index.html
        }

        // Remove any existing highlight and add base opacity
        link.classList.remove('active-link'); // Custom class for active link
        link.classList.add('opacity-50');
        const existingHighlightDiv = link.querySelector('.highlight-underline'); // Use class for highlight div
        if (existingHighlightDiv) {
            existingHighlightDiv.remove();
        }

        // Add highlight if this is the current page's link
        if (currentFileName === linkFileName) {
            link.classList.add('active-link'); // Add custom active class
            link.classList.remove('opacity-50');
            const highlightDiv = document.createElement('div');
            highlightDiv.classList.add('highlight-underline'); // Use custom class for highlight div
            link.appendChild(highlightDiv);
        }

        // Scroll to top when clicking the link to the current page
        if (currentFileName === linkFileName) {
            link.addEventListener('click', (event) => {
                if (window.scrollY > 0) { // Only scroll if not already at the top
                    event.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });


    // --- 2. Burger Menu Functionality ---
    const burgerButton = document.getElementById('burgerButton');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('#mobileNavOverlay .nav-link');

    if (burgerButton && mobileNavOverlay) {
        burgerButton.addEventListener('click', () => {
            burgerButton.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : ''; // Prevent body scroll
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerButton.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside (on overlay background)
        mobileNavOverlay.addEventListener('click', (event) => {
            if (event.target === mobileNavOverlay) {
                burgerButton.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // --- 3. Project Data & Carousel/Filtering Functionality (Specific to projects.html) ---
    const projectsSection = document.getElementById('projects');

    if (projectsSection) { // Only execute if on the projects page
        const allProjectsData = [
            // Residential Projects
            { name: "MA Residence", location: "Jl Bendungan Hilir, Jakarta Barat", status: "Completed, 2020-2022", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=MA+Residence" },
            { name: "NS Villa", location: "Lot Tunduh Bali", status: "Completed, 2022-2024", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=NS+Villa" },
            { name: "JY Residence", location: "Jakarta", status: "2024-ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=JY+Residence" },
            { name: "AY Residence", location: "Yogyakarta", status: "2024-ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=AY+Residence" },
            { name: "AJ Residence", location: "Yogyakarta", status: "2024-ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=AJ+Residence" },
            { name: "First Kost 23-24", location: "Yogyakarta", status: "Completed, 2023-2024", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+23-24" },
            { name: "First Kost 25", location: "Yogyakarta", status: "Constructing, 2024-Ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+25" },
            { name: "First Kost 26-33", location: "Yogyakarta", status: "Constructing, 2024-Ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+26-33" },
            { name: "First Kost UII", location: "Yogyakarta", status: "Constructing, 2024-Ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+UII" },

            // Interior Design Projects
            { name: "JWCC Asih", location: "Jl Panglima Polim, Jakarta Selatan", status: "Design Incharge in andramatin studio", categories: ["interior"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=JWCC+Asih" },

            // Public Building Projects
            { name: "Taman Ismail Marzuki", location: "Jl Cikini Raya, Jakarta Pusat", status: "2019-2022", categories: ["public"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=Taman+Ismail+Marzuki" },
            { name: "Roemah Koffie Indonesia", location: "Badung, Bali", status: "2023-ongoing", categories: ["public"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=Roemah+Koffie" },
            { name: "Jetski Cafe", location: "Jakarta Utara", status: "2022-ongoing", categories: ["public"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=Jetski+Cafe" },
        ];

        const carouselInner = document.getElementById('carouselInner');
        const carouselIndicators = document.getElementById('carouselIndicators');
        let currentIndex = 0;
        const projectsPerSlide = 8;

        const filterButtons = document.querySelectorAll('.filter-btn');

        function renderCarousel(projectsToDisplay) {
            if (!carouselInner || !carouselIndicators) return;

            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            currentIndex = 0;

            const totalProjects = projectsToDisplay.length;
            const totalSlides = Math.ceil(totalProjects / projectsPerSlide);

            if (totalProjects === 0) {
                carouselInner.innerHTML = '<p class="text-neutral-600 text-lg w-full text-center">No projects found for this category.</p>';
                return;
            }

            for (let i = 0; i < totalSlides; i++) {
                const slideProjects = projectsToDisplay.slice(i * projectsPerSlide, (i + 1) * projectsPerSlide);
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item', 'p-4', 'grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-8');

                slideProjects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.classList.add('project-card'); // 'active-filter' not needed here as rendering only active ones

                    projectCard.innerHTML = `
                        <img src="${project.image}" alt="${project.name}">
                        <div class="project-card-content">
                            <h3 class="text-xl font-semibold text-neutral-800 mb-2">${project.name}</h3>
                            <p class="text-neutral-600 text-sm mb-1">Location: ${project.location}</p>
                            <p class="text-neutral-600 text-sm mb-4">Status: ${project.status}</p>
                            <a href="#" class="text-accent-yellow hover:underline text-base mt-auto">View Details</a>
                        </div>
                    `;
                    carouselItem.appendChild(projectCard);
                });
                carouselInner.appendChild(carouselItem);
            }
            createIndicators(totalSlides);
            updateCarousel();
        }

        function moveSlide(direction) {
            const currentCarouselItems = carouselInner.querySelectorAll('.carousel-item');
            currentIndex += direction;
            if (currentIndex < 0) {
                currentIndex = currentCarouselItems.length - 1;
            } else if (currentIndex >= currentCarouselItems.length) {
                currentIndex = 0;
            }
            updateCarousel();
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function createIndicators(totalSlides) {
            carouselIndicators.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('indicator-dot');
                if (i === currentIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => goToSlide(i));
                carouselIndicators.appendChild(dot);
            }
        }

        // Make functions globally accessible for inline HTML calls (if any)
        window.moveSlide = moveSlide;
        window.goToSlide = goToSlide;

        function applyFilter(filter) {
            const filteredProjects = allProjectsData.filter(project =>
                filter === 'all' || project.categories.includes(filter)
            );
            renderCarousel(filteredProjects);
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active-filter-btn'); // Use custom active class
                });
                button.classList.add('active-filter-btn'); // Use custom active class

                const filter = button.dataset.filter;
                applyFilter(filter);
            });
        });

        // Apply 'all' filter initially when projects.html is loaded
        if (filterButtons.length > 0) {
            // Check if 'all' button exists before simulating click
            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            if (allButton) {
                allButton.click();
            } else { // Fallback if 'all' button is missing for some reason
                renderCarousel(allProjectsData);
            }
        } else { // If no filter buttons, just render all projects
            renderCarousel(allProjectsData);
        }
    }
});