import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, acceptJoinRequest } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 396910998;

export const data = new SlashCommandBuilder()
  .setName('accept')
  .setDescription('accept a join request in the group')
  .setDMPermission(true)
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply({ ephemeral: true });
  const username = i.options.getString('username');
  const user = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No account found for **${username}**.`));
  try {
    await acceptJoinRequest(GROUP, user.id);
    return i.editReply(ok('Accepted', `**${user.name}** has been accepted into the group.`));
  } catch (e) {
    return i.editReply(err('Failed', e.message));
  }
}
