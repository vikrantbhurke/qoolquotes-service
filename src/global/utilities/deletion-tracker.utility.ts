export class DeletionTracker {
  deletingEntities: Set<string>;

  constructor() {
    this.deletingEntities = new Set();
  }

  add(id: string) {
    this.deletingEntities.add(id);
  }

  remove(id: string) {
    this.deletingEntities.delete(id);
  }

  has(id: string) {
    return this.deletingEntities.has(id);
  }
}

export const deletionTracker = new DeletionTracker();
