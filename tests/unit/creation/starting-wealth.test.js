import { getEquipmentTotalCp, priceToCp } from '../../../scripts/creation/starting-wealth.js';

describe('starting wealth pricing', () => {
  it('converts coin and credit prices to copper', () => {
    expect(priceToCp({ gp: 1, sp: 2, cp: 3 })).toBe(123);
    expect(priceToCp({ pp: 1 })).toBe(1000);
    expect(priceToCp({ pp: 0, gp: 0, sp: 0, cp: 0, credits: 7, upb: 0 })).toBe(70);
    expect(priceToCp({ upb: 2 })).toBe(20);
    expect(priceToCp(null)).toBe(0);
  });

  it('charges SF2e gear priced in credits against the starting budget', () => {
    const equipment = [
      { name: 'Comm Unit', quantity: 1, pricePer: 1, price: { pp: 0, gp: 0, sp: 0, cp: 0, credits: 7, upb: 0 } },
      { name: 'Projectile Ammo', quantity: 30, pricePer: 10, price: { credits: 1 } },
      { name: 'Rope', quantity: 2, pricePer: 1, price: { sp: 5 } },
    ];

    expect(getEquipmentTotalCp(equipment)).toBe(70 + 30 + 100);
  });
});
