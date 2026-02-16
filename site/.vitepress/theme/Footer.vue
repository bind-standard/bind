<template>
  <footer class="site-footer">
    <p>
      <a href="https://playground.bind-standard.org" target="_blank" rel="noopener">Playground</a>
      &nbsp;&middot;&nbsp;
      <a href="https://playground.bind-standard.org/terminology/" target="_blank" rel="noopener">Terminology Browser</a>
      &nbsp;&middot;&nbsp;
      <a href="https://github.com/bind-standard/bind" target="_blank" rel="noopener">GitHub</a>
    </p>
    <p><a href="https://github.com/bind-standard/bind?tab=CC0-1.0-1-ov-file#readme" target="_blank" rel="noopener"><span class="copyleft">&copy;</span>&nbsp;<span class="copyleft-text">Copyleft</span></a> CloudRaker Inc. Made in Canada.</p>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 24px 24px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.site-footer a {

  text-decoration: none;
}
.site-footer .copyleft {
  display: inline-block;
  transform: rotate(180deg);  
}
.site-footer a:hover .copyleft-text {
  text-decoration: underline;
}
</style>
