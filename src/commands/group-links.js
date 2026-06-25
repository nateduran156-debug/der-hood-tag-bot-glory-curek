import { SlashCommandBuilder } from 'discord.js';
import { info } from '../utils/ui.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

const makeCmd = (name, description) =>
  new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .setDMPermission(true);

function guard(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return true;
  return false;
}

export const data1400Group  = makeCmd('1400-tag-group',  'get the link to the 1400 gradient tag group');
export const dataGloryGroup = makeCmd('glory-tag-group', 'get the link to the glory tag group');
export const dataFazeGroup  = makeCmd('faze-tag-group',  'get the link to the faze tag group');

export async function execute1400Group(i) {
  if (guard(i)) return i.reply(info('Group Link', 'https://www.roblox.com/communities/206868002'));
  return i.reply(info('1400 Gradient Tag Group', 'https://www.roblox.com/communities/206868002'));
}

export async function executeGloryGroup(i) {
  if (guard(i)) return i.reply(info('Group Link', 'https://www.roblox.com/communities/35914267'));
  return i.reply(info('Glory Tag Group', 'https://www.roblox.com/communities/35914267'));
}

export async function executeFazeGroup(i) {
  if (guard(i)) return i.reply(info('Group Link', 'https://www.roblox.com/communities/396910998'));
  return i.reply(info('FaZe Tag Group', 'https://www.roblox.com/communities/396910998'));
}

export const groupLinkCommands = [
  { data: data1400Group,  execute: execute1400Group },
  { data: dataGloryGroup, execute: executeGloryGroup },
  { data: dataFazeGroup,  execute: executeFazeGroup },
];
