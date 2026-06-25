import { REST, Routes, IntegrationType, InteractionContextType } from 'discord.js';

import { data as dLogin }          from './commands/login.js';
import { data as dLinkStatus }     from './commands/link-status.js';
import { data as dSetTag }         from './commands/set-tag.js';
import { data as dCooldown }       from './commands/cooldown-check.js';
import { data as dRolecheck }      from './commands/rolecheck.js';
import { data as dRoles }          from './commands/roles.js';
import { data as dUnrole }         from './commands/unrole.js';
import { data as dUnbanAll }       from './commands/unban-all.js';
import { data as dTagWipe }        from './commands/tag-wipe.js';
import { data as dWhitelistAdmin } from './commands/whitelist-admin.js';
import { data as dWhitelistRow }   from './commands/whitelist-row.js';
import { data as dBlacklist }      from './commands/blacklist.js';
import { data as dBlacklistList }  from './commands/blacklist-list.js';
import { data as dTagHistory }     from './commands/tag-history.js';
import { data as dView }           from './commands/view.js';
import { data as dResetCd }        from './commands/reset-cd.js';
import { data as dResetLogin }     from './commands/reset-login.js';
import { data as dHelp }           from './commands/help.js';
import { data as dSetCookie }      from './commands/setcookie.js';
import { data as dTag1400 }        from './commands/tag-1400.js';
import { groupLinkCommands } from './commands/group-links.js';
import { tagCommands }   from './commands/tag-commands.js';
import { gloryCommands } from './commands/glory-commands.js';

const raw = [
  dLogin, dLinkStatus, dSetTag, dCooldown, dRolecheck, dRoles,
  dUnrole, dUnbanAll, dTagWipe, dWhitelistAdmin, dWhitelistRow,
  dBlacklist, dBlacklistList, dTagHistory, dView, dResetCd, dResetLogin,
  dHelp, dSetCookie, dTag1400,
  ...groupLinkCommands.map(c => c.data),
  ...tagCommands.map(c => c.data),
  ...gloryCommands.map(c => c.data),
];

const commands = raw.map(c =>
  c.setIntegrationTypes([IntegrationType.GuildInstall, IntegrationType.UserInstall])
   .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
   .toJSON()
);

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
console.log(`Deployed ${data.length} commands globally (user-installable, all contexts).`);
