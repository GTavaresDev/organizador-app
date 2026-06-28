import { nav, getNavItemByPage } from './navigation.js';
import {
  openAddModal, editItem, delItem, closeOverlay,
  switchModalType, saveItem,
} from '../shared/modal/modal.js';
import {
  applyConfig, validarNomeAoSair, setAccent,
  exportData, importData, clearAllData,
} from '../features/config/config.js';
import { calcSim } from '../features/simulacao/simulacao.js';

export function registerGlobals() {
  Object.assign(window, {
    nav,
    openAddModal,
    editItem,
    delItem,
    closeOverlay,
    switchModalType,
    saveItem,
    applyConfig,
    validarNomeAoSair,
    setAccent,
    exportData,
    importData,
    clearAllData,
    calcSim,
    goToConfig: () => nav('config', getNavItemByPage('config')),
  });
}
