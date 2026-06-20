// Beim Laden: gespeicherte Werte einfügen
chrome.storage.sync.get(['shortcuts'], (result) => {
  const shortcuts = result.shortcuts || [];
  shortcuts.forEach((s, i) => {
    document.getElementById(`name${i + 1}`).value = s.name || '';
    document.getElementById(`url${i + 1}`).value = s.url || '';
  });
});

// Beim Speichern
document.getElementById('save').addEventListener('click', () => {
  const shortcuts = [1, 2, 3].map(i => ({
    name: document.getElementById(`name${i}`).value,
    url: document.getElementById(`url${i}`).value,
  }));

  chrome.storage.sync.set({ shortcuts }, () => {
    alert('Saved Settings!');
  });
});