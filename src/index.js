import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { err } from './utils/ui.js';
import { startSnipeLoop } from './snipe-loop.js';

import { data as dLogin,          execute as eLogin }          from './commands/login.js';
import { data as dLinkStatus,     execute as eLinkStatus }     from './commands/link-status.js';
import { data as dSetTag,         execute as eSetTag }         from './commands/set-tag.js';
import { data as dCooldown,       execute as eCooldown }       from './commands/cooldown-check.js';
import { data as dRolecheck,      execute as eRolecheck }      from './commands/rolecheck.js';
import { data as dRoles,          execute as eRoles }          from './commands/roles.js';
import { data as dUnrole,         execute as eUnrole }         from './commands/unrole.js';
import { data as dUnbanAll,       execute as eUnbanAll }       from './commands/unban-all.js';
import { data as dTagWipe,        execute as eTagWipe }        from './commands/tag-wipe.js';
import { data as dWhitelistAdmin, execute as eWhitelistAdmin } from './commands/whitelist-admin.js';
import { data as dWhitelistRow,   execute as eWhitelistRow }   from './commands/whitelist-row.js';
import { data as dBlacklist,      execute as eBlacklist }      from './commands/blacklist.js';
import { data as dBlacklistList,  execute as eBlacklistList }  from './commands/blacklist-list.js';
import { data as dTagHistory,     execute as eTagHistory }     from './commands/tag-history.js';
import { data as dView,           execute as eView }           from './commands/view.js';
import { data as dResetCd,        execute as eResetCd }        from './commands/reset-cd.js';
import { data as dResetLogin,     execute as eResetLogin }     from './commands/reset-login.js';
import { data as dHelp,           execute as eHelp }           from './commands/help.js';
import { data as dSetCookie,      execute as eSetCookie }      from './commands/setcookie.js';
import { data as dTag1400,        execute as eTag1400 }        from './commands/tag-1400.js';
import { data as dFlaxTag,        execute as eFlaxTag }        from './commands/flax-tag.js';
import { data as dTracemogTag,    execute as eTracemogTag }    from './commands/tracemog-tag.js';
import { data as dSnipelist,      execute as eSnipelist }      from './commands/snipelist.js';
import { data as dSnipelistView,  execute as eSnipelistView }  from './commands/snipelist-view.js';
import { groupLinkCommands } from './commands/group-links.js';
import { tagCommands }       from './commands/tag-commands.js';
import { gloryCommands }     from './commands/glory-commands.js';

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('DISCORD_BOT_TOKEN is not set');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

const commands = new Collection();

const all = [
  { data: dLogin,          execute: eLogin },
  { data: dLinkStatus,     execute: eLinkStatus },
  { data: dSetTag,         execute: eSetTag },
  { data: dCooldown,       execute: eCooldown },
  { data: dRolecheck,      execute: eRolecheck },
  { data: dRoles,          execute: eRoles },
  { data: dUnrole,         execute: eUnrole },
  { data: dUnbanAll,       execute: eUnbanAll },
  { data: dTagWipe,        execute: eTagWipe },
  { data: dWhitelistAdmin, execute: eWhitelistAdmin },
  { data: dWhitelistRow,   execute: eWhitelistRow },
  { data: dBlacklist,      execute: eBlacklist },
  { data: dBlacklistList,  execute: eBlacklistList },
  { data: dTagHistory,     execute: eTagHistory },
  { data: dView,           execute: eView },
  { data: dResetCd,        execute: eResetCd },
  { data: dResetLogin,     execute: eResetLogin },
  { data: dHelp,           execute: eHelp },
  { data: dSetCookie,      execute: eSetCookie },
  { data: dTag1400,        execute: eTag1400 },
  { data: dFlaxTag,        execute: eFlaxTag },
  { data: dTracemogTag,    execute: eTracemogTag },
  { data: dSnipelist,      execute: eSnipelist },
  { data: dSnipelistView,  execute: eSnipelistView },
  ...groupLinkCommands,
  ...tagCommands,
  ...gloryCommands,
];

for (const cmd of all) commands.set(cmd.data.name, cmd);

client.once(Events.ClientReady, c => {
  console.log(`Online as ${c.user.tag} — ${commands.size} commands loaded`);
  startSnipeLoop(client);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction);
  } catch (e) {
    console.error(`/${interaction.commandName}:`, e);
    const payload = err('Error', 'Something went wrong. Try again.');
    if (interaction.replied || interaction.deferred) await interaction.editReply(payload).catch(() => {});
    else await interaction.reply(payload).catch(() => {});
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
