import React, { useState } from 'react';
import * as sm from './StatManagement';
//shared among all 4, works similarly to spells


//All the healing functions will work similarly, so use a template like 
//we did with RNG for player attacks

//We can't use state here but the hp/mp states are already linked to 
//the respective maps
//gonna wanna use this for heal spells too
export const TargetToStat: Map<string, Map<string, number>> = new Map(
    [
        ["knight", sm.knight_stats],
        ["dmage", sm.dmage_stats],
        ["wmage", sm.wmage_stats],
        ["rmage", sm.rmage_stats],
    ]
)
//for standard healing items and spells, restores hp
//Everything works in percentages
//If it's a full heal, just set the hp to the max hp

//for both hp and mp, since which one is determined on the main page

/*export const item_functions: Map<string, Function> = new Map(
    [
        [
            "Minor HP Potion", function MinorHpPotion(target: string): number {

                return TargetToStat.get(target)!.get("max_hp")! * 0.33;
            }
        ],
        [
            "Major HP Potion", function MajorHpPotion(target: string): number {
                return TargetToStat.get(target)!.get("max_hp")! * 0.66;

            }
        ],
        [
            "Minor MP Potion", function MinorMpPotion(target: string): number {
                return TargetToStat.get(target)!.get("max_mp")! * 0.33;

            }
        ],
        [
            "Major MP Potion", function MajorMpPotion(target: string): number {
                return TargetToStat.get(target)!.get("max_mp")! * 0.66;

            }
        ],
        [
            "Minor Revive", function MinorRevive(target: string): object {
                return {
                    "heal_amt": TargetToStat.get(target)!.get("max_hp")! * 0.33,
                    item_type: "revive"

                }

            }
        ],
        [
            "Major Revive", function MajorRevive(target: string): object {
                return {
                    "heal_amt": TargetToStat.get(target)!.get("max_hp")! * 0.66,
                    item_type: "revive"

                }

            }
        ],
        [
            "De-toxin", function DeToxin(): string {
                return "de-toxin"

            }
        ],
        [
            "De-frost", function DeFrost(target: string): string {
                return "de-frost"

            }
        ],
        [
            "Purifier", function Purifier(target: string): string {
                return "de-curse"

            }
        ],
        [
            "Magic Leaf", function MagicLeaf(target: string) {


            }
        ]
    ]
)*/

//use this instead of the above for the actual item use
interface InventoryItem {
    description: string;
    stock: number;
    type: string;//what it does
    amount?: number;//how much it does, as a decimal in 
    //comparison to the max hp/mp
}
export const player_inventory: Map<string, InventoryItem> = new Map(
    [
        [
            "Minor HP Potion", {
                description: "Restores 1/3 of a character's max HP.",
                stock: 5,
                type: "hp",
                amount: .33
            }
        ],
        [
            "Major HP Potion", {
                description: "Restores 2/3 of a character's max HP.",
                stock: 5,
                type: "hp",
                amount: .66
            }
        ],
        [
            "Minor MP Potion", {
                description: "Restores 1/3 of a character's max MP.",
                stock: 10,
                type: "mp",
                amount: .33
            }
        ],
        [
            "Major MP Potion", {
                description: "Restores 2/3 of a character's max MP.",
                stock: 5,
                type: "mp",
                amount: .66
            }
        ],
        [
            "Minor Revive", {
                description: "Revives a dead character with 1/3 of their max HP.",
                stock: 4,
                type: "revive",
                amount: .33//revives with 33% of max hp
            }
        ],
        [
            "Major Revive", {
                description: "Revives a dead character with 2/3 of their max HP.",
                stock: 2,
                type: "revive",
                amount: .66//revives with 66% of max hp

            }
        ],
        [
            "De-toxin", {
                description: "Cures Poison for one character.",
                stock: 5,
                type: "de-toxin"
            }
        ],
        [
            "De-frost", {
                description: "Cures Freeze for one character.",
                stock: 5,
                type: "de-frost"
            }
        ],
        [
            "Purifier", {
                description: "Cures Curse for one character.",
                stock: 5,
                type: "de-curse"
            }
        ],
        [
            "Magic Leaf", {
                description: "Removes all status effects (aside from Death) from one character.",
                stock: 3,
                type: "status-all"
            }
        ]
    ]
);

