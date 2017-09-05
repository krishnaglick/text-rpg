
const glob = require('globby');
const path = require('path');
const fs = require('fs');

const notes = [
  'Offensive', // considered an attack ability (used in laws)
  'Reflectable', // reflect status sends ability back on caster
  'ByPass', // Ignore-Reaction: This ability never triggers any Reaction, no matter what the ability does.
  'Silenceable', // cannot be used under silence status
  'Stealable', // Steal: Ability can be used on this skill, *PROVIDING* the caster could learn it normally in one of his/her jobs.  Some abilities are Stealable, but no unit can do so since Thieves can only be Humans and Moogles only.
  'Counter', // R-Ab:Return Magic: The Reaction Ability Return Magic will work against this ability.
  'Absorb', // R-Ab:Absorb MP: The Reaction Ability Absorb MP will work against this ability.
];

const ranges = [
  'Self', // Range is limited to the caster
  'Cone', // Range grows in a conical fashion from caster
  'Constant', // Range is a specified constant distance from caster
  'Weapon', // Range is based on the equipped weapon's range
  'Line', // Range extends in a line from the caster in the facing direction
  'DblLine', // Range extends in a line in front and behind the casters facing direction
  'Infinite', // Range covers entire field
];

const charges = [
  'None', // Not applicable
  'Elemental', // Charge is a specified constant
  'Weapon', // Charge is based on equipped weapon
];

const powers = [
  'None', // Not applicable
  'MPow', // Power based on magical constant
  'WAtk', // Power based on physical constant
  'Weapon', // Power based on equipped weapon
];

const areas = [
  'Self',
  'OneUnit',
  'Specify', // ex: r1/v1
  'Infinite',
];

const elements = [
  'None',
  'Fire',
  'Ice',
  'Lightning',
  'Water',
  'Earth',
  'Wind',
  'Holy',
  'Dark'
];

const effectRateTypes = [
  //I'm not sure what these are exactly
  'AType',
  'SType',
  'Full' // 100%H
];
const effectTargetTypes = [
  'Default', // Normal unit targetting, as if you were using the attack command.  Will ignore KOed units, among other things.
  'KOedUnit', // Will only target a KOed unit.
  'Self', // Will only target the Caster.
  'NotSelf', // Will target anything but the caster.
  'Enemy', // Will only target an enemy unit.
  'Undead', // Will only target Zombies, Vampires or units with the Zombie Status
  'NonUndead', // Will only target units that are not Undead.
  'Animal', // Will only target monsters.
  'NonAnimal', // Will only target units that are not monsters.
  'Dragon', // Will only target dragons.
  'NonDragon', // Will only target units that are not dragons.
  'Gadget', // Has a 50/101 chance of targetting all enemies, and a corresponding 51/101 chance of targetting all enemies.
  'EqpSword', // Will only target units wielding a Sword, Blade, Saber, Knightsword, Greatsword, Broadsword, Knife, Rapier or Katana.
  'LvlDivBy3', // Will only target units whose level is divisible by 3.
  'SmeLvlDay', // Will only target units where the unit figure of their level is identical to the unit figure of the current day of the month.  For example, on day 17 of Bardmoon, units of L7, 17, 27, 37 and 47 will be effected.
  'Judge', // Will only target the judge
];
const effectDependencies = [
  'None',
  'NonUndead', // Will only target units who are not undead
  'LvlDivBy5', // Will only target units whose level is divisible by 5.
  'SameLvDigit', // Will only target units where the unit figure of their level is identical to the unit figure of the caster.  For example, a L32 caster can effect units of L2, 12, 22, 32 and 42 with this effect.
  'Eye2Eye', // The caster must be attacking the target from the Front.  Any attack from the Side or Rear will cause this effect to fail. 
  'Eff1Dep', // This effect will only be allowed to target the unit if Effect 1 succeeded against the target.  In the example, Mug has an AType Hit Rate chance of stealing gil from the target.  If that fails, then Effect 2 (which has an Eff1Dep validity check) will always fail against the target.
  'Eff2Dep', // Same as Eff1Dep, except that Effect 2 must succeed for this Effect to be able to hit the target.
];

(async () => {
  const abilities = await glob(path.resolve('./JSON/Abilities/*.json'));
  abilities.forEach((abilityPath) => {
    const ability = require(abilityPath);
    ability.notes = ability.notes.map(n => notes[n]);
    ability.element = elements[ability.element];
    ability.areaType = areas[ability.areaType];
    ability.powerType = powers[ability.powerType];
    ability.charge = charges[ability.charge];
    ability.rangeType = ranges[ability.rangeType];
    ability.effects = ability.effects.map((effect) => {
      effect.rate = effectRateTypes[effect.rate];
      effect.target = effectTargetTypes[effect.target];
      effect.dependency = effectDependencies[effect.dependency];
      return effect;
    });

    fs.writeFileSync(abilityPath, JSON.stringify(ability, null, 2));
  });
})();
