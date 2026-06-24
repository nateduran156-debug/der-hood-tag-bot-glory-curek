import { SlashCommandBuilder } from 'discord.js';
import { ok, err, neutral } from '../utils/ui.js';
import { getBanned, unban } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 396910998;

export const data = new SlashCommandBuilder()
  .setName('unban-all')
  .setDescription('unban all members except hardbans')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply();
  let banned;
  try { banned = await getBanned(GROUP); }
  catch (e) { return i.editReply(err('Failed', e.message)); }

  if (!banned.length) return i.editReply(neutral('Unban All', 'No banned users found.'));

  let count = 0;
  for (const entry of banned) {
    if (await unban(GROUP, entry.user?.userId).catch(() => false)) count++;
  }
  return i.editReply(ok('Unban All', `Unbanned **${count}/${banned.length}** users.`));
}
