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
import glasssfx from './assets/sound/sfx/glassshatter.wav';
import statdown from './assets/sound/sfx/statdown.wav';
import punch from './assets/sound/sfx/punch.mp3';
import explosion from './assets/sound/sfx/explosion.wav';
import bol from './assets/sound/sfx/BOL.wav';
import army from './assets/sound/sfx/army.mp3';
import sn from './assets/sound/sfx/SN.mp3';
import us from './assets/sound/sfx/US.wav';
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
    'statdown': statdown,
    'dice': dicesfx,
    'lightning': lightningsfx,
    'glass': glasssfx,
    'punch': punch,
    'explosion': explosion,
    'BOL': bol,
    'army': army,
    'sn': sn,
    'US': us,//unholy symphony
}