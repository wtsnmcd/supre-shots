export function draw(state){
	const ctx = state.ctx;
	ctx.clearRect(0,0,state.W,state.H);
	for(let b of state.bullets){ctx.fillStyle='#ffd'; ctx.beginPath(); ctx.arc(b.x,b.y,3,0,Math.PI*2); ctx.fill()}
	for(let p of state.pickups){ctx.fillStyle='magenta'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.fillStyle='white'; ctx.fillRect(p.x-6,p.y-2,12,4); ctx.fillRect(p.x-2,p.y-6,4,12)}
	for(let eb of state.enemyBullets){ctx.fillStyle='orangered'; ctx.beginPath(); ctx.arc(eb.x, eb.y, eb.r, 0, Math.PI*2); ctx.fill()}
	for(let z of state.zombies){
		const hpRatio = Math.max(0,z.hp)/z.maxHp; let col;
		if(z.type === 'runner') col = `rgb(80,200,80)`;
		else if(z.type === 'brute') col = `rgb(180,60,60)`;
		else if(z.type === 'spitter') col = `rgb(150,100,180)`;
		else col = `rgb(${200-150*hpRatio},${60+100*hpRatio},60)`;
		ctx.fillStyle = col; ctx.beginPath(); ctx.arc(z.x,z.y,z.r,0,Math.PI*2); ctx.fill();
		ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(z.x-12,z.y-18,24,4); ctx.fillStyle='lime'; ctx.fillRect(z.x-12,z.y-18,24*hpRatio,4)
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
