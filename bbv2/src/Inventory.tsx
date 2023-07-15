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

function Heal(target: string, amount: number) {

    TargetToStat.get(target)!.set(
        "hp", TargetToStat.get(target)!.get("hp")! + amount);
}

function HealMP(target: string, amount: number) {
    console.log("target", target)
    console.log("amount", amount)
    TargetToStat.get(target)!.set(
        "mp", TargetToStat.get(target)!.get("mp")! + amount);

}
export const item_functions: Map<string, Function> = new Map(
    [
        [
            "Minor HP Potion", function MinorHpPotion(target: string) {

                //Heal(target, TargetToStat.get(target)!.get("max_hp")! * 0.33);
                return 100;//temp test
            }
        ],
        [
            "Major HP Potion", function MajorHpPotion(target: string) {

            }
        ],
        [
            "Minor MP Potion", function MinorMpPotion(target: string) {
                HealMP(target, TargetToStat.get(target)!.get("max_mp")! * 0.33);

            }
        ],
        [
            "Major MP Potion", function MajorMpPotion(target: string) {

            }
        ],
        [
            "Minor Revive", function MinorRevive(target: string) {

            }
        ],
        [
            "Major Revive", function MajorRevive(target: string) {

            }
        ],
        [
            "De-toxin", function DeToxin(target: string) {

            }
        ],
        [
            "De-frost", function DeFrost(target: string) {

            }
        ],
        [
            "Purifier", function Purifier(target: string) {

            }
        ],
        [
            "Magic Leaf", function MagicLeaf(target: string) {

            }
        ]
    ]
)

interface InventoryItem {
    description: string;
    stock: number;
    type: string;//what it does
}
export const player_inventory: Map<string, InventoryItem> = new Map(
    [
        [
            "Minor HP Potion", {
                description: "Restores 1/3 of a character's max HP.",
                stock: 5,
                type: "hp"
            }
        ],
        [
            "Major HP Potion", {
                description: "Restores 2/3 of a character's max HP.",
                stock: 5,
                type: "hp"
            }
        ],
        [
            "Minor MP Potion", {
                description: "Restores 1/3 of a character's max MP.",
                stock: 10,
                type: "mp"
            }
        ],
        [
            "Major MP Potion", {
                description: "Restores 2/3 of a character's max MP.",
                stock: 5,
                type: "mp"
            }
        ],
        [
            "Minor Revive", {
                description: "Revives a dead character with 1/3 of their max HP.",
                stock: 4,
                type: "min revive"
            }
        ],
        [
            "Major Revive", {
                description: "Revives a dead character with 2/3 of their max HP.",
                stock: 2,
                type: "maj revive"

            }
        ],
        [
            "De-toxin", {
                description: "Cures poison for one character.",
                stock: 5,
                type: "de-toxin"
            }
        ],
        [
            "De-frost", {
                description: "Cures freeze for one character.",
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
                description: "Removes all status effects from one character.",
                stock: 3,
                type: "status-all"
            }
        ]
    ]
);

