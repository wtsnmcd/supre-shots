function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

const weaponProfiles = {
	single: {label:'Single', frMult:1.0, dmgMult:1.0, spdMult:1.0, pellets:1, spread:0.0},
	shotgun: {label:'Shotgun', frMult:0.65, dmgMult:0.6, spdMult:0.9, pellets:6, spread:0.30},
	smg: {label:'SMG', frMult:1.5, dmgMult:0.75, spdMult:1.0, pellets:1, spread:0.06},
	burst: {label:'Burst', frMult:0.9, dmgMult:0.85, spdMult:1.1, pellets:3, spread:0.10},
	sniper: {label:'Sniper', frMult:0.55, dmgMult:2.2, spdMult:1.4, pellets:1, spread:0.0}
};
const modeOrder = ['single','shotgun','smg','burst','sniper'];

export function getWeaponStats(state){
	const profile = weaponProfiles[state.weapon.mode] || weaponProfiles.single;
	const damage = Math.max(1, Math.round(state.weapon.damage * profile.dmgMult));
	const fireRate = clamp(state.weapon.fireRate * profile.frMult, 2, 14);
	const bulletSpeed = clamp(state.weapon.bulletSpeed * profile.spdMult, 4, 18);
	return {damage, fireRate, bulletSpeed, pellets: profile.pellets, spread: profile.spread, label: profile.label};
}

export function setMode(state, mode){
	if(!state.weapon.unlocked[mode]) return;
	state.weapon.mode = mode;
	updateModeLabel(state);
}

export function cycleMode(state){
	const available = modeOrder.filter(m => state.weapon.unlocked[m]);
	const idx = Math.max(0, available.indexOf(state.weapon.mode));
	const next = available[(idx + 1) % available.length] || 'single';
	setMode(state, next);
}

export function updateModeLabel(state){
	const stats = getWeaponStats(state);
	state.dom.shootMode.textContent = 'Switch Mode: ' + stats.label;
}

export function shoot(state, angle){
	const now = performance.now();
	const stats = getWeaponStats(state);
	const cooldown = 1000 / stats.fireRate;
	if(now - state.lastShot < cooldown) return;
	state.lastShot = now;
	const sx = state.player.x + Math.cos(angle)*(state.player.r+8);
	const sy = state.player.y + Math.sin(angle)*(state.player.r+8);
	if(stats.pellets === 1){
		state.bullets.push({x:sx,y:sy,dx:Math.cos(angle)*stats.bulletSpeed,dy:Math.sin(angle)*stats.bulletSpeed,damage:stats.damage});
		return;
	}
	const spread = stats.spread;
	const pellets = stats.pellets;
	for(let i=0;i<pellets;i++){
		const a = angle + (i-(pellets-1)/2)*(spread/pellets);
		state.bullets.push({x:sx,y:sy,dx:Math.cos(a)*stats.bulletSpeed,dy:Math.sin(a)*stats.bulletSpeed,damage:Math.max(1, Math.floor(stats.damage))});
	}
}
