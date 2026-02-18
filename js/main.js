import {createState, resetForRestart} from './state.js';
import {setupInput} from './input.js';
import {getWeaponStats, setMode, cycleMode, updateModeLabel, shoot} from './weapons.js';
import {spawnWave, spawnMiniboss, updateBullets, updateZombies, handleBulletHits, updatePickups, updateEnemyBullets, updateMiniboss, checkWaveEnd} from './entities.js';
import {updateUI, showPostWaveShop, showDeathScreen, showPauseShop} from './ui.js';
import {draw} from './draw.js';
import {setupEditors} from './editor/index.js';
import {loadSprites, getZombieSprite, getBossSprite, getEnemyBulletSprite, getRunnerSprite, getSpitterSprite, getTankSprite} from './sprites.js';

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

const dom = {
	health: document.getElementById('health'),
	armor: document.getElementById('armor'),
	money: document.getElementById('money'),
	kills: document.getElementById('kills'),
	wave: document.getElementById('wave'),
	wDmg: document.getElementById('w-dmg'),
	wFr: document.getElementById('w-fr'),
	wSpd: document.getElementById('w-spd'),
	buyDmg: document.getElementById('buy-dmg'),
	buyFr: document.getElementById('buy-fr'),
	buySpd: document.getElementById('buy-spd'),
	buyHp: document.getElementById('buy-hp'),
	buyMove: document.getElementById('buy-move'),
	buyArmor: document.getElementById('buy-armor'),
	buyShotgun: document.getElementById('buy-shotgun'),
	buySmg: document.getElementById('buy-smg'),
	buyBurst: document.getElementById('buy-burst'),
	buySniper: document.getElementById('buy-sniper'),
	shootMode: document.getElementById('shootMode'),
	pauseBtn: document.getElementById('pause-btn')
};

const state = createState(canvas, ctx, dom);
state.input = setupInput(canvas, state.W, state.H);
setupEditors(state, dom);

function onMinibossDefeated(){
	state.inBetween = true;
	showPostWaveShop(state, startNextWave, updateUI, getWeaponStats);
}

function update(dt){
	if(state.input.pause && !state.inBetween && !state.isDead){
		state.input.pause = false;
		if(state.isPaused){
			state.isPaused = false;
			const overlay = document.getElementById('overlay');
			overlay.innerHTML = '';
			overlay.style.pointerEvents = 'none';
		} else {
			state.isPaused = true;
			showPauseShop(state, () => {}, updateUI, getWeaponStats);
		}
		return;
	}

	const speed = state.player.spd;
	if(state.input.left) state.player.x -= speed;
	if(state.input.right) state.player.x += speed;
	if(state.input.up) state.player.y -= speed;
	if(state.input.down) state.player.y += speed;
	state.player.x = Math.max(10,Math.min(state.W-10,state.player.x));
	state.player.y = Math.max(10,Math.min(state.H-10,state.player.y));

	if(state.inBetween || state.isDead || state.isPaused) return;

	const angle = Math.atan2(state.input.mouseY - state.player.y, state.input.mouseX - state.player.x);
	if(state.input.shoot) shoot(state, angle);

	updateBullets(state);
	const now = performance.now();
	updateZombies(state, now);
	handleBulletHits(state, onMinibossDefeated);
	updatePickups(state, dt);
	updateEnemyBullets(state);
	updateMiniboss(state, now, onMinibossDefeated);
	checkWaveEnd(state, dt, () => spawnMiniboss(state));

	if(state.player.health<=0){
		handleDeath();
		return;
	}

	updateUI(state, getWeaponStats);
}

function loop(t){
	const dt = t - state.lastFrame; state.lastFrame = t; if(!state.isPaused) update(dt); draw(state); state.frameId = requestAnimationFrame(loop);
}

function handleDeath(){
	if(state.isDead) return;
	state.isDead = true;
	cancelAnimationFrame(state.frameId);
	showDeathScreen(state, restart);
}

