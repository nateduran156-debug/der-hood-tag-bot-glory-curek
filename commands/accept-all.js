import { SlashCommandBuilder } from 'discord.js';
import { ok, err, warn } from '../utils/ui.js';
import { getJoinRequests, acceptJoinRequest } from '../roblox.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 396910998;

export const data = new SlashCommandBuilder()
  .setName('acceptall')
  .setDescription('accept all pending join requests in the group')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
  await i.deferReply({ ephemeral: true });
  let requests;
  try {
    requests = await getJoinRequests(GROUP);
  } catch (e) {
    return i.editReply(err('Failed', e.message));
  }
  if (!requests.length) return i.editReply(warn('Nothing to do', 'No pending join requests.'));

  let accepted = 0;
  const failed = [];
  for (const req of requests) {
    const { userId, username } = req.requester;
    try {
      await acceptJoinRequest(GROUP, userId);
      accepted++;
    } catch {
      failed.push(username);
    }
  }

  const lines = [`Accepted **${accepted}** of **${requests.length}** requests.`];
  if (failed.length) lines.push(`Failed: ${failed.map(u => `**${u}**`).join(', ')}`);
  return i.editReply(ok('Done', lines.join('\n')));
}
