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
    
            { name: "AY Residence", location: "Yogyakarta", status: "2024-ongoing", categories: ["residential"], image: "images/AUR.jpg" },
            { name: "AJ Residence", location: "Yogyakarta", status: "2024-ongoing", categories: ["residential"], image: "images/AJR.jpg" },
            { name: "First Kost 23-24", location: "Yogyakarta", status: "Completed, 2023-2024", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+23-24" },
            { name: "First Kost 25", location: "Yogyakarta", status: "Constructing, 2024-Ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+25" },
            { name: "First Kost 26-33", location: "Yogyakarta", status: "Constructing, 2024-Ongoing", categories: ["residential"], image: "https://via.placeholder.com/400x250/BDBDBD/000000?text=First+Kost+26-33" },
            { name: "First Kost UII", location: "Yogyakarta", status: "Constructing, 2024-Ongoing", categories: ["residential"], image: "images/UII.jpg" },

        ];

        const carouselInner = document.getElementById('carouselInner');
        const carouselIndicators = document.getElementById('carouselIndicators');
        let currentIndex = 0;
        const projectsPerSlide = 8;

        const filterButtons = document.querySelectorAll('.filter-btn');

        // --- DEFINISI FUNGSI-FUNGSI CAROUSEL/FILTER UTAMA (DIURUTKAN AGAR TIDAK ADA MASALAH HOISTING) ---

        // Fungsi untuk memperbarui tampilan carousel (transformasi dan indikator)
        // Ini harus didefinisikan pertama karena dipanggil oleh fungsi lain.
        function updateCarousel() {
            const currentCarouselItems = carouselInner.querySelectorAll('.carousel-item');
            if (currentCarouselItems.length === 0) {
                carouselInner.style.transform = `translateX(0)`; // Reset jika tidak ada item
                carouselIndicators.innerHTML = ''; // Kosongkan indikator
                // Sembunyikan tombol navigasi jika tidak ada item
                const leftButton = document.querySelector('.carousel-button.left');
                const rightButton = document.querySelector('.carousel-button.right');
                if (leftButton) leftButton.style.display = 'none';
                if (rightButton) rightButton.style.display = 'none';
                return;
            } else {
                // Pastikan tombol navigasi terlihat jika ada item
                const leftButton = document.querySelector('.carousel-button.left');
                const rightButton = document.querySelector('.carousel-button.right');
                if (leftButton) leftButton.style.display = 'flex'; // Menggunakan flex karena CSS Anda memakai display:flex untuk tombol
                if (rightButton) rightButton.style.display = 'flex'; // Menggunakan flex
            }

            const itemWidth = currentCarouselItems[0].offsetWidth; // Dapatkan lebar item pertama
            carouselInner.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

            const indicatorDots = carouselIndicators.querySelectorAll('.indicator-dot');
            indicatorDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Fungsi untuk menggerakkan slide (memanggil updateCarousel)
        function moveSlide(direction) {
            const currentCarouselItems = carouselInner.querySelectorAll('.carousel-item');
            if (currentCarouselItems.length === 0) return; // Tidak melakukan apa-apa jika tidak ada item

            currentIndex += direction;
            if (currentIndex < 0) {
                currentIndex = currentCarouselItems.length - 1;
            } else if (currentIndex >= currentCarouselItems.length) {
                currentIndex = 0;
            }
            updateCarousel();
        }

        // Fungsi untuk langsung menuju slide tertentu (memanggil updateCarousel)
        function goToSlide(index) {
            const currentCarouselItems = carouselInner.querySelectorAll('.carousel-item');
            if (currentCarouselItems.length === 0) return; // Tidak melakukan apa-apa jika tidak ada item

            currentIndex = index;
            updateCarousel();
        }

        // Fungsi untuk membuat indikator slide (memanggil goToSlide)
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

        // Fungsi untuk merender atau merender ulang carousel dengan proyek yang difilter
        // Ini memanggil createIndicators dan updateCarousel.
        function renderCarousel(projectsToDisplay) {
            if (!carouselInner || !carouselIndicators) return;

            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            currentIndex = 0; // Reset index saat dirender ulang

            const totalProjects = projectsToDisplay.length;
            const totalSlides = Math.ceil(totalProjects / projectsPerSlide);

            if (totalProjects === 0) {
                carouselInner.innerHTML = '<p class="text-neutral-600 text-lg w-full text-center">No projects found for this category.</p>';
                // Sembunyikan tombol navigasi jika tidak ada proyek
                const leftButton = document.querySelector('.carousel-button.left');
                const rightButton = document.querySelector('.carousel-button.right');
                if (leftButton) leftButton.style.display = 'none';
                if (rightButton) rightButton.style.display = 'none';
                return;
            } else {
                // Pastikan tombol navigasi terlihat jika ada proyek
                const leftButton = document.querySelector('.carousel-button.left');
                const rightButton = document.querySelector('.carousel-button.right');
                if (leftButton) leftButton.style.display = 'flex';
                if (rightButton) rightButton.style.display = 'flex';
            }

            for (let i = 0; i < totalSlides; i++) {
                const slideProjects = projectsToDisplay.slice(i * projectsPerSlide, (i + 1) * projectsPerSlide);
                const carouselItem = document.createElement('div');
                // Tambahkan kelas grid dan responsif yang Anda inginkan
                carouselItem.classList.add('carousel-item', 'p-4', 'grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-8');

                slideProjects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.classList.add('project-card');

                    projectCard.innerHTML = `
                        <img src="${project.image}" alt="${project.name}" class="w-full h-auto object-cover rounded-t-lg">
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

        // Fungsi untuk menerapkan filter (memanggil renderCarousel)
        function applyFilter(filter) {
            const filteredProjects = allProjectsData.filter(project =>
                filter === 'all' || project.categories.includes(filter)
            );
            renderCarousel(filteredProjects);
        }

        // --- GLOBAL ACCESSIBILITY UNTUK FUNGSI CAROUSEL (jika dipanggil dari HTML inline) ---
        // Ini memastikan window.moveSlide dan window.goToSlide tersedia secara global
        window.moveSlide = moveSlide;
        window.goToSlide = goToSlide;

        // --- INITIALIZATION ---
        // Tambahkan event listener untuk tombol filter
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('active-filter-btn');
                });
                button.classList.add('active-filter-btn');

                const filter = button.dataset.filter;
                applyFilter(filter);
            });
        });

        // Terapkan filter 'all' secara default saat halaman dimuat
        if (filterButtons.length > 0) {
            const allButton = document.querySelector('.filter-btn[data-filter="all"]');
            if (allButton) {
                allButton.click(); // Simulasikan klik pada tombol 'All'
            } else {
                renderCarousel(allProjectsData); // Fallback jika tombol 'All' tidak ada
            }
        } else {
            renderCarousel(allProjectsData); // Jika tidak ada tombol filter sama sekali
        }
    }
});