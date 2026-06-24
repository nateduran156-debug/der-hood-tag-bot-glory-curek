import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { isAdmin, getAllBlacklist } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('blacklist-list')
  .setDescription('view all blacklisted roblox usernames')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply({ ephemeral: true });

  const rows = getAllBlacklist().sort((a, b) => b.addedAt - a.addedAt);
  if (!rows.length) return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.grey, t('## Blacklist'), hr(), t('Blacklist is empty.'))] });

  const lines = rows.map(r => {
    const date = new Date(r.addedAt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `**${r.username}** — <@${r.addedBy}> · ${date}`;
  }).join('\n');

  return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.yellow, t(`## Blacklist (${rows.length})`), hr(), t(lines))] });
}
