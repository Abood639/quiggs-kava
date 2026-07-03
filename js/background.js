class MorphingBlob {
  constructor(x, y, radius, colorStart, colorEnd, speed) {
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.radius = radius;
    this.colorStart = colorStart;
    this.colorEnd = colorEnd;
    this.speed = speed;
    
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    
    // Create 8 perimeter points for morphing
    this.points = [];
    this.numPoints = 8;
    for (let i = 0; i < this.numPoints; i++) {
      this.points.push({
        angle: (i / this.numPoints) * Math.PI * 2,
        offset: Math.random() * Math.PI * 2,
        currentRadius: this.radius,
        targetRadius: this.radius
      });
    }
  }

  update(width, height, mouse, time) {
    // Drifting motion
    this.x += this.vx;
    this.y += this.vy;

    // Boundary bounces with soft cushion
    const buffer = this.radius * 1.5;
    if (this.x - buffer < 0) { this.x = buffer; this.vx *= -1; }
    if (this.x + buffer > width) { this.x = width - buffer; this.vx *= -1; }
    if (this.y - buffer < 0) { this.y = buffer; this.vy *= -1; }
    if (this.y + buffer > height) { this.y = height - buffer; this.vy *= -1; }

    // Deform points dynamically over time (organic morphing)
    this.points.forEach((p, idx) => {
      // Base morphing noise
      const timeOffset = time * this.speed + p.offset;
      let r = this.baseRadius + Math.sin(timeOffset) * (this.baseRadius * 0.25);
      r += Math.cos(timeOffset * 1.7) * (this.baseRadius * 0.1);

      // Mouse deform logic (pushing or pulling points)
      if (mouse.x !== null && mouse.y !== null) {
        const pointX = this.x + Math.cos(p.angle) * r;
        const pointY = this.y + Math.sin(p.angle) * r;
        const dx = pointX - mouse.x;
        const dy = pointY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          // Deform radius based on cursor proximity
          r += force * (this.baseRadius * 0.35);
        }
      }

      // Smooth interpolation to target radius
      p.currentRadius += (r - p.currentRadius) * 0.1;
    });
  }

  draw(ctx) {
    ctx.save();
    
    // Draw fluid organic path using Bezier curves
    ctx.beginPath();
    const firstPoint = this.points[0];
    let startX = this.x + Math.cos(firstPoint.angle) * firstPoint.currentRadius;
    let startY = this.y + Math.sin(firstPoint.angle) * firstPoint.currentRadius;
    ctx.moveTo(startX, startY);

    for (let i = 0; i < this.numPoints; i++) {
      const p1 = this.points[i];
      const p2 = this.points[(i + 1) % this.numPoints];
      
      const p1x = this.x + Math.cos(p1.angle) * p1.currentRadius;
      const p1y = this.y + Math.sin(p1.angle) * p1.currentRadius;
      const p2x = this.x + Math.cos(p2.angle) * p2.currentRadius;
      const p2y = this.y + Math.sin(p2.angle) * p2.currentRadius;

      // Control points for smooth curves
      const xc = (p1x + p2x) / 2;
      const yc = (p1y + p2y) / 2;
      ctx.quadraticCurveTo(p1x, p1y, xc, yc);
    }
    
    ctx.closePath();

    // Fill with soft multi-stop radial gradient
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.baseRadius * 1.5);
    gradient.addColorStop(0, this.colorStart);
    gradient.addColorStop(0.5, this.colorEnd);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }
}

class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.blobs = [];
    this.mouse = { x: null, y: null, radius: 250 };
    this.time = 0;
    
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
    this.blobs = [];
    
    // Create large, premium morphing blobs using green tones
    this.blobs.push(new MorphingBlob(
      this.canvas.width * 0.25,
      this.canvas.height * 0.3,
      180,
      'rgba(4, 120, 87, 0.35)',
      'rgba(4, 120, 87, 0.05)',
      0.001
    ));
    
    this.blobs.push(new MorphingBlob(
      this.canvas.width * 0.75,
      this.canvas.height * 0.7,
      220,
      'rgba(4, 120, 87, 0.30)',
      'rgba(4, 120, 87, 0.04)',
      0.0008
    ));
    
    this.blobs.push(new MorphingBlob(
      this.canvas.width * 0.8,
      this.canvas.height * 0.25,
      200,
      'rgba(5, 150, 105, 0.35)',
      'rgba(5, 150, 105, 0.05)',
      0.0012
    ));

    this.blobs.push(new MorphingBlob(
      this.canvas.width * 0.3,
      this.canvas.height * 0.8,
      160,
      'rgba(5, 150, 105, 0.30)',
      'rgba(5, 150, 105, 0.04)',
      0.0015
    ));
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  animate() {
    this.time += 1;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.blobs.forEach(blob => {
      blob.update(this.canvas.width, this.canvas.height, this.mouse, this.time);
      blob.draw(this.ctx);
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleBackground();
});
