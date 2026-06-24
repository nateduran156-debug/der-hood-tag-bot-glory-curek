import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, getGroupRoles, setRank, getUserRole } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUPS = [396910998, 35914267];

export const data = new SlashCommandBuilder()
  .setName('tag-wipe')
  .setDescription('wipe all tags from a roblox user in both groups')
  .setDMPermission(true)
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply();
  const username = i.options.getString('username');
  const user = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No account found for **${username}**.`));

  const results = [];
  for (const gid of GROUPS) {
    const roles = await getGroupRoles(gid).catch(() => []);
    const base = roles.find(r => r.isBase) ?? roles.filter(r => r.rank > 0).sort((a, b) => a.rank - b.rank)[0];
    if (!base) { results.push(`Group ${gid}: no base role found`); continue; }
    const cur = await getUserRole(gid, user.id).catch(() => null);
    if (!cur || cur.rank <= 1) { results.push(`Group ${gid}: already at base`); continue; }
    try {
      await setRank(gid, user.id, base.id);
      results.push(`Group ${gid}: reset to **${base.name}**`);
    } catch (e) {
      results.push(`Group ${gid}: failed — ${e.message}`);
    }
  }
  return i.editReply(ok('Tag Wipe', `**${user.name}**\n${results.join('\n')}`));
}
