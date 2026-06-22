//settings.js
let shortcutCount = 0;

function createShortcutItem(index, name = '', url = '') {
  const item = document.createElement('div');
  item.classList.add('item');
  item.dataset.index = index;

  item.innerHTML = `
    <label>Shortcut ${index}</label>
    <input type="text" id="name${index}" placeholder="Name" value="${name}">
    <input type="url" id="url${index}" placeholder="https://example.com" value="${url}">
  `;

  return item;
}
chrome.storage.sync.get(['shortcuts'], (result) => {
  const shortcuts = result.shortcuts || [];
  const list = document.getElementById('shortcut-list');

  if (shortcuts.length > 0) {
    shortcuts.forEach((s, i) => {
      const item = createShortcutItem(i + 1, s.name || '', s.url || '');
      list.appendChild(item);
      shortcutCount++;
    });
  } else {
    shortcutCount = list.querySelectorAll('.item').length;
  }
});

// ADD button
document.getElementById('add').addEventListener('click', () => {
  const list = document.getElementById('shortcut-list');
  shortcutCount = list.querySelectorAll('.item').length + 1;
  const newItem = createShortcutItem(shortcutCount);
  list.appendChild(newItem);
});

// REMOVE Button
document.getElementById('remove').addEventListener('click', () => {
  const list = document.getElementById('shortcut-list');
  const items = list.querySelectorAll('.item');
  if (items.length > 1) {
    items[items.length - 1].remove();
    shortcutCount = list.querySelectorAll('.item').length;
  }
});

document.getElementById('save').addEventListener('click', () => {
  const list = document.getElementById('shortcut-list');
  const items = list.querySelectorAll('.item');

  const shortcuts = Array.from(items).map((item, i) => ({
    name: document.getElementById(`name${i + 1}`)?.value || '',
    url: document.getElementById(`url${i + 1}`)?.value || '',
  }));

  chrome.storage.sync.set({ shortcuts }, () => {
    alert('Saved Settings!');
  });
});

// Back Button
document.getElementById('back').addEventListener('click', () => {
  window.history.back();
});