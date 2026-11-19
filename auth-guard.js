/* Guardia de acceso portal GACAC */
(function () {
  var K = "gacac-docs-auth-v1";
  if (sessionStorage.getItem(K) === 'ok') return;
  var p = location.pathname;
  var i = p.indexOf('/prototipo');
  var base = i >= 0 ? p.slice(0, i) : '';
  if (!base) base = '/GACAC-docs';
  if (!base.endsWith('/')) base += '/';
  location.replace(base + '?auth=required');
})();
