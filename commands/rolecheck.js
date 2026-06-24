import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { getUser, getUserRole } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUPS = [
  { id: 396910998, name: 'Tags Group' },
  { id: 35914267, name: 'Glory Group' },
];

export const data = new SlashCommandBuilder()
  .setName('rolecheck')
  .setDescription('check what role a roblox user has in the group')
  .setDMPermission(true)
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  await i.deferReply({ ephemeral: true });
  const username = i.options.getString('username');
  const user = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No Roblox account found for **${username}**.`));

  const lines = [];
  for (const g of GROUPS) {
    const role = await getUserRole(g.id, user.id).catch(() => null);
    lines.push(`**${g.name}** — ${role ? `${role.name} (rank ${role.rank})` : 'Not in group'}`);
  }

  return i.editReply({
    flags: V2 | MessageFlags.Ephemeral,
    components: [box(C.blue, t(`## ${user.name}'s Roles`), hr(), t(lines.join('\n')))],
  });
}
