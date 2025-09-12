(function(){
  const canvas = document.getElementById('dinoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Game state
  let running = true;
  let gameOver = false;
  let speed = 6;
  let groundY = H - 30;
  let score = 0;
  let best = Number(localStorage.getItem('dinoBest')||'0');
  const scoreEl = document.getElementById('dinoScore');
  const bestEl = document.getElementById('dinoBest');
  if (bestEl) bestEl.textContent = String(best);

  // Dino
  const dino = {
    x: 40,
    y: groundY - 30,
    w: 28,
    h: 30,
    vy: 0,
    gravity: 0.9,
    jumpForce: 14,
    jumping: false
  };

  // Obstacles
  const obstacles = [];
  function spawnCactus(){
    const height = 20 + Math.floor(Math.random()*26); // 20-45
    obstacles.push({ x: W + 10, y: groundY - height, w: 16 + Math.random()*12, h: height });
  }
  let spawnTimer = 0;

  // Clouds for parallax
  const clouds = [];
  function spawnCloud(){ clouds.push({ x: W + 10, y: 20 + Math.random()*80, w: 50 + Math.random()*40, h: 14, s: 1.2 + Math.random()*0.8 }); }
  let cloudTimer = 0;

  // Ground pattern
  function drawGround(){
    ctx.strokeStyle = '#1f1f1f';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();
  }

  function drawDino(){
    // body
    ctx.fillStyle = '#00ff99';
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    // head
    ctx.fillRect(dino.x + dino.w - 8, dino.y - 10, 10, 10);
    // eye
    ctx.fillStyle = '#0e0e0e';
    ctx.fillRect(dino.x + dino.w, dino.y - 6, 2, 2);
  }

  function drawCactus(c){
    ctx.fillStyle = '#00ccff';
    ctx.fillRect(c.x, c.y, c.w, c.h);
  }

  function drawCloud(cl){
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(cl.x, cl.y, cl.w, cl.h);
  }

  function collide(a,b){
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function jump(){
    if (gameOver) return restart();
    if (!dino.jumping) {
      dino.jumping = true;
      dino.vy = -dino.jumpForce;
    }
  }

  function togglePause(){ running = !running; if (running) requestAnimationFrame(loop); }
  function restart(){ score = 0; speed = 6; obstacles.length = 0; clouds.length = 0; dino.y = groundY - dino.h; dino.vy = 0; dino.jumping = false; gameOver = false; running = true; requestAnimationFrame(loop); }

  window.addEventListener('keydown', (e)=>{
    if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); jump(); }
    if (e.key.toLowerCase() === 'p') togglePause();
    if (e.key.toLowerCase() === 'r') restart();
  });

  function update(){
    // Spawn cactus
    spawnTimer -= 1;
    if (spawnTimer <= 0){
      spawnCactus();
      spawnTimer = 60 + Math.random()*60; // 1-2s
    }
    // Spawn clouds
    cloudTimer -= 1;
    if (cloudTimer <= 0){
      spawnCloud();
      cloudTimer = 90 + Math.random()*90;
    }

    // Dino physics
    dino.vy += dino.gravity;
    dino.y += dino.vy;
    if (dino.y > groundY - dino.h){ dino.y = groundY - dino.h; dino.jumping = false; dino.vy = 0; }

    // Move obstacles
    for (let i=obstacles.length-1;i>=0;i--){
      const c = obstacles[i];
      c.x -= speed;
      if (c.x + c.w < 0) obstacles.splice(i,1);
      if (collide({x:dino.x,y:dino.y,w:dino.w,h:dino.h}, c)) { gameOver = true; running = false; }
    }

    // Move clouds
    for (let i=clouds.length-1;i>=0;i--){
      const cl = clouds[i];
      cl.x -= cl.s;
      if (cl.x + cl.w < 0) clouds.splice(i,1);
    }

    // Score and difficulty
    score += 1;
    if (score % 300 === 0) speed += 0.5;
    if (scoreEl) scoreEl.textContent = String(score);
    if (score > best){ best = score; localStorage.setItem('dinoBest', String(best)); if (bestEl) bestEl.textContent = String(best); }
  }

  function render(){
    ctx.clearRect(0,0,W,H);
    // sky background matches site
    ctx.fillStyle = '#0b0b0b';
    ctx.fillRect(0,0,W,H);
    clouds.forEach(drawCloud);
    drawGround();
    obstacles.forEach(drawCactus);
    drawDino();

    if (gameOver){
      ctx.fillStyle = '#ff5577';
      ctx.font = '16px Poppins, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over - pressione R para reiniciar', W/2, H/2);
    }
  }

  function loop(){
    if (!running) { return; }
    update();
    render();
    requestAnimationFrame(loop);
  }

  // Start
  spawnCloud();
  spawnCactus();
  requestAnimationFrame(loop);
})();
