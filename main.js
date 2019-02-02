const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const width = canvas.width = 600;
const height = canvas.height = 400;

const isOffscreen = true;


if (isOffscreen) {
  const offscreen = canvas.transferControlToOffscreen();
  const worker = new Worker('offscreen.js?_=123');
  
  const tmpCanvas = document.createElement('canvas');
  const tmpCtx = tmpCanvas.getContext('2d');
  const image = new Image();
  image.onload = (data) => {
    tmpCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
    let imageData = tmpCtx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
    worker.postMessage({canvas: offscreen, image: imageData.data.buffer}, [offscreen, imageData.data.buffer])
    worker.postMessage({msg: 'hello'});
    worker.postMessage({msg: 'hello'});
    worker.postMessage({msg: 'hello'});
    worker.postMessage({msg: 'hello'});
    worker.postMessage({msg: 'hello'});
    worker.postMessage({msg: 'hello'});
    worker.postMessage({msg: 'hello'});
  }
  image.src = './sword.png';

} else {
  const ctx = canvas.getContext("2d");
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
      if (b.x < 0) {
        b.dx = -b.dx;
      }
      if (b.y < 0) {
        b.dy = -b.dy;
      }
      
      if (b.y > canvas.height) {
        b.dy = -b.dy;
      }
      
      if (b.x > canvas.width) {
        b.dx = -b.dx;
      }
    });
  }
    
  function draw() {
    balls.forEach(b => {
      ctx.fillStyle = 'red';
      ctx.beginPath()
      ctx.arc(b.x, b.y, 5, 0, Math.PI*2);
      ctx.fill();
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
}