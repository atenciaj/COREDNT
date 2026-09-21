const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:3001';

(async () => {
  console.log('🔍 AUDITORÍA NDT v2...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 30 });
  const page = await browser.newPage();
  
  const results = {
    errors: [],
    warnings: []
  };

  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.errors.push(msg.text());
    }
  });

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Página cargada:', await page.title());
    
    // Check NDT namespace
    console.log('\n📦 Namespace NDT:');
    const ndt = await page.evaluate(() => {
      const ns = {};
      for (const key in window.NDT) {
        ns[key] = typeof window.NDT[key];
      }
      return ns;
    });
    console.log(JSON.stringify(ndt, null, 2));
    
    // Check visible buttons
    console.log('\n🔘 Botones en página:');
    const buttons = await page.$$eval('button', btns => btns.map(b => ({
      id: b.id || b.getAttribute('data-bs-target') || '',
      text: b.textContent.trim().substring(0, 30),
      visible: b.offsetParent !== null
    })));
    buttons.forEach(b => {
      if (b.visible) console.log(`   ✅ [${b.id || 'sin-id'}] ${b.text}`);
    });
    
    // Check sidebar
    console.log('\n📂 Sidebar estructura:');
    const sidebar = await page.evaluate(() => {
      const sidebar = document.querySelector('#sidebar, .sidebar, nav');
      if (!sidebar) return 'No encontrado';
      const links = sidebar.querySelectorAll('a, button');
      return Array.from(links).slice(0, 15).map(l => ({
        tag: l.tagName,
        id: l.id,
        href: l.href || l.getAttribute('data-bs-target') || '',
        text: l.textContent.trim().substring(0, 25)
      }));
    });
    console.log(JSON.stringify(sidebar, null, 2));
    
    // Try clicking first visible nav button
    console.log('\n🖱️ Probando clicks en navegación:');
    const navButtons = await page.locator('#sidebar button, .sidebar button, nav button, [class*="nav"] button').all();
    for (const btn of navButtons.slice(0, 5)) {
      try {
        const text = await btn.textContent();
        const id = await btn.getAttribute('id') || await btn.getAttribute('data-bs-target') || '';
        await btn.click({ timeout: 1000 });
        console.log(`   ✅ Click: ${text.trim().substring(0, 30)}`);
        await page.waitForTimeout(300);
      } catch (e) {
        console.log(`   ⚠️ No clickeable`);
      }
    }
    
    // Check for JS errors
    console.log('\n❌ Errores JS capturados:');
    if (results.errors.length === 0) {
      console.log('   Sin errores');
    } else {
      results.errors.forEach(e => console.log(`   - ${e}`));
    }
    
    // Screenshot
    await page.screenshot({ path: 'E:/aplicacion reportes/audit-v2.png', fullPage: true });
    console.log('\n📸 Screenshot guardado: audit-v2.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🏁 Auditoría completada');
  }
})();
