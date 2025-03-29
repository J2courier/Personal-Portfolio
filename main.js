

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

    // Create a new snowflake every 200ms
    setInterval(createSnowflake, 200);
    
    const readMoreBtn = document.querySelector('.read-more-btn');
    const extraContent = document.querySelector('.extra-content');

    readMoreBtn.addEventListener('click', function() {
        if (extraContent.style.display === 'none' || extraContent.style.display === '') {
            extraContent.style.display = 'inline';
            readMoreBtn.style.display = 'none';  // Hide the "See More..." button
            
            // Check if "Show Less" button already exists
            if (!extraContent.querySelector('.read-more-btn')) {
                extraContent.innerHTML += ' <span class="read-more-btn">Show Less</span>';  // Add "Show Less" at the end
                
                // Add click event to the new "Show Less" button
                const newBtn = extraContent.querySelector('.read-more-btn');
                newBtn.addEventListener('click', function() {
                    extraContent.style.display = 'none';
                    readMoreBtn.style.display = 'inline';  // Show original "See More..." button
                    readMoreBtn.textContent = 'See More...';
                });
            }
        } else {
            extraContent.style.display = 'none';
            readMoreBtn.textContent = 'See More...';
        }
    });

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

});
