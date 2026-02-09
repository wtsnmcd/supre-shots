export function setupZombieEditor(state, dom){
	const panel = document.createElement('div');
	panel.className = 'panel';
	panel.innerHTML = `
		<div class="big">Zombie Editor</div>
		<div class="shop-item">
			<div>Custom Colors</div>
			<div><input id="zombie-colors-toggle" type="checkbox"></div>
		</div>
		<div class="shop-item">
			<div>Walker Color</div>
			<div><input id="zombie-walker-color" type="color" value="#c83c3c" style="width:50px;height:30px;cursor:pointer;border:none"></div>
		</div>
		<div class="shop-item">
			<div>Runner Color</div>
			<div><input id="zombie-runner-color" type="color" value="#104b10" style="width:50px;height:30px;cursor:pointer;border:none"></div>
		</div>
		<div class="shop-item">
			<div>Brute Color</div>
			<div><input id="zombie-brute-color" type="color" value="#410b0b" style="width:50px;height:30px;cursor:pointer;border:none"></div>
		</div>
		<div class="shop-item">
			<div>Spitter Color</div>
			<div><input id="zombie-spitter-color" type="color" value="#d0ff00" style="width:50px;height:30px;cursor:pointer;border:none"></div>
		</div>
		<div class="shop-item">
			<div>Size: <span id="size-display">1.0x</span></div>
			<div><input id="zombie-size" type="range" min="0.5" max="2" step="0.1" value="1" style="width:80px"></div>
		</div>
		<div class="shop-item">
			<button id="reset-zombie-editor" class="btn">Reset to Default</button>
		</div>
	`;
	
	const uiPanel = document.getElementById('ui');
	uiPanel.insertBefore(panel, uiPanel.children[2]);
	
	const toggle = document.getElementById('zombie-colors-toggle');
	const walkerInput = document.getElementById('zombie-walker-color');
	const runnerInput = document.getElementById('zombie-runner-color');
	const bruteInput = document.getElementById('zombie-brute-color');
	const spitterInput = document.getElementById('zombie-spitter-color');
	const sizeSlider = document.getElementById('zombie-size');
	const sizeDisplay = document.getElementById('size-display');
	const resetBtn = document.getElementById('reset-zombie-editor');
	
	toggle.addEventListener('change', (e)=>{
		state.zombieAppearance.useCustomColors = e.target.checked;
		walkerInput.disabled = !e.target.checked;
		runnerInput.disabled = !e.target.checked;
		bruteInput.disabled = !e.target.checked;
		spitterInput.disabled = !e.target.checked;
	});
	
	walkerInput.addEventListener('input', (e)=>{
		state.zombieAppearance.walkerColor = e.target.value;
	});
	runnerInput.addEventListener('input', (e)=>{
		state.zombieAppearance.runnerColor = e.target.value;
	});
	bruteInput.addEventListener('input', (e)=>{
		state.zombieAppearance.bruteColor = e.target.value;
	});
	spitterInput.addEventListener('input', (e)=>{
		state.zombieAppearance.spitterColor = e.target.value;
	});
	
	sizeSlider.addEventListener('input', (e)=>{
		state.zombieAppearance.sizeMultiplier = parseFloat(e.target.value);
		sizeDisplay.textContent = state.zombieAppearance.sizeMultiplier.toFixed(1) + 'x';
	});
	
	resetBtn.addEventListener('click', ()=>{
		state.zombieAppearance.useCustomColors = false;
		state.zombieAppearance.walkerColor = '#022c09';
		state.zombieAppearance.runnerColor = '#50c850';
		state.zombieAppearance.bruteColor = '#b43c3c';
		state.zombieAppearance.spitterColor = '#9664b4';
		state.zombieAppearance.sizeMultiplier = 1.0;
		toggle.checked = false;
		walkerInput.value = '#c83c3c';
		runnerInput.value = '#50c850';
		bruteInput.value = '#b43c3c';
		spitterInput.value = '#9664b4';
		sizeSlider.value = 1;
		sizeDisplay.textContent = '1.0x';
		walkerInput.disabled = true;
		runnerInput.disabled = true;
		bruteInput.disabled = true;
		spitterInput.disabled = true;
	});
	
	walkerInput.disabled = true;
	runnerInput.disabled = true;
	bruteInput.disabled = true;
	spitterInput.disabled = true;
}
