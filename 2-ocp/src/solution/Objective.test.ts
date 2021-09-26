import { Objective } from './Objective';

describe('Objective', () => {
  const amount = 500;
  test('when objective is reach then bonus is objective amount', () => {
    const objective = new Objective(123, amount);

    expect(objective.bonusFor(123)).toBe(amount);
    expect(objective.bonusFor(124)).toBe(amount);
    expect(objective.bonusFor(200)).toBe(amount);
  });

  test('when objective is failed then bonus is 0', () => {
    const objective = new Objective(123, amount);

    expect(objective.bonusFor(0)).toBe(0);
    expect(objective.bonusFor(100)).toBe(0);
    expect(objective.bonusFor(122)).toBe(0);
  });

  test('when objective is doubled then bonus is double amount', () => {
    const objective = new Objective(123, amount);

    expect(objective.bonusFor(123 * 2)).toBe(amount * 2);
  });
});
