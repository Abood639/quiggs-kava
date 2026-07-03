class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    this.colors = [
      'rgba(5, 150, 105, 0.06)',  // Translucent Emerald
      'rgba(217, 119, 6, 0.05)',  // Translucent Amber
      'rgba(180, 83, 9, 0.04)',   // Translucent Gold
    ];
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  init() {
    this.resize();
    const particleCount = Math.min(40, Math.floor((this.canvas.width * this.canvas.height) / 30000));
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 80 + 40,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.005 + 0.002
    };
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p) => {
      // Move particle
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;
      
      // Boundaries
      if (p.x - p.radius > this.canvas.width) p.x = -p.radius;
      if (p.x + p.radius < 0) p.x = this.canvas.width + p.radius;
      if (p.y - p.radius > this.canvas.height) p.y = -p.radius;
      if (p.y + p.radius < 0) p.y = this.canvas.height + p.radius;
      
      // Mouse Interaction (slow repulsion)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }
      }
      
      // Render
      const currentRadius = p.radius + Math.sin(p.pulse) * 10;
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleBackground();
});