function restart(){
	resetForRestart(state);
	const overlay = document.getElementById('overlay');
	overlay.innerHTML='';
	overlay.style.pointerEvents = 'none';
	overlay.classList.remove('active');
	state.dom.kills.textContent=0; state.dom.wave.textContent=0;
	updateUI(state, getWeaponStats);
	spawnWave(state);
	state.lastFrame = performance.now();
	state.frameId = requestAnimationFrame(loop);
}

function startNextWave(){
	spawnWave(state);
}

state.dom.buyDmg.addEventListener('click',()=>{const cost=10; if(state.money>=cost){state.money-=cost;state.weapon.damage+=2; updateUI(state, getWeaponStats);}});
state.dom.buyFr.addEventListener('click',()=>{const cost=15; if(state.money>=cost){state.money-=cost;state.weapon.fireRate = Math.min(10, state.weapon.fireRate + 0.5); updateUI(state, getWeaponStats);}});
state.dom.buySpd.addEventListener('click',()=>{const cost=12; if(state.money>=cost){state.money-=cost;state.weapon.bulletSpeed = Math.min(14, state.weapon.bulletSpeed + 1.5); updateUI(state, getWeaponStats);}});
state.dom.buyHp.addEventListener('click',()=>{const cost=20; if(state.money>=cost){state.money-=cost;state.player.maxHealth += 10; state.player.health += 10; updateUI(state, getWeaponStats);}});
state.dom.buyMove.addEventListener('click',()=>{const cost=18; if(state.money>=cost){state.money-=cost;state.player.spd = Math.min(3.2, state.player.spd + 0.2); updateUI(state, getWeaponStats);}});
state.dom.buyArmor.addEventListener('click',()=>{const cost=35; if(state.money>=cost){state.money-=cost;state.player.armor = (state.player.armor||0) + 1; updateUI(state, getWeaponStats);}});
state.dom.buyShotgun.addEventListener('click',()=>{const cost=60; if(state.money>=cost && !state.weapon.unlocked.shotgun){state.money-=cost;state.weapon.unlocked.shotgun=true; setMode(state, 'shotgun'); updateUI(state, getWeaponStats);}});
state.dom.buySmg.addEventListener('click',()=>{const cost=75; if(state.money>=cost && !state.weapon.unlocked.smg){state.money-=cost;state.weapon.unlocked.smg=true; setMode(state, 'smg'); updateUI(state, getWeaponStats);}});
state.dom.buyBurst.addEventListener('click',()=>{const cost=90; if(state.money>=cost && !state.weapon.unlocked.burst){state.money-=cost;state.weapon.unlocked.burst=true; setMode(state, 'burst'); updateUI(state, getWeaponStats);}});
state.dom.buySniper.addEventListener('click',()=>{const cost=110; if(state.money>=cost && !state.weapon.unlocked.sniper){state.money-=cost;state.weapon.unlocked.sniper=true; setMode(state, 'sniper'); updateUI(state, getWeaponStats);}});
state.dom.shootMode.addEventListener('click',()=>{cycleMode(state); updateUI(state, getWeaponStats);});
state.dom.pauseBtn.addEventListener('click',()=>{if(!state.inBetween && !state.isDead && !state.isPaused){state.isPaused = true; showPauseShop(state, () => {}, updateUI, getWeaponStats);}});

// Load sprites and start game
loadSprites().then(() => {
	state.zombieSprite = getZombieSprite();
	state.bossSprite = getBossSprite();
	state.enemyBulletSprite = getEnemyBulletSprite();
	state.runnerSprite = getRunnerSprite();
	state.spitterSprite = getSpitterSprite();
	state.tankSprite = getTankSprite();
	updateModeLabel(state);
	updateUI(state, getWeaponStats);
	spawnWave(state);
	state.frameId = requestAnimationFrame(loop);
});
