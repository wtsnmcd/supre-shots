function drawBackground(state){
	const ctx = state.ctx;
	const W = state.W;
	const H = state.H;
	
	// Dark atmospheric gradient background
	const grad = ctx.createLinearGradient(0, 0, 0, H);
	grad.addColorStop(0, '#0a0a15');
	grad.addColorStop(0.5, '#1a0a20');
	grad.addColorStop(1, '#0f0f1a');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, W, H);
	
	// Animated grid pattern
	const gridSize = 60;
	const offset = (state.background.scroll % gridSize);
	ctx.strokeStyle = 'rgba(0, 255, 150, 0.08)';
	ctx.lineWidth = 1;
	
	// Vertical lines
	for(let x = -gridSize + offset; x < W; x += gridSize){
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, H);
		ctx.stroke();
	}
	
	// Horizontal lines
	for(let y = -gridSize + offset; y < H; y += gridSize){
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(W, y);
		ctx.stroke();
	}
	
	// Draw and update particles
	if(!state.background.particles || state.background.particles.length < 40){
		if(!state.background.particles) state.background.particles = [];
		for(let i = state.background.particles.length; i < 40; i++){
			state.background.particles.push({
				x: Math.random() * W,
				y: Math.random() * H,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 1.5 + 0.5,
				brightness: Math.random() * 0.7 + 0.3
			});
		}
	}
	
	for(let p of state.background.particles){
		p.x += p.vx;
		p.y += p.vy;
		
		if(p.x < 0) p.x = W;
		if(p.x > W) p.x = 0;
		if(p.y < 0) p.y = H;
		if(p.y > H) p.y = 0;
		
		ctx.fillStyle = `rgba(0, 255, 200, ${p.brightness * 0.6})`;
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();
	}
	
	state.background.scroll += 0.015;
}

export function draw(state){
	const ctx = state.ctx;
	drawBackground(state);
	for(let b of state.bullets){ctx.fillStyle='#ffd'; ctx.beginPath(); ctx.arc(b.x,b.y,3,0,Math.PI*2); ctx.fill()}
	for(let p of state.pickups){ctx.fillStyle='magenta'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='white'; ctx.fillRect(p.x-6,p.y-2,12,4); ctx.fillRect(p.x-2,p.y-6,4,12)}
	for(let eb of state.enemyBullets){ctx.fillStyle='orangered'; ctx.beginPath(); ctx.arc(eb.x, eb.y, eb.r, 0, Math.PI*2); ctx.fill()}
	for(let z of state.zombies){
		const hpRatio = Math.max(0,z.hp)/z.maxHp;
		const app = state.zombieAppearance;
		const scale = (z.r * app.sizeMultiplier) / 4;
		
		if(state.zombieSprite && z.type === 'walker'){
			ctx.save();
			ctx.globalAlpha = app.useCustomColors ? 0.8 : 1.0;
			const spriteSize = 64;
			const scaledSize = spriteSize * scale;
			ctx.drawImage(state.zombieSprite, z.x - scaledSize/2, z.y - scaledSize/2, scaledSize, scaledSize);
			if(app.useCustomColors){
				ctx.globalCompositeOperation = 'multiply';
				ctx.fillStyle = app.walkerColor;
				ctx.fillRect(z.x - scaledSize/2, z.y - scaledSize/2, scaledSize, scaledSize);
			}
			ctx.restore();
		} else {
			let col;
			if(z.type === 'runner') col = app.useCustomColors ? app.runnerColor : `rgb(80,200,80)`;
			else if(z.type === 'brute') col = app.useCustomColors ? app.bruteColor : `rgb(180,60,60)`;
			else if(z.type === 'spitter') col = app.useCustomColors ? app.spitterColor : `rgb(150,100,180)`;
			else col = app.useCustomColors ? app.walkerColor : `rgb(${200-150*hpRatio},${60+100*hpRatio},60)`;
			ctx.fillStyle = col; ctx.beginPath(); ctx.arc(z.x,z.y,z.r*app.sizeMultiplier,0,Math.PI*2); ctx.fill();
		}
		ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(z.x-12*app.sizeMultiplier,z.y-18*app.sizeMultiplier,24*app.sizeMultiplier,4); ctx.fillStyle='lime'; ctx.fillRect(z.x-12*app.sizeMultiplier,z.y-18*app.sizeMultiplier,24*hpRatio*app.sizeMultiplier,4)
	}
	if(state.miniboss){
		const mRatio = Math.max(0, state.miniboss.hp) / state.miniboss.maxHp;
		ctx.fillStyle = 'darkviolet'; ctx.beginPath(); ctx.arc(state.miniboss.x, state.miniboss.y, state.miniboss.r, 0, Math.PI*2); ctx.fill();
		ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(state.miniboss.x-40, state.miniboss.y-state.miniboss.r-18, 80, 8);
		ctx.fillStyle='lime'; ctx.fillRect(state.miniboss.x-40, state.miniboss.y-state.miniboss.r-18, 80*mRatio, 8);
	}
	const mAngle=Math.atan2(state.input.mouseY - state.player.y, state.input.mouseX - state.player.x);
	ctx.save(); ctx.translate(state.player.x,state.player.y); ctx.rotate(mAngle); ctx.fillStyle='#4aa'; ctx.beginPath(); ctx.arc(0,0,state.player.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#222'; ctx.fillRect(state.player.r, -6, 14, 12); ctx.restore();
}
