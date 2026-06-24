import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, getGroupRoles, setRank } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 396910998;

export const data = new SlashCommandBuilder()
  .setName('unrole')
  .setDescription("remove a user's rank (sets them to the lowest group role)")
  .setDMPermission(true)
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply();
  const username = i.options.getString('username');
  const user = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No account found for **${username}**.`));

  const roles = await getGroupRoles(GROUP).catch(() => []);
  const base = roles.filter(r => r.rank > 0).sort((a, b) => a.rank - b.rank)[0];
  if (!base) return i.editReply(err('Error', 'Could not fetch group roles.'));

  try {
    await setRank(GROUP, user.id, base.id);
    return i.editReply(ok('Unroled', `**${user.name}** set to **${base.name}** (rank ${base.rank}).`));
  } catch (e) {
    return i.editReply(err('Failed', e.message));
  }
}
