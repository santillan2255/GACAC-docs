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
  if (!base) base = '/GACAC-docs';
  if (!base.endsWith('/')) base += '/';
  var next = encodeURIComponent(p + location.search + location.hash);
  location.replace(base + '?auth=required&next=' + next);
})();
