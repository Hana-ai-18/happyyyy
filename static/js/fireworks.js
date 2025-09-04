const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [];
let particles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas nếu thay đổi kích thước
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Hàm tạo màu ngẫu nhiên
function randomColor() {
    const colors = ['#ff0040', '#ff7300', '#fffb00', '#48ff00', '#00ffd5', '#002bff', '#7a00ff', '#ff00ea'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Lớp Pháo hoa
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = canvas.height;
        this.tx = x;
        this.ty = y;
        this.distance = canvas.height - y;
        this.speed = 5;
        this.angle = Math.atan2(this.y - y, this.x - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.brightness = Math.random() * 60 + 50;
        this.exploded = false;
        this.color = randomColor();
    }

    update(index) {
        this.x -= this.vx;
        this.y -= this.vy;
        if (this.y <= this.ty) {
            this.exploded = true;
            createParticles(this.tx, this.ty, this.color);
            fireworks.splice(index, 1);
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Lớp hạt bụi sau khi nổ
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 5 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 2 + 1;
        this.life = 100;
        this.opacity = 1;
        this.color = color;
    }

    update(index) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + 0.5; // gravity
        this.life--;
        this.opacity = this.life / 100;
        if (this.life <= 0) particles.splice(index, 1);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
    }
}

// Tạo nhiều hạt sau khi nổ
function createParticles(x, y, color) {
    const count = 100;
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Hàm animation loop
function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((fw, i) => {
        fw.update(i);
        fw.draw();
    });

    particles.forEach((p, i) => {
        p.update(i);
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Bắn pháo hoa theo chu kỳ ngẫu nhiên
setInterval(() => {
    const x = Math.random() * canvas.width * 0.9 + canvas.width * 0.05;
    const y = Math.random() * canvas.height * 0.5;
    fireworks.push(new Firework(x, y));
}, 700);

// Bắn pháo hoa theo click chuột
canvas.addEventListener('click', (e) => {
    fireworks.push(new Firework(e.clientX, e.clientY));
});

animate();
