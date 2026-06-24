import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser } from '../roblox.js';
import { getLogin, addLogin, isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('login')
  .setDescription('link your discord to your roblox user id')
  .setDMPermission(true)
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  await i.deferReply({ ephemeral: true });
  const username = i.options.getString('username');
  const user = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No Roblox account found for **${username}**.`));

  const existing = getLogin(i.user.id);
  if (existing) return i.editReply(err('Already Linked', `Your account is linked to **${existing.robloxUsername}**. Use \`/reset-login\` to change it.`));

  addLogin(i.user.id, user.name, user.id);
  return i.editReply(ok('Linked', `Your Discord is now linked to **${user.name}** (ID \`${user.id}\`).`));
}
