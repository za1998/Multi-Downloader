export function saveToHistory(download) {
  const history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
  history.unshift(download);
  localStorage.setItem('downloadHistory', JSON.stringify(history.slice(0, 10)));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem('downloadHistory')) || [];
}

export function clearHistory() {
  localStorage.removeItem('downloadHistory');
}
