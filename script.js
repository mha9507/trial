/ Advanced Cursor System
class AdvancedCursor {
  constructor() {
    this.cursor = document.querySelector('.cursor-main');
    this.glow = document.querySelector('.cursor-glow');
    this.trails = [];
    this.mouse = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    
    // Check if mobile
    if (window.matchMedia("(max-width: 768px)").matches) {
      document.querySelector('.cursor-system').style.display = 'none';
      return;
    }
    
    this.init();
  }

  init() {
    // Create trail elements
    for (let i = 0; i < 10; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.background = `hsl(${270 + i * 3}, 80%, ${60 - i * 2}%)`;
      trail.style.width = trail.style.height = `${6 - i * 0.3}px`;
      document.querySelector('.cursor-system').appendChild(trail);
      this.trails.push({
        element: trail,
        x: 0,
        y: 0,
        delay: i * 2
      });
    }

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.animate();
  }

  animate() {
    if (!this.cursor) return;
    
    this.pos.x += (this.mouse.x - this.pos.x) * 0.3;
    this.pos.y += (this.mouse.y - this.pos.y) * 0.3;

    this.cursor.style.left = this.pos.x + 'px';
    this.cursor.style.top = this.pos.y + 'px';
    this.glow.style.left = this.pos.x + 'px';
    this.glow.style.top = this.pos.y + 'px';

    // Animate trails
    this.trails.forEach((trail, index) => {
      const delay = index * 0.1;
      trail.x += (this.pos.x - trail.x) * (0.2 - delay * 0.005);
      trail.y += (this.pos.y - trail.y) * (0.2 - delay * 0.005);
      
      trail.element.style.left = trail.x + 'px';
      trail.element.style.top = trail.y + 'px';
      trail.element.style.opacity = 1 - index * 0.1;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Slower, Smoother Loading System (3-4 seconds total)
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const percentage = document.querySelector('.percentage');
  
  // Add portal particles
  const portalCore = document.querySelector('.portal-core');
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'portal-particle';
    particle.style.setProperty('--tx', `${Math.random() * 40 - 20}px`);
    particle.style.setProperty('--ty', `${Math.random() * -60 - 30}px`);
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 1.5}s`;
    portalCore.appendChild(particle);
  }

  let progress = 0;
  const minIncrement = 1;  // Minimum percentage increment
  const maxIncrement = 4;  // Maximum percentage increment
  const baseInterval = 100; // Base interval in ms
  
  const interval = setInterval(() => {
    // Calculate increment with easing - slows down as it approaches 100%
    const remaining = 100 - progress;
    const increment = Math.min(
      Math.max(minIncrement, Math.floor(remaining * 0.1 + 0.5)), // Never less than minIncrement
      maxIncrement // Never more than maxIncrement
    );
    
    progress += increment;
    
    // Add some random variation to make it feel more organic
    const randomVariation = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0;
    progress = Math.min(progress + randomVariation, 100);
    
    percentage.textContent = `${progress}%`;
    
    if(progress === 100) {
      clearInterval(interval);
      // Smooth fade out
      loadingScreen.style.transition = 'opacity 0.8s ease-out';
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.visibility = 'hidden';
        initAllSystems();
      }, 800); // Wait for fade out to complete
    }
  }, baseInterval + Math.random() * 50); // Slightly randomized intervals
});

// YouTube Player API for Video Experience
let players = {};

function initYouTubePlayers() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// ─── 1) Replace your entire onYouTubeIframeAPIReady block with this ───
window.onYouTubeIframeAPIReady = function() {
  // Intro → decision #1
  createPlayer('intro-video',        'uiK0oMhOsNQ',  onIntroEnd);

  // Dorm & Bathroom branches → final return
  createPlayer('dorm-video',         'q2sNJy1IPho',  onDormEnd);
  createPlayer('bathroom-video',     '24zlsvHUNK0',  onBathroomEnd);

  // Final return → decision #2
  createPlayer('final-return-video', 'RJw7-FGcs6E',  onFinalReturnEnd);

  // Endings (no further branching)
  createPlayer('ending-use-video',      'TDq1Mt0Y_k0');
  createPlayer('ending-destroy-video',  'oCyEZFsMiS0');
};


function createPlayer(elementId, videoId, onEndCallback) {
  players[elementId] = new YT.Player(elementId, {
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': function(event) {
        if (event.data === YT.PlayerState.ENDED && onEndCallback) {
          onEndCallback();
        }
      }
    },
    playerVars: {
      'autoplay': 0,
      'controls': 1,
      'rel': 0,
      'modestbranding': 1,
      'mute': 1
    }
  });
}

function onPlayerReady(event) {
  // Player is ready
}

// Video progression callbacks
// ─── 2) Replace your onIntroEnd() with this ───
function onIntroEnd() {
  hideAllVideoSections();
  document.getElementById('decision1-section')
          .classList.add('active-decision');
}


function onJump1End() {
  hideAllVideoSections();
  document.getElementById('decision1-section').classList.add('active-decision');
}

// ─── 3) Replace your onDormEnd() with this ───
function onDormEnd() {
  hideAllVideoSections();
  document.getElementById('final-return-section')
          .classList.add('active-video-section');
  players['final-return-video'].playVideo();
}


// ─── 4) Replace your onBathroomEnd() with this ───
function onBathroomEnd() {
  hideAllVideoSections();
  document.getElementById('final-return-section')
          .classList.add('active-video-section');
  players['final-return-video'].playVideo();
}

// ─── 5) Replace your onFinalReturnEnd() with this ───
function onFinalReturnEnd() {
  hideAllVideoSections();
  document.getElementById('decision2-section')
          .classList.add('active-decision');
}


function hideAllVideoSections() {
  document.querySelectorAll('.video-section').forEach(section => {
    section.classList.remove('active-video-section');
  });
  document.querySelectorAll('.decision-point').forEach(section => {
    section.classList.remove('active-decision');
  });
}

function restartExperience() {
  hideAllVideoSections();
  document.getElementById('intro-section').classList.add('active-video-section');
  if (players['intro-video']) {
    players['intro-video'].seekTo(0);
    players['intro-video'].playVideo();
  }
}

// Initialize video experience buttons
document.addEventListener('DOMContentLoaded', function() {
  // Initialize YouTube players
  initYouTubePlayers();
  
  // Decision buttons
  const dormChoice = document.getElementById('dorm-choice');
  const bathroomChoice = document.getElementById('bathroom-choice');
  const useGlasses = document.getElementById('use-glasses');
  const destroyGlasses = document.getElementById('destroy-glasses');
  const restartBtn1 = document.getElementById('restart-btn1');
  const restartBtn2 = document.getElementById('restart-btn2');
  
  if (dormChoice) {
    dormChoice.addEventListener('click', function() {
      hideAllVideoSections();
      document.getElementById('dorm-section').classList.add('active-video-section');
      players['dorm-video'].playVideo();
    });
  }
  
  if (bathroomChoice) {
    bathroomChoice.addEventListener('click', function() {
      hideAllVideoSections();
      document.getElementById('bathroom-section').classList.add('active-video-section');
      players['bathroom-video'].playVideo();
    });
  }
  
  if (useGlasses) {
    useGlasses.addEventListener('click', function() {
      hideAllVideoSections();
      document.getElementById('ending-use-section').classList.add('active-video-section');
      players['ending-use-video'].playVideo();
    });
  }
  
  if (destroyGlasses) {
    destroyGlasses.addEventListener('click', function() {
      hideAllVideoSections();
      document.getElementById('ending-destroy-section').classList.add('active-video-section');
      players['ending-destroy-video'].playVideo();
    });
  }
  
  if (restartBtn1) {
    restartBtn1.addEventListener('click', restartExperience);
  }
  
  if (restartBtn2) {
    restartBtn2.addEventListener('click', restartExperience);
  }
});

function initAllSystems() {
  // Initialize all systems
  const cursor = new AdvancedCursor();
  const scene = new ImmersiveScene();
  const audioVisualizer = new AudioVisualizer();
  const teamSystem = new TeamSystem();
  const interactionSystem = new InteractionSystem();
  const navigationSystem = new NavigationSystem();

  // Make available globally if needed
  window.app = {
    cursor,
    scene,
    audioVisualizer,
    teamSystem,
    interactionSystem,
    navigationSystem
  };
}

// Immersive 3D Scene (Updated with VR Teleportation Glasses and Environment System)
class ImmersiveScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('three-scene'),
      antialias: true,
      alpha: true
    });
    
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.glasses = null;
    this.particles = [];
    this.lights = [];
    this.rooms = [];
    this.currentRoom = 0;
    
    // Environment system
    this.currentEnvironment = 0;
    this.environments = this.createEnvironments();
    this.environmentButton = null;
    
    this.init();
  }

  createEnvironments() {
    return [
      {
        name: 'Space',
        icon: '🌌',
        description: 'Infinite cosmic depths with stellar particles',
        colors: ['#8b5cf6', '#c084fc', '#a78bfa'],
        background: { color: 0x0a0a0f, gradient: true },
        lighting: {
          ambient: { color: 0x404040, intensity: 0.3 },
          main: { color: 0xffffff, intensity: 1 },
          accents: [
            { color: 0x8b5cf6, intensity: 0.8, positions: [{ x: -6, y: 3, z: 5 }, { x: 6, y: 3, z: 5 }, { x: 0, y: 5, z: 0 }] }
          ]
        },
        particles: {
          count: window.matchMedia("(max-width: 768px)").matches ? 300 : 1000,
          colors: { hue: 0.75, saturation: 0.8, lightness: 0.5 },
          size: 0.1,
          opacity: 0.6,
          movement: 'drift'
        },
        ambientEffect: 'stars'
      },
      {
        name: 'Forest',
        icon: '🌲',
        description: 'Mystical woodland with dancing fireflies',
        colors: ['#a855f7', '#c084fc', '#e879f9'],
        background: { color: 0x2a1a2f, gradient: true },
        lighting: {
          ambient: { color: 0x5a4a5a, intensity: 0.4 },
          main: { color: 0xffeaa7, intensity: 0.8 },
          accents: [
            { color: 0xa855f7, intensity: 0.6, positions: [{ x: -4, y: 2, z: 3 }, { x: 4, y: 2, z: 3 }] },
            { color: 0xc084fc, intensity: 0.4, positions: [{ x: 0, y: 4, z: -2 }] }
          ]
        },
        particles: {
          count: window.matchMedia("(max-width: 768px)").matches ? 200 : 600,
          colors: { hue: 0.8, saturation: 0.6, lightness: 0.7 },
          size: 0.15,
          opacity: 0.4,
          movement: 'fireflies'
        },
        ambientEffect: 'leaves'
      },
      {
        name: 'Ocean',
        icon: '🌊',
        description: 'Deep underwater realm with flowing currents',
        colors: ['#457b9d', '#1d3557', '#f1faee'],
        background: { color: 0x0d1b2a, gradient: true },
        lighting: {
          ambient: { color: 0x457b9d, intensity: 0.5 },
          main: { color: 0xa8dadc, intensity: 0.7 },
          accents: [
            { color: 0x1d3557, intensity: 0.8, positions: [{ x: -5, y: 1, z: 4 }, { x: 5, y: 1, z: 4 }] },
            { color: 0xf1faee, intensity: 0.5, positions: [{ x: 0, y: 6, z: 0 }] }
          ]
        },
        particles: {
          count: window.matchMedia("(max-width: 768px)").matches ? 400 : 800,
          colors: { hue: 0.6, saturation: 0.7, lightness: 0.6 },
          size: 0.12,
          opacity: 0.5,
          movement: 'bubbles'
        },
        ambientEffect: 'waves'
      },
      {
        name: 'Cyber',
        icon: '🏙️',
        description: 'Neon-lit digital metropolis with data streams',
        colors: ['#3a86ff', '#ff006e', '#8338ec'],
        background: { color: 0x0f0515, gradient: true },
        lighting: {
          ambient: { color: 0xff006e, intensity: 0.3 },
          main: { color: 0x8338ec, intensity: 1.2 },
          accents: [
            { color: 0x3a86ff, intensity: 1, positions: [{ x: -6, y: 3, z: 5 }, { x: 6, y: 3, z: 5 }] },
            { color: 0xff006e, intensity: 0.8, positions: [{ x: 0, y: 5, z: 0 }] }
          ]
        },
        particles: {
          count: window.matchMedia("(max-width: 768px)").matches ? 500 : 1200,
          colors: { hue: 0.9, saturation: 1, lightness: 0.5 },
          size: 0.08,
          opacity: 0.8,
          movement: 'matrix'
        },
        ambientEffect: 'glitch'
      },
      {
        name: 'Desert',
        icon: '🏜️',
        description: 'Ancient dunes with shimmering heat waves',
        colors: ['#e9c46a', '#f4a261', '#fd7e14'],
        background: { color: 0x2d1b0d, gradient: true },
        lighting: {
          ambient: { color: 0xfab005, intensity: 0.4 },
          main: { color: 0xfd7e14, intensity: 0.9 },
          accents: [
            { color: 0xe9c46a, intensity: 0.7, positions: [{ x: -4, y: 4, z: 2 }, { x: 4, y: 4, z: 2 }] },
            { color: 0xf4a261, intensity: 0.5, positions: [{ x: 0, y: 6, z: -3 }] }
          ]
        },
        particles: {
          count: window.matchMedia("(max-width: 768px)").matches ? 250 : 700,
          colors: { hue: 0.1, saturation: 0.8, lightness: 0.6 },
          size: 0.13,
          opacity: 0.3,
          movement: 'sand'
        },
        ambientEffect: 'heat'
      },
      {
        name: 'Aurora',
        icon: '🌌',
        description: 'Arctic lights dancing across frozen skies',
        colors: ['#00f5ff', '#7df9ff', '#40e0d0'],
        background: { color: 0x0a0f1a, gradient: true },
        lighting: {
          ambient: { color: 0x87ceeb, intensity: 0.4 },
          main: { color: 0x00f5ff, intensity: 0.8 },
          accents: [
            { color: 0x7df9ff, intensity: 0.9, positions: [{ x: -5, y: 3, z: 4 }, { x: 5, y: 3, z: 4 }] },
            { color: 0x40e0d0, intensity: 0.6, positions: [{ x: 0, y: 5, z: -2 }] }
          ]
        },
        particles: {
          count: window.matchMedia("(max-width: 768px)").matches ? 350 : 900,
          colors: { hue: 0.7, saturation: 1, lightness: 0.7 },
          size: 0.12,
          opacity: 0.7,
          movement: 'aurora'
        },
        ambientEffect: 'northern'
      }
    ];
  }

  init() {
    // Renderer setup
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Optimized camera setup
    this.camera.position.set(0, 0.15, 2.5);
    this.camera.lookAt(0, 0, 0);
    this.camera.fov = 55;
    this.camera.updateProjectionMatrix();

    // Create scene elements
    this.createRooms();
    this.createGlasses();
    this.applyEnvironment(this.currentEnvironment);
    this.setupInteractions();
    this.setupEnvironmentChanger();
    
    this.animate();
  }

  setupEnvironmentChanger() {
    this.environmentButton = document.getElementById('envChanger');
    if (this.environmentButton) {
      this.environmentButton.addEventListener('click', () => {
        this.switchEnvironment();
      });
      
      // Create preview element
      this.createEnvironmentPreview();
      
      // Initialize button with current environment
      this.updateEnvironmentButton();
    }
  }

  createEnvironmentPreview() {
    const preview = document.createElement('div');
    preview.className = 'env-preview';
    preview.innerHTML = `
      <div class="env-preview-title"></div>
      <div class="env-preview-desc"></div>
      <div class="env-preview-colors"></div>
    `;
    
    this.environmentButton.parentNode.appendChild(preview);
    this.previewElement = preview;
    
    // Add hover listeners for preview
    this.environmentButton.addEventListener('mouseenter', () => {
      this.showPreview();
    });
    
    this.environmentButton.addEventListener('mouseleave', () => {
      this.hidePreview();
    });
  }

  showPreview() {
    if (this.previewElement) {
      const nextEnv = this.environments[(this.currentEnvironment + 1) % this.environments.length];
      const title = this.previewElement.querySelector('.env-preview-title');
      const desc = this.previewElement.querySelector('.env-preview-desc');
      const colors = this.previewElement.querySelector('.env-preview-colors');
      
      title.textContent = `Next: ${nextEnv.name}`;
      desc.textContent = nextEnv.description;
      
      colors.innerHTML = '';
      nextEnv.colors.forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'env-color-dot';
        dot.style.backgroundColor = color;
        colors.appendChild(dot);
      });
      
      this.previewElement.style.opacity = '1';
      this.previewElement.style.visibility = 'visible';
      this.previewElement.style.transform = 'translateY(-50%) translateX(-10px)';
    }
  }

  hidePreview() {
    if (this.previewElement) {
      this.previewElement.style.opacity = '0';
      this.previewElement.style.visibility = 'hidden';
      this.previewElement.style.transform = 'translateY(-50%) translateX(0)';
    }
  }

  updateEnvironmentButton() {
    if (this.environmentButton) {
      const env = this.environments[this.currentEnvironment];
      const icon = this.environmentButton.querySelector('.env-icon');
      const text = this.environmentButton.querySelector('.env-text');
      
      if (icon) {
        icon.textContent = env.icon;
        // Add environment-specific glow
        icon.style.filter = `drop-shadow(0 4px 8px ${env.colors[0]}40)`;
      }
      if (text) text.textContent = env.name;
    }
  }

  switchEnvironment() {
    // Create enhanced transition effect
    this.createEnhancedTransition();
    
    // Trigger multiple audio visualizations
    if (window.app && window.app.audioVisualizer) {
      window.app.audioVisualizer.triggerVisualization('mystery');
    }
    
    setTimeout(() => {
      // Switch to next environment
      this.currentEnvironment = (this.currentEnvironment + 1) % this.environments.length;
      this.applyEnvironment(this.currentEnvironment);
      this.updateEnvironmentButton();
    }, 750);
  }

  createEnhancedTransition() {
    const transition = document.createElement('div');
    transition.className = 'environment-transition';
    
    // Create wave effect
    const wave = document.createElement('div');
    wave.className = 'transition-wave';
    transition.appendChild(wave);
    
    // Create particle system
    const particleContainer = document.createElement('div');
    particleContainer.className = 'transition-particles';
    
    // Generate transition particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'transition-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 1 + 's';
      particle.style.backgroundColor = this.environments[this.currentEnvironment].colors[Math.floor(Math.random() * 3)];
      particleContainer.appendChild(particle);
    }
    
    transition.appendChild(particleContainer);
    document.body.appendChild(transition);
    
    setTimeout(() => {
      transition.remove();
    }, 2000);
  }

  applyEnvironment(envIndex) {
    const env = this.environments[envIndex];
    
    // Clear existing lights and particles
    this.clearEnvironment();
    
    // Apply new environment
    this.createLighting(env.lighting);
    this.createParticles(env.particles);
    this.updateBackground(env.background);
    
    // Ensure glasses remain purple in all environments
    this.maintainGlassesPurpleColor();
  }

  maintainGlassesPurpleColor() {
    if (this.glasses && this.glasses.userData && this.glasses.userData.lensEffect) {
      // Force glasses to stay purple regardless of environment
      this.glasses.userData.lensEffect.material.color.setHex(0x9333ea);
      this.glasses.userData.lensEffect.energyMaterial.color.setHex(0xc084fc);
      this.glasses.userData.lensEffect.coreMaterial.color.setHex(0xa78bfa);
      
      // Find and update frame materials
      this.glasses.traverse((child) => {
        if (child.isMesh && child.material) {
          if (child.material.color) {
            // Keep frame elements purple
            if (child.geometry.type === 'TorusGeometry' || 
                child.geometry.type === 'CylinderGeometry' ||
                child.geometry.type === 'SphereGeometry') {
              child.material.color.setHex(0x8b5cf6);
            }
          }
        }
      });
    }
  }

  clearEnvironment() {
    // Remove existing lights (except those attached to glasses)
    this.lights.forEach(light => {
      this.scene.remove(light);
    });
    this.lights = [];
    
    // Remove existing particles
    this.particles.forEach(particle => {
      this.scene.remove(particle);
    });
    this.particles = [];
  }

  updateBackground(bgConfig) {
    if (bgConfig.gradient) {
      // Update CSS background for gradient effect
      document.body.style.background = `
        radial-gradient(circle at 20% 80%, rgba(${(bgConfig.color >> 16) & 255}, ${(bgConfig.color >> 8) & 255}, ${bgConfig.color & 255}, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(${(bgConfig.color >> 16) & 255}, ${(bgConfig.color >> 8) & 255}, ${bgConfig.color & 255}, 0.06) 0%, transparent 50%),
        linear-gradient(180deg, rgb(${(bgConfig.color >> 16) & 255}, ${(bgConfig.color >> 8) & 255}, ${bgConfig.color & 255}) 0%, rgb(${Math.max(0, ((bgConfig.color >> 16) & 255) - 20)}, ${Math.max(0, ((bgConfig.color >> 8) & 255) - 20)}, ${Math.max(0, (bgConfig.color & 255) - 20)}) 100%)
      `;
    }
  }

  createRooms() {
    // (Keep original room creation code unchanged)
    // ... [Previous room creation code] ...
  }

createGlasses() {
  const glasses = new THREE.Group();
  
  // Enhanced purple frame material
  const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transparent: false
  });
  
  // Ultra-smooth left lens frame with high segments for perfect curves
  const leftFrameGeometry = new THREE.TorusGeometry(0.8, 0.15, 32, 64);
  const leftFrame = new THREE.Mesh(leftFrameGeometry, frameMaterial);
  leftFrame.position.set(-1.3, 0, 0);
  leftFrame.rotation.z = Math.PI/2;
  glasses.add(leftFrame);
  
  // Right lens frame (matching smoothness)
  const rightFrame = new THREE.Mesh(leftFrameGeometry, frameMaterial);
  rightFrame.position.set(1.3, 0, 0);
  rightFrame.rotation.z = Math.PI/2;
  glasses.add(rightFrame);
  
  // Smooth bridge with rounded edges
  const bridgeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 32);
  const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
  bridge.rotation.z = Math.PI/2;
  bridge.position.set(0, 0, 0);
  glasses.add(bridge);
  
const templeGeometry = new THREE.CylinderGeometry(0.12, 0.12, 2.5, 16);

const leftTemple = new THREE.Mesh(templeGeometry, frameMaterial);
// rotate around X to make them run along the Z axis:
leftTemple.rotation.x = Math.PI / 2;
// move them out to the sides (X), then back (Z)
leftTemple.position.set(-1.95, 0, -1.25);
glasses.add(leftTemple);

const rightTemple = new THREE.Mesh(templeGeometry, frameMaterial);
rightTemple.rotation.x = Math.PI / 2;
rightTemple.position.set(1.95, 0, -1.25);
glasses.add(rightTemple);

// Hinges: same Z-depth as temples so they sit right at the pivot
const hingeGeometry = new THREE.SphereGeometry(0.12, 32, 32);


const leftHinge = new THREE.Mesh(hingeGeometry, frameMaterial);
// X matches the temple X, Z matches the temple Z
leftHinge.position.set(-1.95, 0, -1.25);
glasses.add(leftHinge);

const rightHinge = new THREE.Mesh(hingeGeometry, frameMaterial);
rightHinge.position.set(1.95, 0, -1.25);
glasses.add(rightHinge);

  // High-quality purple energy lenses
  const lensGeometry = new THREE.CircleGeometry(0.7, 64);
  const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9333ea,
      transmission: 0.8,
      roughness: 0.01,
      thickness: 0.15,
      ior: 1.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0
  });
  
  const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
  leftLens.position.set(-1.3, 0, 0.05);
  glasses.add(leftLens);
  
  const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
  rightLens.position.set(1.3, 0, 0.05);
  glasses.add(rightLens);
  
  // Smooth energy effects inside lenses - using purple/pink palette
  const energyRingGeometry = new THREE.RingGeometry(0.2, 0.4, 32);
  const energyMaterial = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
  });
  
  const leftEnergyRing = new THREE.Mesh(energyRingGeometry, energyMaterial);
  leftEnergyRing.position.set(-1.3, 0, 0.1);
  glasses.add(leftEnergyRing);
  
  const rightEnergyRing = new THREE.Mesh(energyRingGeometry, energyMaterial);
  rightEnergyRing.position.set(1.3, 0, 0.1);
  glasses.add(rightEnergyRing);
  
  // Inner energy cores - matching purple palette
  const coreGeometry = new THREE.CircleGeometry(0.15, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
  });
  
  const leftCore = new THREE.Mesh(coreGeometry, coreMaterial);
  leftCore.position.set(-1.3, 0, 0.12);
  glasses.add(leftCore);
  
  const rightCore = new THREE.Mesh(coreGeometry, coreMaterial);
  rightCore.position.set(1.3, 0, 0.12);
  glasses.add(rightCore);
  
  // Ultra-smooth nose pads
  const nosePadGeometry = new THREE.SphereGeometry(0.08, 32, 32);
  const nosePadMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6b46c1,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.8
  });
  
  const leftNosePad = new THREE.Mesh(nosePadGeometry, nosePadMaterial);
  leftNosePad.position.set(-0.5, -0.3, 0.2);
  glasses.add(leftNosePad);
  
  const rightNosePad = new THREE.Mesh(nosePadGeometry, nosePadMaterial);
  rightNosePad.position.set(0.5, -0.3, 0.2);
  glasses.add(rightNosePad);
  
  // Smooth tech accents with rounded edges
  const techAccentGeometry = new THREE.SphereGeometry(0.06, 24, 24);
  const techMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.8,
      roughness: 0.1,
      clearcoat: 1.0,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.1
  });
  
  const leftAccent = new THREE.Mesh(techAccentGeometry, techMaterial);
  leftAccent.position.set(-1.95, 0.2, 0);
  glasses.add(leftAccent);
  
  const rightAccent = new THREE.Mesh(techAccentGeometry, techMaterial);
  rightAccent.position.set(1.95, 0.2, 0);
  glasses.add(rightAccent);
  
  // Additional smooth lens rim details
  const rimGeometry = new THREE.TorusGeometry(0.75, 0.02, 16, 64);
  const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.05
  });
  
  const leftRim = new THREE.Mesh(rimGeometry, rimMaterial);
  leftRim.position.set(-1.3, 0, 0.03);
  leftRim.rotation.z = Math.PI/2;
  glasses.add(leftRim);
  
  const rightRim = new THREE.Mesh(rimGeometry, rimMaterial);
  rightRim.position.set(1.3, 0, 0.03);
  rightRim.rotation.z = Math.PI/2;
  glasses.add(rightRim);
  
  // Positioning and scale
  glasses.position.set(0, 0.1, 0.5);
  glasses.scale.set(0.3, 0.3, 0.3);
  glasses.rotation.set(0, Math.PI, 0);
  
  // Enhanced purple lighting
  const rimLight = new THREE.PointLight(0x8b5cf6, 0.5, 1.5);
  rimLight.position.set(0, 0, 0.2);
  glasses.add(rimLight);

  this.scene.add(glasses);
  this.glasses = glasses;
  this.glasses.userData = {
      isActive: false,
      lensEffect: { 
          material: lensMaterial,
          energyMaterial: energyMaterial,
          coreMaterial: coreMaterial
      },
      animation: {
          energyRing: [leftEnergyRing, rightEnergyRing],
          core: [leftCore, rightCore]
      }
  };
}

  createLighting(lightingConfig = null) {
    // Use default space lighting if no config provided
    if (!lightingConfig) {
      lightingConfig = this.environments[0].lighting;
    }
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(lightingConfig.ambient.color, lightingConfig.ambient.intensity);
    this.scene.add(ambientLight);

    // Main light
    const mainLight = new THREE.DirectionalLight(lightingConfig.main.color, lightingConfig.main.intensity);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);
    this.lights.push(ambientLight, mainLight);

    // Accent lights
    lightingConfig.accents.forEach(accentConfig => {
      accentConfig.positions.forEach(pos => {
        const light = new THREE.PointLight(accentConfig.color, accentConfig.intensity, 10);
        light.position.set(pos.x, pos.y, pos.z);
        this.lights.push(light);
        this.scene.add(light);
      });
    });
  }

  createParticles(particleConfig = null) {
    // Use default space particles if no config provided
    if (!particleConfig) {
      particleConfig = this.environments[0].particles;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = particleConfig.count;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Positions
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      // Colors with more variation
      const color = new THREE.Color();
      const hueVariation = (Math.random() - 0.5) * 0.2;
      color.setHSL(
        particleConfig.colors.hue + hueVariation, 
        particleConfig.colors.saturation + (Math.random() - 0.5) * 0.2, 
        particleConfig.colors.lightness + Math.random() * 0.4
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Velocities for movement patterns
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Phase for wave motions
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: particleConfig.size,
      vertexColors: true,
      transparent: true,
      opacity: particleConfig.opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = { 
      movement: particleConfig.movement,
      baseOpacity: particleConfig.opacity
    };
    this.scene.add(particles);
    this.particles.push(particles);
  }

  updateParticleMovement() {
    this.particles.forEach(particle => {
      const positions = particle.geometry.attributes.position.array;
      const velocities = particle.geometry.attributes.velocity.array;
      const phases = particle.geometry.attributes.phase.array;
      const movement = particle.userData.movement;
      const time = Date.now() * 0.001;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        
        switch (movement) {
          case 'drift':
            // Space: slow drifting with slight rotation
            positions[i3] += velocities[i3] * 0.5;
            positions[i3 + 1] += Math.sin(time + phases[i]) * 0.003;
            positions[i3 + 2] += velocities[i3 + 2] * 0.5;
            break;
            
          case 'fireflies':
            // Forest: erratic firefly movement
            positions[i3] += Math.sin(time * 2 + phases[i]) * 0.01;
            positions[i3 + 1] += Math.cos(time * 1.5 + phases[i]) * 0.008;
            positions[i3 + 2] += Math.sin(time * 0.8 + phases[i]) * 0.006;
            break;
            
          case 'bubbles':
            // Ocean: rising bubbles with water current
            positions[i3 + 1] += 0.01; // Rise
            positions[i3] += Math.sin(time + phases[i]) * 0.005; // Sway
            positions[i3 + 2] += Math.cos(time * 0.7 + phases[i]) * 0.003;
            
            // Reset bubbles that reach surface
            if (positions[i3 + 1] > 15) {
              positions[i3 + 1] = -15;
              positions[i3] = (Math.random() - 0.5) * 50;
              positions[i3 + 2] = (Math.random() - 0.5) * 50;
            }
            break;
            
          case 'matrix':
            // Cyber: digital rain effect
            positions[i3 + 1] -= 0.08; // Fall down
            positions[i3] += Math.sin(time * 5 + phases[i]) * 0.002; // Slight digital glitch
            
            // Reset particles that fall below
            if (positions[i3 + 1] < -15) {
              positions[i3 + 1] = 15;
              positions[i3] = (Math.random() - 0.5) * 50;
              positions[i3 + 2] = (Math.random() - 0.5) * 50;
            }
            break;
            
          case 'sand':
            // Desert: wind-blown sand particles
            positions[i3] += Math.sin(time * 0.5 + phases[i]) * 0.02;
            positions[i3 + 1] += Math.cos(time * 0.3 + phases[i]) * 0.005;
            positions[i3 + 2] += velocities[i3 + 2] * 0.8;
            break;
            
          case 'aurora':
            // Aurora: flowing northern lights
            positions[i3] += Math.sin(time * 0.8 + phases[i]) * 0.015;
            positions[i3 + 1] += Math.cos(time * 0.6 + phases[i]) * 0.01;
            positions[i3 + 2] += Math.sin(time * 0.4 + phases[i] + positions[i3] * 0.1) * 0.008;
            break;
            
          default:
            // Default gentle movement
            positions[i3 + 1] += Math.sin(time + phases[i]) * 0.001;
        }
        
        // Boundary wrapping for x and z
        if (positions[i3] > 25) positions[i3] = -25;
        if (positions[i3] < -25) positions[i3] = 25;
        if (positions[i3 + 2] > 25) positions[i3 + 2] = -25;
        if (positions[i3 + 2] < -25) positions[i3 + 2] = 25;
      }
      
      particle.geometry.attributes.position.needsUpdate = true;
      
      // Dynamic opacity changes for some effects
      if (movement === 'fireflies' || movement === 'aurora') {
        particle.material.opacity = particle.userData.baseOpacity + 
          Math.sin(time * 3) * 0.2;
      }
    });
  }

  setupInteractions() {
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    document.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.glasses, true);
      
      if (intersects.length > 0) {
        this.useGlasses();
      }
    });
  }

  useGlasses() {
    if (this.glasses.userData.isActive) return;
    
    this.glasses.userData.isActive = true;
    
    // Activate lens effect
    const lens = this.glasses.userData.lensEffect;
    const flashDuration = 1000;
    const startTime = Date.now();
    
    const animateFlash = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / flashDuration;
        
        if (progress < 1) {
            // Intense flash at midpoint
            const intensity = progress < 0.5 ? 
                progress * 2 : 
                1 - (progress - 0.5) * 2;
            
            lens.material.opacity = 0.8 + intensity * 0.2;
            lens.energyMaterial.opacity = 0.9 + intensity * 0.1;
            lens.coreMaterial.opacity = 1 + intensity * 0.5;
            
            // Shake effect
            this.glasses.rotation.z = Math.sin(progress * Math.PI * 10) * 0.1;
            
            // Light effects
            this.lights.forEach(light => {
                light.intensity = 1 + intensity * 2;
            });
            
            requestAnimationFrame(animateFlash);
        } else {
            // Reset glasses
            lens.material.opacity = 0.8;
            lens.energyMaterial.opacity = 0.9;
            lens.coreMaterial.opacity = 1;
            this.glasses.rotation.z = 0;
            this.glasses.userData.isActive = false;
            
            // Switch to next room
            this.switchRoom();
        }
    };
    
    // Trigger audio effect
    if (window.app && window.app.audioVisualizer) {
        window.app.audioVisualizer.triggerVisualization('teleport');
    }
    
    // Create screen flash
    const flash = document.createElement('div');
    flash.className = 'teleport-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
    
    animateFlash();
  }

  switchRoom() {
    // (Keep original room switching code unchanged)
    // ... [Previous room switching code] ...
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Camera movement based on mouse
    this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouse.y * 1 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    // Enhanced particle animations with environment-specific movement
    this.updateParticleMovement();

    // Dynamic lighting based on environment
    this.updateDynamicLighting();

    // Glasses animations if they exist
    if (this.glasses && this.glasses.userData) {
        // Enhanced pulsing energy in lenses
        const time = Date.now() * 0.001;
        const energyPulse = 0.9 + Math.sin(time * 2) * 0.3;
        this.glasses.userData.lensEffect.energyMaterial.opacity = energyPulse;
        
        const corePulse = 1 + Math.sin(time * 3) * 0.2;
        this.glasses.userData.lensEffect.coreMaterial.opacity = corePulse;
        
        // Enhanced rotating energy rings
        this.glasses.userData.animation.energyRing[0].rotation.z += 0.025;
        this.glasses.userData.animation.energyRing[1].rotation.z -= 0.025;
        
        // Enhanced pulsing energy cores
        const coreScale = 1 + Math.sin(time * 2.5) * 0.25;
        this.glasses.userData.animation.core[0].scale.set(coreScale, coreScale, 1);
        this.glasses.userData.animation.core[1].scale.set(coreScale, coreScale, 1);
        
        // Enhanced floating animation with environment influence
        const currentEnv = this.environments[this.currentEnvironment];
        const floatIntensity = currentEnv.name === 'Ocean' ? 0.05 : 0.03;
        this.glasses.position.y = 0.1 + Math.sin(time * 1.5) * floatIntensity;
        this.glasses.rotation.y = Math.PI + Math.sin(time * 0.8) * 0.02;
        
        // Environment-specific lens effects - but keep glasses purple
        if (currentEnv.name === 'Cyber') {
            // Add digital glitch effect but maintain purple color
            if (Math.random() < 0.01) {
                this.glasses.position.x += (Math.random() - 0.5) * 0.02;
                setTimeout(() => {
                    this.glasses.position.x = 0;
                }, 50);
            }
        }
        
        // Ensure glasses always stay purple regardless of environment
        if (this.glasses.userData.lensEffect) {
            // Keep lens colors purple
            this.glasses.userData.lensEffect.material.color.setHex(0x9333ea);
            this.glasses.userData.lensEffect.energyMaterial.color.setHex(0xc084fc);
            this.glasses.userData.lensEffect.coreMaterial.color.setHex(0xa78bfa);
        }
    }

    this.renderer.render(this.scene, this.camera);
  }

  updateDynamicLighting() {
    const time = Date.now() * 0.001;
    const currentEnv = this.environments[this.currentEnvironment];
    
    this.lights.forEach((light, index) => {
        if (light.type === 'PointLight') {
            // Environment-specific lighting animations
            switch (currentEnv.name) {
                case 'Forest':
                    light.intensity = light.userData?.baseIntensity || 0.8 + Math.sin(time * 2 + index) * 0.3;
                    break;
                case 'Ocean':
                    light.intensity = light.userData?.baseIntensity || 0.8 + Math.sin(time + index) * 0.2;
                    light.position.y += Math.sin(time * 0.5 + index) * 0.1;
                    break;
                case 'Cyber':
                    light.intensity = light.userData?.baseIntensity || 0.8 + Math.random() * 0.4;
                    break;
                case 'Aurora':
                    light.intensity = light.userData?.baseIntensity || 0.8 + Math.sin(time * 1.5 + index) * 0.4;
                    break;
                default:
                    light.intensity = light.userData?.baseIntensity || 0.8 + Math.sin(time * 0.8 + index) * 0.2;
            }
            
            // Store base intensity if not set
            if (!light.userData?.baseIntensity) {
                light.userData = { baseIntensity: light.intensity };
            }
        }
    });
  }
}

class AudioVisualizer {
  constructor() {
    this.container = document.getElementById('audioVisualizer');
    this.bars = [];
    this.isActive = false;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.audioElement = new Audio('teleport.wav');
    this.audioElement.preload = 'auto';
    
    // Pre-load the audio file
    this.audioElement.load();
    this.initVisualizer();
  }

  async initAudio() {
    try {
      console.log('Initializing audio context...');
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaElementSource(this.audioElement);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 32;
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      // iOS/Safari requires explicit resume
      if (this.audioContext.state === 'suspended') {
        console.log('Resuming suspended audio context...');
        await this.audioContext.resume();
      }
      return true;
    } catch (e) {
      console.error('Audio initialization failed:', e);
      return false;
    }
  }

  initVisualizer() {
    // Create visualizer bars
    for (let i = 0; i < 12; i++) {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      bar.style.height = '10px';
      bar.style.background = `hsl(${270 + i * 5}, 80%, 50%)`;
      this.container.appendChild(bar);
      this.bars.push(bar);
    }
  }

  async playTeleportSound() {
    console.log('Attempting to play sound...');
    
    // Initialize audio if not already done
    if (!this.audioContext) {
      const success = await this.initAudio();
      if (!success) return;
    }

    try {
      // Handle iOS/Safari suspension
      if (this.audioContext.state === 'suspended') {
        console.log('Audio context suspended, attempting to resume...');
        await this.audioContext.resume();
      }

      console.log('Playing audio...');
      this.audioElement.currentTime = 0;
      await this.audioElement.play().catch(e => {
        console.error("Audio playback failed:", e);
      });
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  }

  async triggerVisualization(type) {
    if (this.isActive) return;
    
    console.log(`Triggering ${type} visualization...`);
    await this.playTeleportSound();
    
    this.isActive = true;
    const patterns = {
      teleport: [90, 30, 70, 20, 80, 40, 60, 30, 90, 50, 70, 40],
      sound: [40, 70, 50, 80, 60, 90, 50, 70, 60, 80, 50, 70],
      mystery: [30, 60, 40, 70, 50, 80, 40, 60, 50, 70, 40, 60]
    };

    const pattern = patterns[type] || patterns.teleport;
    let frame = 0;
    const maxFrames = type === 'teleport' ? 60 : 120;

    const animate = () => {
      if (frame >= maxFrames) {
        this.isActive = false;
        this.bars.forEach(bar => bar.style.height = '10px');
        return;
      }

      this.bars.forEach((bar, index) => {
        const intensity = pattern[index] * (1 - frame / maxFrames) * 
          (type === 'teleport' ? Math.random() * 2 : Math.random());
        bar.style.height = Math.max(10, intensity) + 'px';
        
        if (type === 'teleport') {
          bar.style.opacity = 0.5 + Math.random() * 0.5;
        }
      });

      frame++;
      requestAnimationFrame(animate);
    };

    animate();
  }
}

// Team Management System
class TeamSystem {
  constructor() {
    this.members = document.querySelectorAll('.team-member');
    this.currentMember = 0;
    this.autoRotate();
  }

  showMember(index) {
    this.members.forEach(member => member.classList.remove('active'));
    if (this.members[index]) {
      this.members[index].classList.add('active');
      this.currentMember = index;
    }
  }

  autoRotate() {
    setInterval(() => {
      this.currentMember = (this.currentMember + 1) % this.members.length;
      this.showMember(this.currentMember);
    }, 5000);
  }
}

// Navigation System
class NavigationSystem {
  constructor() {
    this.navItems = document.querySelectorAll('.nav-item');
    this.sections = document.querySelectorAll('.content-section');
    this.currentSection = 'room';
    this.init();
  }

  init() {
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const scene = item.dataset.scene;
        this.switchScene(scene);
      });
    });
  }

  switchScene(scene) {
    // Update nav active state
    this.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.scene === scene);
    });

    // Hide all sections
    this.sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section (except for room which shows the 3D scene)
    if (scene !== 'room') {
      const targetSection = document.getElementById(`section-${scene}`);
      if (targetSection) {
        targetSection.classList.add('active');
        
        // If switching to video section, ensure intro video is showing
        if (scene === 'video') {
          restartExperience();
        }
      }
    }

    this.currentSection = scene;
  }
}

class InteractionSystem {
    constructor() {
    this.panel = document.getElementById('interactionPanel');
    this.glassesButtons = document.querySelectorAll('.glasses-button');
    this.init();
  }

  init() {
    setTimeout(() => {
      if (this.panel) {
        this.panel.classList.add('active');
      }
    }, 2000);

    this.glassesButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const glassesType = button.dataset.glasses;
        this.triggerGlasses(glassesType, button, e);
      });
    });
  }

  triggerGlasses(type, button, clickEvent) {
    button.classList.add('active');
    
    // Play sound and trigger visualization
    if (window.app && window.app.audioVisualizer) {
      window.app.audioVisualizer.playTeleportSound();
      window.app.audioVisualizer.triggerVisualization(type);
    }
    
    const flash = document.createElement('div');
    flash.className = 'teleport-flash';
    document.body.appendChild(flash);
    
    setTimeout(() => {
      button.classList.remove('active');
      flash.remove();
      
      if (window.app && window.app.scene) {
        window.app.scene.useGlasses();
      }
    }, 1000);
  }
}

// Video Room Functions
function showVideoRoom() {
  const videoOverlay = document.getElementById('videoRoomOverlay');
  videoOverlay.classList.add('active');
}

function closeVideoRoom() {
  const videoOverlay = document.getElementById('videoRoomOverlay');
  videoOverlay.classList.remove('active');
}

// Section Close Function
function closeSection() {
  // Hide all content sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Set Room as active in navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.scene === 'room');
  });
  
  // Update navigation system current section
  if (window.app && window.app.navigationSystem) {
    window.app.navigationSystem.currentSection = 'room';
  }
}

// Resize handler
window.addEventListener('resize', () => {
  if (window.app && window.app.scene) {
    window.app.scene.camera.aspect = window.innerWidth / window.innerHeight;
    window.app.scene.camera.updateProjectionMatrix();
    window.app.scene.renderer.setSize(window.innerWidth, window.innerHeight);
  }
});


