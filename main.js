

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = "•";
    
    // Random starting position
    snowflake.style.left = Math.random() * 100 + 'vw';
    
    // Random animation duration between 5 and 10 seconds
    const animationDuration = Math.random() * 5 + 5;
    snowflake.style.animation = `snowfall ${animationDuration}s linear forwards`;
    
    // Random opacity
    snowflake.style.opacity = Math.random();
    
    // Random size between 0.5em and 1.5em
    snowflake.style.fontSize = (Math.random() * 1 + 0.5) + 'em';
    
    document.body.appendChild(snowflake);
    
    // Remove snowflake after animation completes
    setTimeout(() => {
        snowflake.remove();
    }, animationDuration * 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images and iframes
    const lazyElements = document.querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]');
    
    const lazyLoadingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                }
                observer.unobserve(element);
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    lazyElements.forEach(element => {
        lazyLoadingObserver.observe(element);
    });

    setInterval(createSnowflake, 200);//creatn=ing a snow effects on the back ground


    // Project image click handlers...
    const utaContainer = document.querySelector('.uta-container');
    const tasklrContainer = document.querySelector('.tasklr-container');

    utaContainer.querySelector('img').addEventListener('click', function() {
        const link = utaContainer.querySelector('a').href;
        window.open(link, '_blank', 'noopener noreferrer');
    });

    tasklrContainer.querySelector('img').addEventListener('click', function() {
        const link = tasklrContainer.querySelector('a').href;
        window.open(link, '_blank', 'noopener noreferrer');
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navRight = document.querySelector('.nav-right');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navRight.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-right a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navRight.classList.remove('active');
        });
    });

    // Switch pane container functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            const content = document.querySelector(`.${tabId}-content`);
            content.classList.add('active');
        });
    });
});
