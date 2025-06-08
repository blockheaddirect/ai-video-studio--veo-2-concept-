import { generateId } from '../../client/App';

/** @jsxImportSource react */

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });

  it('should generate an ID of expected length', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });
});
// Commenting out tests for now