import clicksfx from './assets/sound/sfx/selectclick.wav';
import misssfx from './assets/sound/sfx/misssfx.wav';
import swordslashsfx from './assets/sound/sfx/swordslash.mp3';
import magicsfx from './assets/sound/sfx/magic.wav';
import critsfx from './assets/sound/sfx/critsfx.wav';
import darkmagsfx from './assets/sound/sfx/darkmag.wav';
import healsfsx from './assets/sound/sfx/healsfx.wav';
import firesfx from './assets/sound/sfx/firespell.wav';
import statup from './assets/sound/sfx/statup.mp3';
import dicesfx from './assets/sound/sfx/dice.wav';
import lightningsfx from './assets/sound/sfx/lightning.mp3';
export function playClickSfx() {
    const click = new Audio(clicksfx);
    click.play();
    click.volume = 0.5;

}

export const AttackSfxLookup: { [name: string]: string } = {
    'sword': swordslashsfx,
    'miss': misssfx,
    'crit': critsfx,
    'darkmag': darkmagsfx,
    'heal': healsfsx,
    'fire': firesfx,
    'statup': statup,
    'dice': dicesfx,
    'lightning': lightningsfx


}