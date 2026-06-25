import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, setRank } from '../roblox.js';
import { isAdmin, isBlacklisted, logTag } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP  = 206868002;
const ROLE   = 612286428;
const LABEL  = '縁 1400 gradient';

export const data = new SlashCommandBuilder()
  .setName('1400-tag')
  .setDescription('give the 1400 gradient tag to a roblox user')
  .setDMPermission(true)
  .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true));

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply();
  const username = i.options.getString('username');
  if (isBlacklisted(username)) return i.editReply(err('Blacklisted', `**${username}** is blacklisted from receiving tags.`));
  const user = await getUser(username).catch(() => null);
  if (!user) return i.editReply(err('Not Found', `No account found for **${username}**.`));
  try {
    await setRank(GROUP, user.id, ROLE);
    logTag(i.user.id, user.name, LABEL, GROUP);
    return i.editReply(ok('Tag Applied', `**${user.name}** — **${LABEL}** tag set.`));
  } catch (e) {
    return i.editReply(err('Failed', e.message));
  }
}
