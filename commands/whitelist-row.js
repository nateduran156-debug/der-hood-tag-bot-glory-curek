import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { isAdmin, getAllAdmins } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('whitelist-row')
  .setDescription('list everyone in the whitelist roles database')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply({ ephemeral: true });

  const rows = getAllAdmins().sort((a, b) => b.addedAt - a.addedAt);
  if (!rows.length) return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.grey, t('## Whitelist'), hr(), t('No whitelisted users.'))] });

  const lines = rows.map(r => {
    const date = new Date(r.addedAt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `<@${r.discordId}> — added by <@${r.addedBy}> · ${date}`;
  }).join('\n');

  return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.blue, t(`## Whitelist (${rows.length})`), hr(), t(lines))] });
}
