export function updateUI(state, getWeaponStats){
	const stats = getWeaponStats(state);
	state.dom.health.textContent = Math.max(0,Math.round(state.player.health));
	state.dom.armor.textContent = state.player.armor || 0;
	state.dom.money.textContent = state.money;
	state.dom.wDmg.textContent = stats.damage;
	state.dom.wFr.textContent = stats.fireRate.toFixed(1);
	state.dom.wSpd.textContent = stats.bulletSpeed.toFixed(1);
}

export function showPauseShop(state, onResume, updateUI, getWeaponStats){
	const overlay = document.getElementById('overlay');
	overlay.classList.remove('active');
	overlay.style.pointerEvents = 'auto';
	overlay.innerHTML = `
		<div class="panel" style="min-width:320px;pointer-events:auto;text-align:left">
			<div class="big">PAUSED</div>
			<div style="margin:8px 0">Money: $${state.money}</div>
			<div class="shop-item"><div>Armor (1 charge)</div><div><button id="pause-buy-armor" class="btn">Cost $45</button></div></div>
			<div class="shop-item"><div>Medkit (+30 health)</div><div><button id="pause-buy-medkit" class="btn">Cost $40</button></div></div>
			<div class="shop-item"><div>High-Power Rifle (+8 damage)</div><div><button id="pause-buy-rifle" class="btn">Cost $120</button></div></div>
			<div class="shop-item"><div>Overclock Module (+2 fire rate)</div><div><button id="pause-buy-overclock" class="btn">Cost $95</button></div></div>
			<div class="shop-item"><div>Damage Boost (+2)</div><div><button id="pause-buy-dmg" class="btn">Cost $50</button></div></div>
			<div class="shop-item"><div>Move Speed Boost</div><div><button id="pause-buy-movespd" class="btn">Cost $40</button></div></div>
			<div style="margin-top:10px"><button id="resume-game" class="btn">Resume Game (P)</button></div>
		</div>`;

	document.getElementById('pause-buy-armor').addEventListener('click', ()=>{
		const cost = 45; if(state.money>=cost){ state.money -= cost; state.player.armor = (state.player.armor||0) + 1; updateUI(state, getWeaponStats); }
	});
	document.getElementById('pause-buy-medkit').addEventListener('click', ()=>{
		const cost = 40; if(state.money>=cost){ state.money -= cost; state.player.health = Math.min(state.player.maxHealth, state.player.health + 30); updateUI(state, getWeaponStats); }
	});
	document.getElementById('pause-buy-rifle').addEventListener('click', ()=>{
		const cost = 120; if(state.money>=cost){ state.money -= cost; state.weapon.damage += 8; updateUI(state, getWeaponStats); }
	});
	document.getElementById('pause-buy-overclock').addEventListener('click', ()=>{
		const cost = 95; if(state.money>=cost){ state.money -= cost; state.weapon.fireRate = Math.min(10, state.weapon.fireRate + 2); updateUI(state, getWeaponStats); }
	});
	document.getElementById('pause-buy-dmg').addEventListener('click', ()=>{
		const cost = 50; if(state.money>=cost){ state.money -= cost; state.weapon.damage += 2; updateUI(state, getWeaponStats); }
	});
	document.getElementById('pause-buy-movespd').addEventListener('click', ()=>{
		const cost = 40; if(state.money>=cost){ state.money -= cost; state.player.spd = Math.min(3.2, state.player.spd + 0.2); updateUI(state, getWeaponStats); }
	});

	document.getElementById('resume-game').addEventListener('click', ()=>{
		overlay.innerHTML = '';
		overlay.style.pointerEvents = 'none';
		state.isPaused = false;
		onResume();
	});
}

export function showPostWaveShop(state, onStartNextWave, updateUI, getWeaponStats){
	const overlay = document.getElementById('overlay');
	overlay.classList.remove('active');
	overlay.style.pointerEvents = 'auto';
	overlay.innerHTML = `
		<div class="panel" style="min-width:320px;pointer-events:auto;text-align:left">
			<div class="big">Wave ${state.wave} Cleared</div>
			<div style="margin:8px 0">Money: $${state.money}</div>
			<div class="shop-item"><div>Armor (1 charge)</div><div><button id="post-buy-armor" class="btn">Cost $45</button></div></div>
			<div class="shop-item"><div>Medkit (+30 health)</div><div><button id="post-buy-medkit" class="btn">Cost $40</button></div></div>
			<div class="shop-item"><div>High-Power Rifle (+8 damage)</div><div><button id="post-buy-rifle" class="btn">Cost $120</button></div></div>
			<div class="shop-item"><div>Overclock Module (+2 fire rate)</div><div><button id="post-buy-overclock" class="btn">Cost $95</button></div></div>
			<div style="margin-top:10px"><button id="start-next-wave" class="btn">Start Next Wave</button></div>
		</div>`;

	document.getElementById('post-buy-armor').addEventListener('click', ()=>{
		const cost = 45; if(state.money>=cost){ state.money -= cost; state.player.armor = (state.player.armor||0) + 1; updateUI(state, getWeaponStats); }
	});
	document.getElementById('post-buy-medkit').addEventListener('click', ()=>{
		const cost = 40; if(state.money>=cost){ state.money -= cost; state.player.health = Math.min(state.player.maxHealth, state.player.health + 30); updateUI(state, getWeaponStats); }
	});
	document.getElementById('post-buy-rifle').addEventListener('click', ()=>{
		const cost = 120; if(state.money>=cost){ state.money -= cost; state.weapon.damage += 8; updateUI(state, getWeaponStats); }
	});
	document.getElementById('post-buy-overclock').addEventListener('click', ()=>{
		const cost = 95; if(state.money>=cost){ state.money -= cost; state.weapon.fireRate = Math.min(10, state.weapon.fireRate + 2); updateUI(state, getWeaponStats); }
	});

	document.getElementById('start-next-wave').addEventListener('click', ()=>{
		overlay.innerHTML = '';
		overlay.style.pointerEvents = 'none';
		state.inBetween = false;
		onStartNextWave();
	});
}

export function showDeathScreen(state, onRestart){
	const overlay = document.getElementById('overlay');
	overlay.classList.add('active');
	overlay.style.pointerEvents = 'auto';
	overlay.innerHTML = `
		<div id="deathScreen" class="pulse">
			<div id="deathTitle">You Died</div>
			<div id="deathSub">The horde overwhelmed you.</div>
			<div id="deathStats">
				<div>Kills</div><div>${state.kills}</div>
				<div>Wave</div><div>${state.wave}</div>
				<div>Money</div><div>$${state.money}</div>
			</div>
			<div>
				<button id="restart" class="btn">Restart</button>
			</div>
		</div>`;
	document.getElementById('restart').addEventListener('click', onRestart);
}
