import { SlashCommandBuilder } from 'discord.js';
import { ok, err, info } from '../utils/ui.js';
import { isAdmin, resetCooldown, getLogin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('reset-cd')
  .setDescription("reset a user's /set-tag cooldown")
  .setDMPermission(true)
  .addUserOption(o => o.setName('user').setDescription('discord user').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  const target = i.options.getUser('user');
  const login = getLogin(target.id);
  if (!login) return i.reply(info('Not Linked', `**${target.username}** has no linked Roblox account — no cooldown to reset.`));
  resetCooldown(login.robloxId);
  return i.reply(ok('Cooldown Reset', `**${target.username}** (**${login.robloxUsername}**)'s /set-tag cooldown has been cleared.`));
}
