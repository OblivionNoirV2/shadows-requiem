import React, { useState } from 'react';
import * as sm from './StatManagement';
//shared among all 4, works similarly to spells


//All the healing functions will work similarly, so use a template like 
//we did with RNG for player attacks

//We can't use state here but the hp/mp states are already linked to 
//the respective maps
export const item_functions: Map<string, Function> = new Map(
    [
        ["Minor HP Potion", function MinorHpPotion(target: string) {
            alert("working!")
            sm.knight_stats.set("hp", sm.knight_stats.get("hp")! - 100);
            sm.rmage_stats.set("hp", sm.rmage_stats.get("hp")! + 100);


        }
        ],
        [
            "Major HP Potion", function MajorHpPotion(target: string) {

            }
        ],
        [
            "Minor MP Potion", function MinorMpPotion(target: string) {

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
}
export const player_inventory: Map<string, InventoryItem> = new Map(
    [
        [
            "Minor HP Potion", {
                description: "Restores 1/3 of a character's max HP.",
                stock: 5,
            }
        ],
        [
            "Major HP Potion", {
                description: "Restores 2/3 of a character's max HP.",
                stock: 5
            }
        ],
        [
            "Minor MP Potion", {
                description: "Restores 1/3 of a character's max MP.",
                stock: 10
            }
        ],
        [
            "Major MP Potion", {
                description: "Restores 2/3 of a character's max MP.",
                stock: 5
            }
        ],
        [
            "Minor Revive", {
                description: "Revives a dead character with 1/3 of their max HP.",
                stock: 4
            }
        ],
        [
            "Major Revive", {
                description: "Revives a dead character with 2/3 of their max HP.",
                stock: 2
            }
        ],
        [
            "De-toxin", {
                description: "Cures poison for one character.",
                stock: 5
            }
        ],
        [
            "De-frost", {
                description: "Cures freeze for one character.",
                stock: 5
            }
        ],
        [
            "Purifier", {
                description: "Cures Curse for one character.",
                stock: 5
            }
        ],
        [
            "Magic Leaf", {
                description: "Removes all status effects from one character.",
                stock: 3
            }
        ]
    ]
);

