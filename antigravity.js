import * as THREE from 'https://cdn.skypack.dev/three@0.146.0';

class Antigravity {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            count: 500,
            magnetRadius: 15,
            ringRadius: 10,
            waveSpeed: 2.4,
            waveAmplitude: 1,
            particleSize: 2,
            lerpSpeed: 0.1,
            color: 'rgba(40, 27, 226, 1)',
            autoAnimate: false,
            particleVariance: 1,
            rotationSpeed: 0,
            depthFactor: 1,
            pulseSpeed: 3,
            particleShape: 'capsule',
            fieldStrength: 10,
            ...options
        };

        this.lastMousePos = { x: 0, y: 0 };
        this.lastMouseMoveTime = Date.now();
        this.virtualMouse = { x: 0, y: 0 };
        this.pointer = new THREE.Vector2(0, 0);
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 50);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.dummy = new THREE.Object3D();
        this.createParticles();

        window.addEventListener('resize', this.onWindowResize.bind(this));
        // Use window for tracking to avoid issues with elements covering the canvas
        window.addEventListener('pointermove', this.onPointerMove.bind(this));

        this.animate();
    }

    createParticles() {
        let geometry;
        switch (this.options.particleShape) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.2, 16, 16);
                break;
            case 'box':
                geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(0.3);
                break;
            case 'capsule':
            default:
                geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
                break;
        }

        const material = new THREE.MeshBasicMaterial({ color: this.options.color });
        this.mesh = new THREE.InstancedMesh(geometry, material, this.options.count);
        this.scene.add(this.mesh);

        this.particlesData = [];

        // Calculate viewport dimensions at camera distance
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * this.camera.position.z;
        const visibleWidth = visibleHeight * (this.container.clientWidth / this.container.clientHeight);

        for (let i = 0; i < this.options.count; i++) {
            const x = (Math.random() - 0.5) * visibleWidth;
            const y = (Math.random() - 0.5) * visibleHeight;
            const z = (Math.random() - 0.5) * 20;

            this.particlesData.push({
                t: Math.random() * 100,
                speed: 0.01 + Math.random() / 200,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                randomRadiusOffset: (Math.random() - 0.5) * 2
            });
        }
    }

    onPointerMove(event) {
        const rect = this.container.getBoundingClientRect();
        // Calculate normalized coordinates (-1 to 1) relative to the container
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const dist = Math.sqrt(Math.pow(this.pointer.x - this.lastMousePos.x, 2) + Math.pow(this.pointer.y - this.lastMousePos.y, 2));

        if (dist > 0.001) {
            this.lastMouseMoveTime = Date.now();
            this.lastMousePos.x = this.pointer.x;
            this.lastMousePos.y = this.pointer.y;
        }
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * this.camera.position.z;
        const visibleWidth = visibleHeight * aspect;

        let destX = (this.pointer.x * visibleWidth) / 2;
        let destY = (this.pointer.y * visibleHeight) / 2;

        if (this.options.autoAnimate && (Date.now() - this.lastMouseMoveTime > 2000)) {
            destX = Math.sin(time * 0.5) * (visibleWidth / 4);
            destY = Math.cos(time * 0.5 * 2) * (visibleHeight / 4);
        }

        const smoothFactor = 0.05;
        this.virtualMouse.x += (destX - this.virtualMouse.x) * smoothFactor;
        this.virtualMouse.y += (destY - this.virtualMouse.y) * smoothFactor;

        const targetX = this.virtualMouse.x;
        const targetY = this.virtualMouse.y;
        const globalRotation = time * this.options.rotationSpeed;

        this.particlesData.forEach((particle, i) => {
            particle.t += particle.speed / 2;
            const t = particle.t;

            const projectionFactor = 1 - particle.cz / 50;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = particle.mx - projectedTargetX;
            const dy = particle.my - projectedTargetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetPos = {
                x: particle.mx,
                y: particle.my,
                z: particle.mz * this.options.depthFactor
            };

            if (dist < this.options.magnetRadius) {
                const angle = Math.atan2(dy, dx) + globalRotation;
                const wave = Math.sin(t * this.options.waveSpeed + angle) * (0.5 * this.options.waveAmplitude);
                const deviation = particle.randomRadiusOffset * (5 / (this.options.fieldStrength + 0.1));
                const currentRingRadius = this.options.ringRadius + wave + deviation;

                targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPos.z = particle.mz * this.options.depthFactor + Math.sin(t) * (1 * this.options.waveAmplitude * this.options.depthFactor);
            }

            particle.cx += (targetPos.x - particle.cx) * this.options.lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * this.options.lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * this.options.lerpSpeed;

            this.dummy.position.set(particle.cx, particle.cy, particle.cz);
            this.dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
            this.dummy.rotateX(Math.PI / 2);

            const currentDistToMouse = Math.sqrt(
                Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
            );

            const distFromRing = Math.abs(currentDistToMouse - this.options.ringRadius);
            let scaleFactor = 1 - distFromRing / 10;
            scaleFactor = Math.max(0, Math.min(1, scaleFactor));

            const finalScale = scaleFactor * (0.8 + Math.sin(t * this.options.pulseSpeed) * 0.2 * this.options.particleVariance) * this.options.particleSize;
            this.dummy.scale.set(finalScale, finalScale, finalScale);

            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);
        });

        this.mesh.instanceMatrix.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }
}

export default Antigravity;
