class TetrisGame {
    constructor() {
        this.container = document.querySelector('.blocks-container');
        this.stopBtn = document.querySelector('.stop-btn');
        this.attackBtn = document.querySelector('.attack-btn');
        this.rotateBtn = document.querySelector('.rotate-btn');
        this.currentBlock = null;
        this.queuedBlock = null;  // This will store the actual block type, not just preview
        this.blockSize = 30; // pixels
        this.containerWidth = 300;
        this.containerHeight = 600;
        this.dropSpeed = 500; // milliseconds
        
        // Grid system for collision detection
        this.cols = this.containerWidth / this.blockSize;
        this.rows = this.containerHeight / this.blockSize;
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        
        this.shapes = {
            I: [[1, 1, 1, 1]],
            O: [[1, 1], 
                [1, 1]],
            T: [[0, 1, 0], 
                [1, 1, 1]],
            S: [[0, 1, 1], 
                [1, 1, 0]],
            Z: [[1, 1, 0], 
                [0, 1, 1]],
            J: [[1, 0, 0], 
                [1, 1, 1]],
            L: [[0, 0, 1], 
                [1, 1, 1]]
        };

        this.init();
        
        // New properties
        this.points = 0;
        this.wins = 0;
        this.nextBlock = null;
        this.pointsDisplay = document.querySelector('.current-points');
        this.winsDisplay = document.querySelector('.win-counter');
        this.previewBox = document.querySelector('.preview-box');
        this.slotPointsDisplay = document.querySelector('.slot-points');
        
        // Icon points system with exact matching filenames
        this.iconPoints = {
            'Angular-Dark.svg': 10,
            'CPP.svg': 20,
            'Dart-Dark.svg': 30,
            'ExpressJS-Dark.svg': 40,
            'Flutter-Dark.svg': 50,
            'GoLang.svg': 60,
            'Haskell-Dark.svg': 70,
            'Kotlin-Dark.svg': 80,
            'Python-Dark.svg': 90
        };
    }

