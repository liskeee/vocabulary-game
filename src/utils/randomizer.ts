import { VocabularyItem } from '@/types/game';

// Global recent items storage
class RecentItemsManager {
  private recentItems: string[] = [];
  private readonly STORAGE_KEY = 'vocabulary-recent-items';
  private readonly MAX_RECENT_ITEMS = 5;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.recentItems = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load recent items from storage:', error);
        this.recentItems = [];
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.recentItems));
      } catch (error) {
        console.error('Failed to save recent items to storage:', error);
      }
    }
  }

  getRecentItems(): string[] {
    return [...this.recentItems];
  }

  addRecentItem(itemId: string): void {
    // Remove if already exists, then add to front
    this.recentItems = [itemId, ...this.recentItems.filter(id => id !== itemId)]
      .slice(0, this.MAX_RECENT_ITEMS);
    this.saveToStorage();
  }

  clearRecentItems(): void {
    this.recentItems = [];
    this.saveToStorage();
  }
}

// Global instance
const recentItemsManager = new RecentItemsManager();

/**
 * Gets a random vocabulary item, avoiding recently used items when possible
 * @param vocabulary - Array of vocabulary items to choose from
 * @returns A random vocabulary item or null if vocabulary is empty
 */
export function getRandomVocabularyItem(vocabulary: VocabularyItem[]): VocabularyItem | null {
  if (vocabulary.length === 0) return null;
  
  // If vocabulary is small, don't worry about recent items
  if (vocabulary.length <= 5) {
    return vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  
  const recentItems = recentItemsManager.getRecentItems();
  
  // Filter out recently used items
  const availableItems = vocabulary.filter(
    (item) => !recentItems.includes(item.id)
  );
  
  // If no available items, reset recent items and pick from all
  if (availableItems.length === 0) {
    recentItemsManager.clearRecentItems();
    return vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  
  // Pick random item from available items
  return availableItems[Math.floor(Math.random() * availableItems.length)];
}

/**
 * Adds an item ID to the recent items list
 * @param itemId - ID of the item to add to recent items
 */
export function addToRecentItems(itemId: string): void {
  recentItemsManager.addRecentItem(itemId);
}

/**
 * Clears all recent items
 */
export function clearRecentItems(): void {
  recentItemsManager.clearRecentItems();
}

/**
 * Gets the current list of recent items (for debugging/testing)
 */
export function getRecentItems(): string[] {
  return recentItemsManager.getRecentItems();
}
