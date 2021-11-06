export interface PlayerObject {
  id: string;
  name: string;
  playerId: string;
  ping: string;
  connected: string;
}

export interface ServerDetails {
  map: string;
  players: string;
}

export function getPlayers(body: string): PlayerObject[] {
  const playerRegex = body.match(/#.+/g) ?? [];
  const playersAndBots = playerRegex.slice(1);
  const players = playersAndBots.join('\n').match(/.+\[U:\d{1}:\d+].+/g) ?? [];

  if (!players.length) return [];

  return players.map(player => {
    const playerDetailsArrayRaw = player.match(
      /[^\s"']+|"(.+)"|'([^']*)/g
    ) as string[];
    const playerDetails = playerDetailsArrayRaw.map(string =>
      string.replace(/"/g, '')
    );

    return {
      playerId: playerDetails[1],
      name: playerDetails[2],
      id: playerDetails[3],
      connected: playerDetails[4],
      ping: playerDetails[5],
    };
  });
}

export function getServerDetails(rawStatus: string): ServerDetails {
  const mapMatch = rawStatus.match(/: (.+) at:/) as string[];
  const maxPlayerMatch = rawStatus.match(/(\d{1,} max\))/) as string[];
  const amountPlayerMatch = rawStatus.match(
    /\d{1,} humans, \d{1,} bots \(\d{1,} max\)/
  ) as string[];

  const map = mapMatch[1];
  const maxPlayers = maxPlayerMatch.join('').split(' ')[0];
  const numberOfPlayers = amountPlayerMatch.join('').split(' ')[0];
  return { map, players: `${numberOfPlayers}/${maxPlayers} players` };
}
