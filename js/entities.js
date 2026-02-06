function rand(min,max){return Math.random()*(max-min)+min}

export function spawnWave(state){
	state.wave++;
	state.dom.wave.textContent = state.wave;
	const count = 6 + Math.floor(state.wave*1.6);
	for(let i=0;i<count;i++){
		spawnZombie(state);
	}
}

export function spawnZombie(state){
	let side=Math.floor(Math.random()*4);let x,y;
	if(side===0){x=-30;y=rand(0,state.H)} else if(side===1){x=state.W+30;y=rand(0,state.H)} else if(side===2){x=rand(0,state.W);y=-30} else {x=rand(0,state.W);y=state.H+30}

	const bruteChance = Math.min(0.22, state.wave * 0.03);
	const runnerChance = Math.min(0.45, 0.18 + state.wave * 0.04);
	const spitterChance = Math.min(0.28, 0.05 + state.wave * 0.02);
	const r = Math.random();
	let type = 'walker';
	if(r < bruteChance) type = 'brute';
	else if(r < bruteChance + runnerChance) type = 'runner';
	else if(r < bruteChance + runnerChance + spitterChance) type = 'spitter';

	const baseSpd = 0.4 + rand(0,0.8) + state.wave*0.05;
	const baseHp = 12 + Math.floor(state.wave*5) + Math.floor(rand(0,10));

	if(type === 'runner'){
		state.zombies.push({x,y,spd: baseSpd + 0.9, r:9, hp: Math.max(5, Math.floor(baseHp*0.6)), maxHp: Math.max(5, Math.floor(baseHp*0.6)), type});
	} else if(type === 'brute'){
		state.zombies.push({x,y,spd: Math.max(0.12, baseSpd - 0.15), r:18, hp: Math.floor(baseHp*2.0), maxHp: Math.floor(baseHp*2.0), type});
	} else if(type === 'spitter'){
		state.zombies.push({x,y,spd: Math.max(0.08, baseSpd - 0.2), r:14, hp: Math.floor(baseHp*1.2), maxHp: Math.floor(baseHp*1.2), type, shootInterval: 1000 + Math.random()*1200, lastShot: 0});
	} else {
		state.zombies.push({x,y,spd: baseSpd, r:12, hp: baseHp, maxHp: baseHp, type});
	}
}

export function spawnMiniboss(state){
	const x = state.W/2 + (Math.random()-0.5)*200;
	const y = 60 + Math.random()*80;
	const hp = 120 + Math.floor(state.wave * 60);
	state.miniboss = {x,y,spd:0.8 + Math.min(1.6, state.wave*0.04), r:40, hp:hp, maxHp:hp, type:'miniboss', lastShot:0, shootInterval:700};
}

export function updateBullets(state){
	for(let b of state.bullets){b.x += b.dx; b.y += b.dy}
	state.bullets = state.bullets.filter(b=>b.x>-50 && b.x<state.W+50 && b.y>-50 && b.y<state.H+50);
}

export function updateZombies(state, now){
	for(let z of state.zombies){
		const dx=state.player.x-z.x;const dy=state.player.y-z.y;const ang=Math.atan2(dy,dx);
		z.x += Math.cos(ang)*z.spd; z.y += Math.sin(ang)*z.spd;
		if(Math.hypot(z.x-state.player.x,z.y-state.player.y) < z.r + state.player.r){
			if(state.player.armor && state.player.armor > 0){ state.player.armor--; }
			else { state.player.health = 0; }
			z.hp = -999;
		}

		if(z.type === 'spitter'){
			if(!z.lastShot) z.lastShot = now;
			if(now - z.lastShot > (z.shootInterval || 1200)){
				z.lastShot = now;
				z.shootInterval = 700 + Math.random()*1200;
				const a = Math.atan2(state.player.y - z.y, state.player.x - z.x);
				const spd = 5 + Math.min(5, state.wave*0.25);
				state.enemyBullets.push({x: z.x + Math.cos(a)*(z.r+6), y: z.y + Math.sin(a)*(z.r+6), dx: Math.cos(a)*spd, dy: Math.sin(a)*spd, r:5});
			}
		}
	}
}

