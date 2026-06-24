import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { isAdmin, getTagHistory } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('tag-history')
  .setDescription('view the full tag audit log')
  .setDMPermission(true)
  .addIntegerOption(o => o.setName('limit').setDescription('entries to show (default 15, max 50)').setMinValue(1).setMaxValue(50))
  .addStringOption(o => o.setName('username').setDescription('filter by roblox username'));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply({ ephemeral: true });

  const limit = i.options.getInteger('limit') ?? 15;
  const username = i.options.getString('username');
  const rows = getTagHistory(limit, username);

  if (!rows.length) return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.grey, t('## Tag History'), hr(), t(username ? `No history for **${username}**.` : 'No tags given yet.'))] });

  const lines = rows.map(r => {
    const d = new Date(r.givenAt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const tm = new Date(r.givenAt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `**${r.robloxUsername}** — \`${r.tagName}\` · <@${r.discordId}> · ${d} ${tm}`;
  }).join('\n');

  const title = username ? `Tag History — ${username}` : `Tag History (${rows.length})`;
  return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.blue, t(`## ${title}`), hr(), t(lines))] });
}
