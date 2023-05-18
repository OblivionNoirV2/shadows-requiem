import clicksfx from './assets/sound/sfx/selectclick.wav';

export function playClickSfx() {
    const click = new Audio(clicksfx);
    click.play();
    click.volume = 0.5;

}