    init() {
        this.attackBtn.addEventListener('click', () => this.attackWithBlock());
        this.stopBtn.addEventListener('click', () => this.stopGame());
        
        // Initialize grid
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    getRandomBlockType() {
        const types = Object.keys(this.shapes);
        return types[Math.floor(Math.random() * types.length)];
    }

    createBlock() {
        // Use the queued block type instead of getting a random one
        const blockType = this.queuedBlock;
        const shape = this.shapes[blockType];
        const blockGroup = document.createElement('div');
        blockGroup.className = 'tetris-block-group';
        
        // Calculate random column position (in grid units)
        const maxCol = this.cols - shape[0].length;
        const randomCol = Math.floor(Math.random() * maxCol);
        
        // Set initial position for the block group
        blockGroup.style.left = `${randomCol * this.blockSize}px`;
        blockGroup.style.top = '0px';
        
        // Store block properties
        blockGroup.dataset.type = blockType;
        blockGroup.dataset.col = randomCol;
        blockGroup.dataset.row = 0;
        
        // Create individual blocks based on the shape
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const block = document.createElement('div');
                    block.className = `tetris-block block-${blockType}`;
                    block.style.left = `${col * this.blockSize}px`;
                    block.style.top = `${row * this.blockSize}px`;
                    blockGroup.appendChild(block);
                }
            }
        }
        
        this.container.appendChild(blockGroup);
        return blockGroup;
    }

    checkCollision(blockGroup, newRow, newCol) {
        const shape = this.shapes[blockGroup.dataset.type];
        
        // Check boundaries and collision for each cell in the shape
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const gridRow = newRow + row;
                    const gridCol = newCol + col;
                    
                    // Check bottom boundary
                    if (gridRow >= this.rows) return true;
                    
                    // Check side boundaries
                    if (gridCol < 0 || gridCol >= this.cols) return true;
                    
                    // Check if space is occupied
                    if (this.grid[gridRow][gridCol] === 1) return true;
                }
            }
        }
        return false;
    }

    updateGrid(blockGroup, value) {
        const shape = this.shapes[blockGroup.dataset.type];
        const baseRow = parseInt(blockGroup.dataset.row);
        const baseCol = parseInt(blockGroup.dataset.col);
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    this.grid[baseRow + row][baseCol + col] = value;
                }
            }
        }
    }

    moveBlock(blockGroup) {
        const currentRow = parseInt(blockGroup.dataset.row);
        const newRow = currentRow + 1;
        const currentCol = parseInt(blockGroup.dataset.col);

        if (!this.checkCollision(blockGroup, newRow, currentCol)) {
            // Update position
            blockGroup.style.top = `${newRow * this.blockSize}px`;
            blockGroup.dataset.row = newRow;
            return true;
        } else {
            // Place block in grid
            this.updateGrid(blockGroup, 1);
            return false;
        }
    }

    checkOverflow() {
        const blockGroups = this.container.querySelectorAll('.tetris-block-group');
        for (const blockGroup of blockGroups) {
            if (parseInt(blockGroup.dataset.row) <= 0) {
                this.stopBtn.style.display = 'block';
                this.stopGame();
                return true;
            }
        }
        return false;
    }

    attackWithBlock() {
        if (!this.queuedBlock) return;
        
        this.currentBlock = this.createBlock(); // This will now use the queued block
        this.attackBtn.disabled = true;
        
        // Move block down until collision
        const moveDown = () => {
            if (this.moveBlock(this.currentBlock)) {
                requestAnimationFrame(moveDown);
            } else {
                this.checkOverflow();
                this.currentBlock = null;
                this.queuedBlock = null; // Clear the queued block
                this.updatePreview(); // Update preview to show empty
                // Enable spin button after block is placed
                document.querySelector('.spin-btn').disabled = false;
            }
        };
        
        moveDown();
    }

    queueNextBlock() {
        this.queuedBlock = this.getRandomBlockType();
        this.updatePreview();
        this.attackBtn.disabled = false;  // Enable attack button
    }

    updatePreview() {
        this.previewBox.innerHTML = '';
        if (this.queuedBlock) {
            const previewBlock = this.createPreviewBlock(this.queuedBlock);
            this.previewBox.appendChild(previewBlock);
        }
    }

    createPreviewBlock(blockType) {
        const shape = this.shapes[blockType];
        const blockGroup = document.createElement('div');
        blockGroup.className = 'tetris-block-group preview';
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const block = document.createElement('div');
                    block.className = `tetris-block block-${blockType}`;
                    block.style.left = `${col * this.blockSize}px`;
                    block.style.top = `${row * this.blockSize}px`;
                    blockGroup.appendChild(block);
                }
            }
        }
        
        return blockGroup;
    }

    stopGame() {
        this.container.innerHTML = '';
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.currentBlock = null;
        this.queuedBlock = null;
        this.updatePreview();
        this.attackBtn.disabled = true;
    }

    calculatePoints(slots) {
        const slotsArray = Array.from(slots);
        
        const values = slotsArray.map(slot => {
            const imgSrc = slot.querySelector('img').src;
            const iconName = imgSrc.split('/').pop();
            return iconName;
        });
        
        // Check for jackpot (all slots identical)
        if (values[0] === values[1] && values[1] === values[2]) {
            this.slotPointsDisplay.textContent = '100';
            return 100;
        }
        
        // Calculate normal points
        const points = this.iconPoints[values[0]] + this.iconPoints[values[1]] - this.iconPoints[values[2]];
        this.slotPointsDisplay.textContent = points;
        
        return points;
    }

    handleJackpot() {
        this.container.innerHTML = '';
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.wins++;
        this.winsDisplay.textContent = this.wins;
    }
}

class SlotMachine {
    constructor(tetrisGame) {
        this.icons = [
            'game icon/Angular-Dark.svg',
            'game icon/CPP.svg',
            'game icon/Dart-Dark.svg',
            'game icon/ExpressJS-Dark.svg',
            'game icon/Flutter-Dark.svg',
            'game icon/GoLang.svg',
            'game icon/Haskell-Dark.svg',
            'game icon/Kotlin-Dark.svg',
            'game icon/Python-Dark.svg'
        ];
        
        // Define weights for each icon (lower number = higher probability)
        this.iconWeights = {
            'Angular-Dark.svg': 30,    // Low points (10)
            'CPP.svg': 25,             // Low points (20)
            'Dart-Dark.svg': 20,       // Medium points (30)
            'ExpressJS-Dark.svg': 15,  // Medium points (40)
            'Flutter-Dark.svg': 12,    // Medium points (50)
            'GoLang.svg': 10,          // High points (60)
            'Haskell-Dark.svg': 8,     // High points (70)
            'Kotlin-Dark.svg': 5,      // High points (80)
            'Python-Dark.svg': 3       // High points (90)
        };

        this.slots = document.querySelectorAll('.slot-item');
        this.spinButton = document.querySelector('.spin-btn');
        this.isSpinning = false;
        this.tetrisGame = tetrisGame;
        
        this.init();
    }

