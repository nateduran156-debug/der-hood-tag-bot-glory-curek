import { MessageFlags } from 'discord.js';

export const V2 = MessageFlags.IsComponentsV2;

export const C = {
  green:  0x57F287,
  red:    0xED4245,
  yellow: 0xFEE75C,
  blue:   0x5865F2,
  grey:   null,
};

export function t(content) {
  return { type: 10, content };
}

export function hr() {
  return { type: 14, divider: true, spacing: 1 };
}

export function box(accentColor, ...components) {
  const c = { type: 17, components };
  if (accentColor !== null) c.accent_color = accentColor;
  return c;
}

function payload(color, title, body, ephemeral = false) {
  const flags = ephemeral ? V2 | MessageFlags.Ephemeral : V2;
  return {
    flags,
    components: [box(color, t(`## ${title}`), hr(), t(body))],
  };
}

export function ok(title, body, ephemeral = false) {
  return payload(C.green, title, body, ephemeral);
}

export function err(title, body, ephemeral = true) {
  return payload(C.red, title, body, ephemeral);
}

export function warn(title, body, ephemeral = true) {
  return payload(C.yellow, title, body, ephemeral);
}

export function info(title, body, ephemeral = false) {
  return payload(C.blue, title, body, ephemeral);
}

export function neutral(title, body, ephemeral = false) {
  return payload(C.grey, title, body, ephemeral);
}
