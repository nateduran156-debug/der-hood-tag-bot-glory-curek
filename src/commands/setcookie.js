import { SlashCommandBuilder } from 'discord.js';
import { err, ok } from '../utils/ui.js';
import { setCookie } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('setcookie')
  .setDescription('set the roblox cookie used for rank changes')
  .setDMPermission(true)
  .addStringOption(o =>
    o.setName('cookie').setDescription('.ROBLOSECURITY cookie value').setRequired(true)
  );

export async function execute(i) {
  if (!isOwner(i.user.id)) return i.reply(err('No Permission', 'Only bot owners can use this command.'));
  const cookie = i.options.getString('cookie');
  setCookie(cookie);
  return i.reply(ok('Cookie Updated', 'Roblox cookie saved. All rank changes will now use it.', true));
}
