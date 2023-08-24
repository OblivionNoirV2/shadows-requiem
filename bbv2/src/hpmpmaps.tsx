import * as sm from './StatManagement'

export const MatchToMpMap: Map<string, number> = new Map
    (
        [
            ["knight", sm.knight_stats.get("mp")!],
            ["dmage", sm.dmage_stats.get("mp")!],
            ["assassin", sm.assassin_stats.get("mp")!],
            ["rmage", sm.rmage_stats.get("mp")!]
        ]
    );

export const MatchToHpMap: Map<string, number> = new Map
    (
        [
            ["knight", sm.knight_stats.get("hp")!],
            ["dmage", sm.dmage_stats.get("hp")!],
            ["assassin", sm.assassin_stats.get("hp")!],
            ["rmage", sm.assassin_stats.get("hp")!]
        ]
    );