    init() {
        this.spinButton.addEventListener('click', () => this.spin());
        // Initialize slots with random icons
        this.slots.forEach(slot => this.setRandomIcon(slot));
    }

    getWeightedRandomIcon() {
        // Calculate total weight
        const totalWeight = Object.values(this.iconWeights).reduce((a, b) => a + b, 0);
        
        // Generate random number between 0 and total weight
        let random = Math.random() * totalWeight;
        
        // Find the icon based on weight
        for (const iconName in this.iconWeights) {
            random -= this.iconWeights[iconName];
            if (random <= 0) {
                return 'game icon/' + iconName;
            }
        }
        
        // Fallback to first icon (should never happen)
        return this.icons[0];
    }

    setRandomIcon(slot) {
        const randomIcon = this.getWeightedRandomIcon();
        slot.innerHTML = `<img src="${randomIcon}" alt="icon">`;
    }

    showPointPopup(slot, value, index) {
        const popup = document.createElement('div');
        popup.className = 'slot-popup';
        
        if (index === 2) {
            popup.classList.add('negative');
            popup.textContent = `-${value}`;
        } else {
            popup.classList.add('positive');
            popup.textContent = `+${value}`;
        }
        
        // Add random particle directions
        popup.style.setProperty('--x', `${Math.random() * 30 - 15}px`);
        popup.style.setProperty('--y', `${-(Math.random() * 20 + 10)}px`);
        
        slot.appendChild(popup);
        
        // Add sound effect (optional)
        const audio = new Audio(index === 2 ? 'negative.mp3' : 'positive.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Catch and ignore if sound fails to play
        
        // Remove popup after animation
        setTimeout(() => {
            popup.remove();
        }, 1200);
    }

    async spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.tetrisGame.attackBtn.disabled = true;
        
        // Reset points display
        this.tetrisGame.slotPointsDisplay.textContent = '0';
        
        // Spin animation
        this.slots.forEach(slot => slot.classList.add('spinning'));
        
        const spinDurations = Array.from(this.slots).map(() => 
            Math.random() * 1000 + 2000
        );
        
        const spinPromises = Array.from(this.slots).map((slot, index) => 
            this.spinSlot(slot, spinDurations[index])
        );
        
        await Promise.all(spinPromises);
        
        // After spin completion, show popups
        const values = Array.from(this.slots).map(slot => {
            const imgSrc = slot.querySelector('img').src;
            const iconName = imgSrc.split('/').pop();
            return this.tetrisGame.iconPoints[iconName];
        });

        // Show popups with slight delay between each
        this.slots.forEach((slot, index) => {
            setTimeout(() => {
                this.showPointPopup(slot, values[index], index);
            }, index * 200); // 200ms delay between each popup
        });

        this.isSpinning = false;
        
        // Calculate points
        const points = this.tetrisGame.calculatePoints(this.slots);
        
        // Handle jackpot if applicable
        if (points >= 100) {
            this.tetrisGame.handleJackpot();
        }

        // Queue next block and enable attack
        this.tetrisGame.queueNextBlock(); // This will set up the next block properly
        this.tetrisGame.attackBtn.disabled = false;
        
        // Spin button remains disabled until block is dropped
    }

    async spinSlot(slot, duration) {
        const iterations = Math.floor(duration / 100);
        
        for (let i = 0; i < iterations; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.setRandomIcon(slot);
        }
        
        slot.classList.remove('spinning');
        
        // Final icon with weighted randomization
        this.setRandomIcon(slot);
    }
}

// Initialize both games
document.addEventListener('DOMContentLoaded', () => {
    const tetrisGame = new TetrisGame();
    const slotMachine = new SlotMachine(tetrisGame);
});
