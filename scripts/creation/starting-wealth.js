import { CHARACTER_WEALTH, MODULE_ID, WEALTH_MODES } from '../constants.js';
import { getActiveSystemId, SYSTEM_IDS } from '../system-support/profiles.js';

// Prepared SF2e documents report prices in credits (and UPBs), worth 10cp each, alongside the coin keys.
const CP_PER_UNIT = { pp: 1000, gp: 100, sp: 10, cp: 1, credits: 10, upb: 10 };

export function priceToCp(price) {
  if (!price || typeof price !== 'object') return 0;
  return Object.entries(CP_PER_UNIT).reduce((total, [unit, cp]) => total + (Number(price[unit]) || 0) * cp, 0);
}

export function getEquipmentTotalCp(equipment = []) {
  let totalCp = 0;
  for (const entry of equipment) {
    if (!entry?.price) continue;
    const quantity = Number(entry.quantity ?? 1) || 1;
    const pricePer = Number(entry.pricePer ?? 1) || 1;
    const unitCp = priceToCp(entry.price);
    totalCp += Math.ceil((quantity / pricePer) * unitCp);
  }
  return totalCp;
}

export function getStartingEquipmentBudgetCp(actor) {
  const mode = game.settings.get(MODULE_ID, 'startingWealthMode') ?? WEALTH_MODES.DISABLED;
  const level = Number(actor?.system?.details?.level?.value ?? 1) || 1;
  const wealth = CHARACTER_WEALTH[level];

  if (mode === WEALTH_MODES.LUMP_SUM && wealth) return wealth.lumpSumGp * 100;
  if (mode === WEALTH_MODES.ITEMS_AND_CURRENCY && wealth) return wealth.currencyGp * 100;
  if (mode === WEALTH_MODES.CUSTOM) {
    const gold = Number(game.settings.get(MODULE_ID, 'startingEquipmentGoldLimit')) || 0;
    return Math.max(0, Math.round(gold * 100));
  }
  return 0;
}

// SF2e has no coin items of its own (it pulls them from pf2e.equipment-srd), so pay it in credits.
export function startingCurrencyFromCp(totalCp) {
  if (getActiveSystemId() === SYSTEM_IDS.SF2E) {
    const credits = Math.floor(Math.max(0, Number(totalCp) || 0) / 10);
    return credits > 0 ? { credits } : {};
  }
  return coinsFromCp(totalCp);
}

function coinsFromCp(totalCp) {
  let remainder = Math.max(0, Math.trunc(Number(totalCp) || 0));
  const gp = Math.floor(remainder / 100);
  remainder %= 100;
  const sp = Math.floor(remainder / 10);
  const cp = remainder % 10;
  return Object.fromEntries(Object.entries({ gp, sp, cp }).filter(([, quantity]) => quantity > 0));
}
