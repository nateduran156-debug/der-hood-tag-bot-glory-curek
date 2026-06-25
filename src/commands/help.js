import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { V2, C, box, t, hr, err } from '../utils/ui.js';
import { isAdmin } from '../db.js';
import { isOwner } from '../utils/owners.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('view all available bot commands')
  .setDMPermission(true);

export async function execute(i) {
  if (!isAdmin(i.user.id) && !isOwner(i.user.id)) return i.reply(err('No Permission', 'You must be whitelisted to use this bot.'));
  return i.reply({
    flags: V2 | MessageFlags.Ephemeral,
    components: [box(C.blue,
      t('## Commands'),
      hr(),
      t('**Tags — Group 396910998**\n`/tag-sharingan` `/tag-rockstar` `/tag-dark` `/tag-faze` `/tag-fraid`'),
      hr(),
      t('**Glory Tags — Group 35914267**\n`/glory-red` `/glory-blue` `/glory-pink` `/glory-purple`'),
      hr(),
      t('**1400 Gradient — Group 206868002**\n`/1400-tag`'),
      hr(),
      t('**Account**\n`/login` — link your discord to your roblox user id\n`/link-status` — check your linked roblox account\n`/set-tag` — set your tag in the roblox group\n`/cooldown-check` — check your set-tag cooldown'),
      hr(),
      t('**Lookup**\n`/rolecheck` — check what role a roblox user has in the group\n`/roles` — list all roles in the roblox group'),
      hr(),
      t('**Snipe**\n`/snipelist` — alert when a roblox user joins a game\n`/snipelist-view` — see who is on your snipe list'),
      hr(),
      t('**Admin**\n`/whitelist-admin` — whitelist a discord user to use all commands\n`/whitelist-row` — list everyone in the whitelist roles database\n`/blacklist` — blacklist a roblox username from receiving tags\n`/blacklist-list` — view all blacklisted roblox usernames\n`/tag-history` — view the full tag audit log\n`/tag-wipe` — wipe all tags from a roblox user in both groups\n`/unrole` — remove a user\'s rank (sets them to the lowest group role)\n`/unban-all` — unban all members except hardbans\n`/reset-cd` — reset a user\'s /set-tag cooldown\n`/reset-login` — reset a user\'s linked roblox account\n`/view` — view a user\'s linked roblox account\n`/acceptall` — accept all pending join requests\n`/accept` — accept a specific join request'),
      hr(),
      t('-# All commands work in DMs and servers. /set-tag cooldown is 1 hour.'),
    )],
  });
}
