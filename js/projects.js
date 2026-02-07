function renderProjects(lang) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = ''; // Clear existing content

    // Remove existing "View More" button if any
    const existingBtn = document.querySelector('.load-more-container');
    if (existingBtn) existingBtn.remove();

    const INITIAL_LIMIT = 6;
    let hasMore = projectsData.length > INITIAL_LIMIT;

    projectsData.forEach((project, index) => {
        const title = translations[lang][project.titleKey];
        const desc = translations[lang][project.descKey];
        const readMoreText = translations[lang]['projectDetails']; // "Read More"

        const card = document.createElement('div');
        card.className = 'project-card';

        // Hide if over limit
        if (index >= INITIAL_LIMIT) {
            card.style.display = 'none';
            card.classList.add('hidden-project');
        }

        // Add click listener to the whole card
        card.onclick = (e) => {
            openProjectModal(project.id);
        };

        // Add stagger for animation
        card.style.animationDelay = `${index * 0.1}s`;

        // Tags HTML
        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image}" alt="${title}" class="project-image">
            </div>
            <div class="project-content">
                <h3 class="project-title">${title}</h3>
                <p class="project-description">${desc}</p>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <span class="project-link">
                    <span>${readMoreText}</span>
                    <i class="fas fa-expand-alt"></i>
                </span>
            </div>
        `;

        projectsGrid.appendChild(card);

        // Register with observer for animation if it exists
        if (window.globalObserver) {
            window.globalObserver.observe(card);
        }

        // Apply Glow and Shine to dynamic card
        if (window.initGlowForElement) {
            window.initGlowForElement(card);
        }
        if (window.initShineSingle) {
            window.initShineSingle(card);
        }
    });

    // Add "View More" Button Logic
    if (hasMore) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'load-more-container';

        const btn = document.createElement('button');
        btn.className = 'cta-button';
        // Ensure translations exist
        const viewMoreText = translations[lang]['viewMore'] || 'View More Projects';

        btn.innerHTML = `
            <span>${viewMoreText}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.8em; margin-left: 8px;"></i>
        `;

        btn.onclick = () => {
            const hiddenProjects = document.querySelectorAll('.hidden-project');
            hiddenProjects.forEach((p, i) => {
                p.style.display = 'flex';
                // Trigger reflow/animation
                p.style.animation = 'none';
                p.offsetHeight; /* trigger reflow */
                p.style.animation = `cosmicEmergence 0.6s ease-out ${i * 0.1}s forwards`;
                p.style.opacity = '0'; // reset for animation
                p.classList.remove('hidden-project');
            });
            btnContainer.remove(); // Remove button after showing all
        };

        btnContainer.appendChild(btn);

        // Insert after grid container
        projectsGrid.parentNode.insertBefore(btnContainer, projectsGrid.nextSibling);
    }
}

function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const lang = currentLang || 'en';
    const title = translations[lang][project.titleKey];
    const fullDesc = translations[lang][project.detailedDescKey] || translations[lang][project.descKey];

    // Labels
    const githubLabel = translations[lang]['projectLinkGithub'];
    const liveLabel = translations[lang]['projectLinkLive'];

    // Create or get modal elements
    let modalOverlay = document.getElementById('projectModal');
    if (!modalOverlay) {
        // Create modal structure if it doesn't exist (failsafe)
        createModalStructure();
        modalOverlay = document.getElementById('projectModal');
    }

    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalGithub = document.getElementById('modalGithub');
    const modalLive = document.getElementById('modalLive'); // New Button

    modalTitle.textContent = title;
    modalImage.src = project.image;
    modalDesc.textContent = fullDesc;
    modalTags.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    // GitHub Button
    modalGithub.href = project.github;
    modalGithub.querySelector('span').textContent = githubLabel;

    // Live Project Button (Always show for now per user request)
    modalLive.href = project.liveUrl || '#';
    modalLive.style.display = 'inline-flex';
    modalLive.querySelector('span').textContent = liveLabel;

    // Optional: Add visual indication if link is empty
    if (!project.liveUrl || project.liveUrl === '#') {
        modalLive.style.opacity = '0.7';
        // modalLive.style.cursor = 'not-allowed'; // Optional
    } else {
        modalLive.style.opacity = '1';
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeProjectModal() {
    const modalOverlay = document.getElementById('projectModal');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function createModalStructure() {
    // This serves as a template if not in HTML, but we will add it to HTML primarily.
    // This function is just a helper if we ever populate it dynamically.
    const modalHTML = `
    <div id="projectModal" class="project-modal-overlay">
        <div class="project-modal-content">
            <button class="close-modal" onclick="closeProjectModal()">&times;</button>
            <div class="modal-body">
                <div class="modal-image-wrapper">
                    <img id="modalImage" src="" alt="Project Preview">
                </div>
                <div class="modal-details">
                    <h2 id="modalTitle" class="modal-title"></h2>
                    <div id="modalTags" class="project-tags"></div>
                    <p id="modalDesc" class="modal-description"></p>
                    
                    <div class="modal-buttons">
                        <a id="modalLive" href="#" target="_blank" class="cta-button modal-btn primary-btn">
                            <span></span>
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <a id="modalGithub" href="#" target="_blank" class="cta-button modal-btn secondary-btn">
                            <span></span>
                            <i class="fab fa-github"></i>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close on click outside
    document.getElementById('projectModal').addEventListener('click', (e) => {
        if (e.target.id === 'projectModal') {
            closeProjectModal();
        }
    });
}

// ensure we export or make available globally if not using modules
window.renderProjects = renderProjects;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.createModalStructure = createModalStructure;
