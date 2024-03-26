import AdManager from 'managers/AdManager/AdManager';
import { TPages } from 'types/pages';

const initAdManager = (page: TPages | null) => new AdManager(page);

export { initAdManager };