export function handleBulletHits(state, onMinibossDefeated){
	for(let b of state.bullets){
		for(let z of state.zombies){
			if(z.hp>0 && Math.hypot(b.x - z.x, b.y - z.y) < z.r+3){
				z.hp -= b.damage; b._hit=true; if(z.hp<=0){
					let reward = 3 + Math.floor(state.wave*0.9);
					if(z.type === 'runner') reward = Math.max(4, reward + 1);
					if(z.type === 'brute') reward = Math.max(10, reward + 8);
					state.money += reward;
					state.kills++;
					if(!z._dropped){
						const dropChance = z.type === 'brute' ? 0.6 : (z.type === 'runner' ? 0.35 : 0.45);
						if(Math.random() < dropChance){
							state.pickups.push({x:z.x, y:z.y, r:10 + (z.type==='brute'?4:0), heal: z.type==='brute'?30:10, ttl:8000});
						}
						z._dropped = true;
					}
				}
			}
		}
	}

	if(state.miniboss){
		for(let b2 of state.bullets){
			if(!b2._hit && Math.hypot(b2.x - state.miniboss.x, b2.y - state.miniboss.y) < state.miniboss.r + 4){
				state.miniboss.hp -= b2.damage;
				b2._hit = true;
				if(state.miniboss.hp <= 0){
					state.money += 50 + Math.floor(state.wave*20);
					state.kills += 1;
					state.miniboss = null;
					onMinibossDefeated();
					break;
				}
			}
		}
	}

	state.bullets = state.bullets.filter(b=>!b._hit);
	state.zombies = state.zombies.filter(z=>z.hp>0);
}

export function updatePickups(state, dt){
	for(let p of state.pickups){
		p.ttl -= dt;
		if(Math.hypot(p.x - state.player.x, p.y - state.player.y) < p.r + state.player.r){
			state.player.health = Math.min(state.player.maxHealth, state.player.health + p.heal);
			p._collected = true;
		}
	}
	state.pickups = state.pickups.filter(p => !p._collected && p.ttl > 0);
}

export function updateEnemyBullets(state){
	for(let eb of state.enemyBullets){
		eb.x += eb.dx; eb.y += eb.dy;
		if(Math.hypot(eb.x - state.player.x, eb.y - state.player.y) < eb.r + state.player.r){
			if(state.player.armor && state.player.armor>0){ state.player.armor--; }
			else { state.player.health = 0; }
			eb._hit = true;
		}
	}
	state.enemyBullets = state.enemyBullets.filter(eb => !eb._hit && eb.x > -50 && eb.x < state.W+50 && eb.y > -50 && eb.y < state.H+50);
}

export function updateMiniboss(state, now, onMinibossDefeated){
	if(!state.miniboss) return;
	const dxm = state.player.x - state.miniboss.x; const dym = state.player.y - state.miniboss.y; const angm = Math.atan2(dym, dxm);
	state.miniboss.x += Math.cos(angm) * state.miniboss.spd;
	state.miniboss.y += Math.sin(angm) * state.miniboss.spd;
	if(!state.miniboss.lastShot) state.miniboss.lastShot = now;
	if(now - state.miniboss.lastShot > (state.miniboss.shootInterval || 900)){
		state.miniboss.lastShot = now;
		state.miniboss.shootInterval = 700 + Math.random()*1000;
		const a = Math.atan2(state.player.y - state.miniboss.y, state.player.x - state.miniboss.x);
		const spd = 6 + Math.min(6, state.wave*0.3);
		state.enemyBullets.push({x: state.miniboss.x + Math.cos(a)*(state.miniboss.r+8), y: state.miniboss.y + Math.sin(a)*(state.miniboss.r+8), dx: Math.cos(a)*spd, dy: Math.sin(a)*spd, r:7});
	}
	if(Math.hypot(state.miniboss.x-state.player.x,state.miniboss.y-state.player.y) < state.miniboss.r + state.player.r){
		if(state.player.armor && state.player.armor > 0){ state.player.armor--; }
		else { state.player.health = 0; }
		state.miniboss.hp = 0;
		state.miniboss = null;
		onMinibossDefeated();
	}
}

export function checkWaveEnd(state, dt, onSpawnMiniboss){
	if(state.zombies.length===0){
		state.spawnTimer += dt;
		if(state.spawnTimer>1000 && !state.inBetween && !state.miniboss){
			state.spawnTimer = 0;
			onSpawnMiniboss();
		}
	}
}
