export function createState(canvas, ctx, dom){
	const W = canvas.width;
	const H = canvas.height;
	return {
		canvas,
		ctx,
		W,
		H,
		dom,
		input: null,
		player: {x: W/2, y: H/2, spd: 2.0, r: 14, health: 80, maxHealth: 80, armor: 0},
		weapon: {
			damage: 6,
			fireRate: 4,
			bulletSpeed: 8,
			mode: 'single',
			unlocked: {single:true,shotgun:false,smg:false,burst:false,sniper:false}
		},
		zombieAppearance: {
			walkerColor: '#c83c3c',
			runnerColor: '#50c850',
			bruteColor: '#b43c3c',
			spitterColor: '#9664b4',
			useCustomColors: false,
			sizeMultiplier: 1.0
		},
		background: {
			scroll: 0,
			particles: []
		},
		isPaused: false,
		zombieSprite: null,
		bossSprite: null,
		enemyBulletSprite: null,
		runnerSprite: null,
		spitterSprite: null,
		bullets: [],
		zombies: [],
		pickups: [],
		enemyBullets: [],
		miniboss: null,
		money: 0,
		kills: 0,
		wave: 0,
		spawnTimer: 0,
		spawnInterval: 1500,
		inBetween: false,
		lastShot: 0,
		isDead: false,
		frameId: 0,
		lastFrame: performance.now()
	};
}

export function resetForRestart(state){
	state.player.x = state.W/2;
	state.player.y = state.H/2;
	state.player.health = state.player.maxHealth;
	state.money = 0;
	state.kills = 0;
	state.wave = 0;
	state.bullets = [];
	state.zombies = [];
	state.pickups = [];
	state.enemyBullets = [];
	state.miniboss = null;
	state.spawnTimer = 0;
	state.inBetween = false;
	state.isDead = false;
}
