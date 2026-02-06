export function setupInput(canvas, W, H){
	const input = {left:false,right:false,up:false,down:false,mouseX:W/2,mouseY:H/2,shoot:false};

	window.addEventListener('keydown',e=>{
		if(e.key==='a'||e.key==='ArrowLeft')input.left=true;
		if(e.key==='d'||e.key==='ArrowRight')input.right=true;
		if(e.key==='w'||e.key==='ArrowUp')input.up=true;
		if(e.key==='s'||e.key==='ArrowDown')input.down=true;
	});
	window.addEventListener('keyup',e=>{
		if(e.key==='a'||e.key==='ArrowLeft')input.left=false;
		if(e.key==='d'||e.key==='ArrowRight')input.right=false;
		if(e.key==='w'||e.key==='ArrowUp')input.up=false;
		if(e.key==='s'||e.key==='ArrowDown')input.down=false;
	});
	canvas.addEventListener('mousemove',e=>{
		const r=canvas.getBoundingClientRect();
		input.mouseX = e.clientX - r.left;
		input.mouseY = e.clientY - r.top;
	});
	canvas.addEventListener('mousedown',e=>{if(e.button===0)input.shoot=true});
	window.addEventListener('mouseup',e=>{if(e.button===0)input.shoot=false});

	return input;
}
