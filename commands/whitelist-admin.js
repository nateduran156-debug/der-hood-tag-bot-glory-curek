import { SlashCommandBuilder } from 'discord.js';
import { ok, err, info } from '../utils/ui.js';
import { isAdmin, addAdmin, removeAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('whitelist-admin')
  .setDescription('whitelist a discord user to use all commands')
  .setDMPermission(true)
  .addUserOption(o => o.setName('user').setDescription('discord user').setRequired(true))
  .addStringOption(o => o.setName('action').setDescription('add or remove').setRequired(true)
    .addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Only admins can whitelist users.'));

  const target = i.options.getUser('user');
  const action = i.options.getString('action');
  if (target.bot) return i.reply(err('Invalid', 'Cannot whitelist a bot.'));

  if (action === 'add') {
    if (isAdmin(target.id)) return i.reply(info('Already Whitelisted', `**${target.username}** is already an admin.`));
    addAdmin(target.id, i.user.id);
    return i.reply(ok('Admin Added', `**${target.username}** can now use all commands.`));
  } else {
    if (!removeAdmin(target.id)) return i.reply(info('Not Found', `**${target.username}** is not whitelisted.`));
    return i.reply(ok('Removed', `**${target.username}** removed from the whitelist.`));
  }
}
