import React, { useState } from 'react';

//shared among all 4, works similarly to spells


export const player_inventory: Map<string, object> = new Map(
    [
        [
            "Minor HP Potion", {
                description: "Restores 1/3 of a character's max HP.",
                stock: 5
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

