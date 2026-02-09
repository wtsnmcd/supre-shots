// Zombie sprite from Piskel - Base64 PNG data
const ZOMBIE_SPRITE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACWElEQVR4AexWPU8CQRCd8wNt/CgsNAFqY8IvkGhng3ZW8C+saO2obK0spbIz/ACjJtZijA2FhMJEEqMW8iXrvI0QuISYi95cvB2yszszbNh7b94sN0WOf5QAxwVAqgBVgOMMaAs4LgC9BLUFtAUcZ0BbwHEB6L+Acy3gV7wS4GfEtVgV4FrF/XhVAX5GXItVAa5V3I9XFeBnxLVYFeBaxf14pRVg+AGG1j2rm+5JDTGnoxmSBJhbxriyPUvJwhyt7iVodj9NvasmdY4eIiNCigDzyOB3GPTMokfv95+ElVM0nVki89ql9nENobhJEGBQ7U2u+stNzwJc2JimVqNv/cTBOs0dZiiRT9v4r6effk+CAPsMjdM2tZ/79HTeIfjNi67Nox1gIMImhKewCTAAB9BmiaWezRJWYDQ8mVzOksHuYCA98EXWsAmwIEBCardFVK0SVhtzS1ClYi9DtAZydrPwFDoB1yx9YOq9GVrb+iCsiGEpkMAO7oTRPKfERugE4PIbgEMrwHAHIIeLEP8GAxNDPXJQ2AR4AIvzABwrmhyGGBchSLhjlXzv87BH0sImYAwLgFM+T1Qs0uXYN9EFEgR4qDbeBVBer1wmr1QaIp5PTtEy2Q++to7kJEEA8FgSoAAQgdfhOmfhRyV9Pt4OKQJwmIcSQw3o/QJn4POCNC/RDEkCgBBg/YZ8ZCZNQGRAJx2sBExixpW8KiBulQ6KRxUQlLG47VcFxK2iQfGoAoIyFrf9qoC4VTQoHlVAUMbitl8VELeKBsWjCgjKWNz2qwL+e0V/+/xfAAAA//9hP/9LAAAABklEQVQDAB0qoIEVcyhFAAAAAElFTkSuQmCC';

let zombieSprite = null;

export function loadSprites(){
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			zombieSprite = img;
			resolve();
		};
		img.src = ZOMBIE_SPRITE_DATA;
	});
}

export function getZombieSprite(){
	return zombieSprite;
}
