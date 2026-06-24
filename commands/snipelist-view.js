import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { getSnipelist, isAdmin } from '../db.js';

export const data = new SlashCommandBuilder()
  .setName('snipelist-view')
  .setDescription('see who is on your snipe list')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && i.user.id !== process.env.OWNER_ID) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  await i.deferReply({ ephemeral: true });
  const rows = getSnipelist(i.user.id);

  if (!rows.length) return i.editReply({ flags: V2 | MessageFlags.Ephemeral, components: [box(C.grey, t('## Snipelist'), hr(), t('Your snipelist is empty. Use `/snipelist add` to start tracking.'))] });

  const lines = rows.map(r => `**${r.robloxUsername}** · ID \`${r.robloxId ?? '—'}\``).join('\n');
  return i.editReply({
    flags: V2 | MessageFlags.Ephemeral,
    components: [box(C.blue, t(`## Snipelist (${rows.length})`), hr(), t(lines), hr(), t('-# DMs you when any of these users join a game.'))],
  });
}
