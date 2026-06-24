import { getPresence } from './roblox.js';
import { V2, C, box, t, hr } from './utils/ui.js';
import { getAllSnipes } from './db.js';

const alerted = new Set();

export function startSnipeLoop(client) {
  setInterval(async () => {
    const snipes = getAllSnipes();
    if (!snipes.length) return;

    const byId = new Map();
    for (const s of snipes) {
      if (s.robloxId) byId.set(s.robloxId, s.robloxUsername);
    }
    if (!byId.size) return;

    let presences;
    try { presences = await getPresence([...byId.keys()]); }
    catch { return; }

    for (const p of presences) {
      if (p.userPresenceType !== 2) { alerted.delete(String(p.userId)); continue; }
      if (alerted.has(String(p.userId))) continue;
      alerted.add(String(p.userId));

      const username = byId.get(p.userId) ?? `User ${p.userId}`;
      const targets = snipes.filter(s => s.robloxId === p.userId);
      const link = p.placeId ? `\n[Join game](https://www.roblox.com/games/${p.placeId})` : '';

      for (const row of targets) {
        try {
          const user = await client.users.fetch(row.discordId);
          await user.send({ flags: V2, components: [box(C.yellow, t('## Snipe Alert'), hr(), t(`**${username}** just joined a game.${link}`))] });
        } catch { /* DMs closed */ }
      }
    }
  }, 30_000);
}
