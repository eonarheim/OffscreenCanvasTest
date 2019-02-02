let data = 0;
onmessage = function(evt) {
    if (evt.data.msg === 'hello'){
        console.log('hello back:', data++);
        return;
    }
    const canvas = evt.data.canvas;
    const image = new ImageData(new Uint8ClampedArray(evt.data.image), 100, 100);
    const ctx = canvas.getContext("2d");

    createImageBitmap(image).then((bitmap) => {
        const balls = [];
        for(let i = 0; i < 500; i++) {
        balls.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: Math.random() * 500,
            dy: Math.random() * 500
        });
        }
        
        function update(time) {
        balls.forEach(b => {
            b.x += b.dx * time;
            b.y += b.dy * time;
            if (b.x < -50) {
            b.dx = -b.dx;
            }
            if (b.y < -50) {
            b.dy = -b.dy;
            }
            
            if (b.y > canvas.height - 50) {
            b.dy = -b.dy;
            }
            
            if (b.x > canvas.width - 50) {
            b.dx = -b.dx;
            }
        });
        }
        
        function draw() {
        balls.forEach(b => {
            ctx.drawImage(bitmap, b.x, b.y);
        })
        }
    
        let last = null;
        function render(time) {
        if (!last) last = time;
        let delta = time - last;
        last = time;
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        //console.log('fps:', 1/(delta/1000));
        update(delta/1000);
        draw();
        requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    });
  };