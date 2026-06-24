import { SlashCommandBuilder } from 'discord.js';
import { ok, err } from '../utils/ui.js';
import { getUser, setRank } from '../roblox.js';
import { isAdmin, isBlacklisted, logTag } from '../db.js';
import { isOwner } from '../utils/owners.js';

const GROUP = 396910998;

const TAGS = [
  { name: 'tag-sharingan', description: 'give the sharingan tag to a roblox user', roleId: 668725105, label: 'sharingan tag' },
  { name: 'tag-rockstar',  description: 'give the rockstar tag to a roblox user',  roleId: 682977029, label: 'rockstar' },
  { name: 'tag-dark',      description: 'give the dark tag to a roblox user',      roleId: 682397039, label: 'dark' },
  { name: 'tag-faze',      description: 'give the FaZe tag to a roblox user',      roleId: 700893009, label: 'FaZe' },
  { name: 'tag-fraid',     description: 'give the fraid tag to a roblox user',     roleId: 698253050, label: 'fraid' },
];

export const tagCommands = TAGS.map(tag => ({
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
      return i.editReply(ok('Tag Applied', `**${user.name}** — **${tag.label}** tag set.`));
    } catch (e) {
      return i.editReply(err('Failed', e.message));
    }
  },
}));
