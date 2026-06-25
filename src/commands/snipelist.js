import { SlashCommandBuilder } from 'discord.js';
import { ok, err, info } from '../utils/ui.js';
import { getUser } from '../roblox.js';
import { isAdmin, addSnipe, removeSnipe } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('snipelist')
  .setDescription('alerts you when a roblox user joins a game')
  .setDMPermission(true)
  .addStringOption(o => o.setName('action').setDescription('add or remove').setRequired(true)
    .addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }))
  .addStringOption(o => o.setName('user').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply({ ephemeral: true });

  const action = i.options.getString('action');
  const username = i.options.getString('user');

  if (action === 'add') {
    const user = await getUser(username).catch(() => null);
    if (!user) return i.editReply(err('Not Found', `No Roblox account found for **${username}**.`));
    if (!addSnipe(user.name, user.id, i.user.id)) return i.editReply(info('Already Tracking', `**${user.name}** is already on your snipelist.`));
    return i.editReply(ok('Added', `You will be alerted when **${user.name}** joins a game.`));
  } else {
    if (!removeSnipe(username, i.user.id)) return i.editReply(info('Not Found', `**${username}** is not on your snipelist.`));
    return i.editReply(ok('Removed', `**${username}** removed from your snipelist.`));
  }
}
