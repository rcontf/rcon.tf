import { getPlayers } from "./parsePlayerDetails"

const TEST_STRING_NO_QUOTES = `
    hostname: test
    version : 6862056/24 6862056 secure
    udp/ip : 1.1.1.1:27015
    players : 1 humans, 1 bots (24 max)
    edicts : 189 used of 2048 max
    # userid name uniqueid connected ping loss state adr
    # 2 "A Player" BOT active
    # 48 "First Last" [U:1:123456789]   36:36      155    0 active 192.148.0.0:27005
`
const TEST_STRING_WITH_QUOTES = `
    hostname: test
    version : 6862056/24 6862056 secure
    udp/ip : 1.1.1.1:27015
    players : 1 humans, 1 bots (24 max)
    edicts : 189 used of 2048 max
    # userid name uniqueid connected ping loss state adr
    # 2 "A Player" BOT active
    # 48 "First "Last"" [U:1:123456789]   36:36      155    0 active 192.148.0.0:27005
`

describe("getPlayers", () => {
    it('can parse player details', () => {
        const results = getPlayers(TEST_STRING_NO_QUOTES);

        expect(results[0].id).toBe('[U:1:123456789]');
        expect(results[0].name).toBe('First Last');
        expect(results[0].playerId).toBe('48');
    })

    it('can parse player details with quotes in names', () => {
        const results = getPlayers(TEST_STRING_WITH_QUOTES);

        expect(results[0].id).toBe('[U:1:123456789]');
        expect(results[0].name).toBe('First Last');
        expect(results[0].playerId).toBe('48');
    })
})
