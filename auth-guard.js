/* Guardia de acceso portal CoopApps */
(function () {
  var K = "gacac-docs-auth-v1";
  try {
    if (localStorage.getItem(K) === 'ok') return;
    if (sessionStorage.getItem(K) === 'ok') {
      localStorage.setItem(K, 'ok');
      return;
    }
  } catch (e) {}
  var p = location.pathname;
  var i = p.indexOf('/prototipo');
  var base = i >= 0 ? p.slice(0, i) : '';
  if (!base) {
    var parts = p.split('/').filter(Boolean);
    if (parts.length > 0 && parts[0] !== 'prototipo') base = '/' + parts[0];
  }
  if (!base) base = '/GACAC-docs';
  if (!base.endsWith('/')) base += '/';
  var next = encodeURIComponent(p + location.search + location.hash);
  var gate = location.origin + base + '?auth=required&next=' + next;
  location.replace(gate);
})();
