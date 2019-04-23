<template>
    <canvas class="bg-canvas" ref="bgCanvas"></canvas>
</template>

<script>
    import flower from '../assets/img/flower.png'
    // 游戏场景前景动画
    export default {
        name: "prospect",
        mounted() {
            this.loadImage(flower).then(flower => {
                this.initFlower(flower)
            })
        },

        methods: {
            loadImage(src) {
                let img = document.createElement("img")
                return new Promise((resolve, reject) => {
                    img.onload = function () {
                        resolve(img)
                    }
                    img.onerror = function () {
                        reject(false)
                    }
                    img.src = src
                })

            },
            initFlower(flower) {
                let canvas = this.$refs.bgCanvas
                let ctx = canvas.getContext("2d");

                //canvas dimensions
                let W = window.innerWidth;
                let H = window.innerHeight;
                canvas.width = W;
                canvas.height = H;

                //snowflake particles
                let mp = 15; //max particles
                let particles = [];
                for (let i = 0; i < mp; i++) {
                    particles.push({
                        x: Math.random() * W, //x-coordinate
                        y: Math.random() * H, //y-coordinate
                        r: Math.random() * 8 + 4, //radius
                        d: Math.random() * mp //density
                    })
                }

                //Lets draw the flakes
                function draw() {
                    ctx.clearRect(0, 0, W, H);

                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    ctx.beginPath();
                    for (let i = 0; i < mp; i++) {
                        let p = particles[i];
                        // ctx.moveTo(p.x, p.y);
                        ctx.drawImage(flower, p.x, p.y, p.r, p.r)
                        // ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
                    }
                    ctx.fill();
                    update();
                }


                let angle = 0;

                function update() {
                    angle += 0.01;
                    for (let i = 0; i < mp; i++) {
                        let p = particles[i];

                        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
                        p.x += Math.sin(angle) * 2;

                        if (p.x > W + 5 || p.x < -5 || p.y > H) {
                            if (i % 3 > 0) //66.67% of the flakes
                            {
                                particles[i] = {x: Math.random() * W, y: -10, r: p.r, d: p.d};
                            }
                            else {
                                //If the flake is exitting from the right
                                if (Math.sin(angle) > 0) {
                                    //Enter from the left
                                    particles[i] = {x: -5, y: Math.random() * H, r: p.r, d: p.d};
                                }
                                else {
                                    //Enter from the right
                                    particles[i] = {x: W + 5, y: Math.random() * H, r: p.r, d: p.d};
                                }
                            }
                        }
                    }
                }

                //animation loop
                setInterval(draw, 33);
            }
        }
    }
</script>

<style scoped lang="scss">
    .bg-canvas {
        touch-action: none;
        pointer-events: none;
        cursor: inherit;

        position: absolute;
        z-index: 99999;
        top: 0;
        left: 0;
        opacity: 1;
        width: 100vw;
        height: 100vh;
    }


</style>
