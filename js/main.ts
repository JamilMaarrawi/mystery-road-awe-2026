import { loadBookmarksFromStorage, loadNotesFromStorage } from "./services/storage.js";
import { setupEventListeners } from "./app/events.js";
import { loadAllData } from "./services/data.js";
import { handleHashChange } from "./app/router.js";

async function initApp(): Promise<void> {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  await loadAllData();
  handleHashChange();
}

void initApp();
