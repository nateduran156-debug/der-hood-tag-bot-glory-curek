import { SlashCommandBuilder } from 'discord.js';
import { ok, err, info } from '../utils/ui.js';
import { isAdmin, getLogin, removeLogin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('reset-login')
  .setDescription("reset a user's linked roblox account")
  .setDMPermission(true)
  .addUserOption(o => o.setName('user').setDescription('discord user').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  const target = i.options.getUser('user');
  const login = getLogin(target.id);
  if (!login) return i.reply(info('Not Linked', `**${target.username}** has no linked account.`));
  removeLogin(target.id);
  return i.reply(ok('Reset', `**${target.username}**'s linked account (**${login.robloxUsername}**) has been removed.`));
}
