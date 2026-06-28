const now = new Date();

export const state = {
  curMonth: now.getMonth(),
  curYear: now.getFullYear(),
  curPage: 'dashboard',
  editId: null,
  editType: null,
};

export const nowDate = now;
