import { SlashCommandBuilder } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { getGroupRoles } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 396910998;

export const data = new SlashCommandBuilder()
  .setName('roles')
  .setDescription('list all roles in the roblox group')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  await i.deferReply();
  const roles = await getGroupRoles(GROUP).catch(() => []);
  if (!roles.length) return i.editReply({ content: 'Failed to fetch roles.' });

  const lines = roles
    .filter(r => r.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .map(r => `**${r.name}** — Rank ${r.rank} · ${r.memberCount} members`)
    .join('\n');

  return i.editReply({ flags: V2, components: [box(C.blue, t('## Group Roles'), hr(), t(lines), hr(), t(`-# Group ${GROUP}`))] });
}
