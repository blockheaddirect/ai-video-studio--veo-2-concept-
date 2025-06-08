import { generateId } from '../../../App';

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toEqual(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });
});
