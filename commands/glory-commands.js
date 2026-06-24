import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, setRank } from '../roblox.js';
import { isAdmin, isBlacklisted, logTag } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 35914267;

const TAGS = [
  { name: 'glory-red',    description: 'give the red glory tag to a roblox user',    roleId: 693471028, label: 'RED' },
  { name: 'glory-blue',   description: 'give the blue glory tag to a roblox user',   roleId: 358924088, label: 'BLUE' },
  { name: 'glory-pink',   description: 'give the pink glory tag to a roblox user',   roleId: 360664063, label: 'PINK' },
  { name: 'glory-purple', description: 'give the purple glory tag to a roblox user', roleId: 383052037, label: 'PURPLE' },
];

export const gloryCommands = TAGS.map(tag => ({
  data: new SlashCommandBuilder()
    .setName(tag.name)
    .setDescription(tag.description)
    .setDMPermission(true)
    .addStringOption(o => o.setName('username').setDescription('roblox username').setRequired(true)),

  async execute(i) {
    if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'Admins only.'));
    await i.deferReply();
    const username = i.options.getString('username');
    if (isBlacklisted(username)) return i.editReply(err('Blacklisted', `**${username}** is blacklisted from receiving tags.`));
    const user = await getUser(username).catch(() => null);
    if (!user) return i.editReply(err('Not Found', `No account found for **${username}**.`));
    try {
      await setRank(GROUP, user.id, tag.roleId);
      logTag(i.user.id, user.name, tag.label, GROUP);
      return i.editReply(ok('Tag Applied', `**${user.name}** — **${tag.label}** glory tag set.`));
    } catch (e) {
      return i.editReply(err('Failed', e.message));
    }
  },
}));
