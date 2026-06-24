import { SlashCommandBuilder } from 'discord.js';
import { ok, err, info } from '../utils/ui.js';
import { isAdmin, addBlacklist, removeBlacklist, isBlacklisted } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('blacklist')
  .setDescription('blacklist a roblox username from receiving tags')
  .setDMPermission(true)
  .addStringOption(o => o.setName('action').setDescription('add or remove').setRequired(true)
    .addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }))
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  const action = i.options.getString('action');
  const username = i.options.getString('username');

  if (action === 'add') {
    if (isBlacklisted(username)) return i.reply(info('Already Blacklisted', `**${username}** is already on the blacklist.`));
    addBlacklist(username, i.user.id);
    return i.reply(ok('Blacklisted', `**${username}** has been blacklisted.`));
  } else {
    if (!removeBlacklist(username)) return i.reply(info('Not Found', `**${username}** is not on the blacklist.`));
    return i.reply(ok('Removed', `**${username}** removed from the blacklist.`));
  }
}
