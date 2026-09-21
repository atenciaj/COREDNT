const { chromium } = require('playwright');

(async () => {
  console.log('Starting Playwright test...\n');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the app
  console.log('1. Opening VT form...');
  await page.goto('http://localhost:8080/index.html');
  await page.waitForLoadState('networkidle');
  console.log('   Page loaded');
  
  // Try to open VT panel
  console.log('2. Opening VT panel...');
  await page.evaluate(() => {
    // Try Bootstrap show method
    const bs = document.querySelector('[data-section="vt"]');
    if (bs) bs.click();
  });
  await page.waitForTimeout(1500);
  
  // Check if VT panel is visible
  const vtPanelVisible = await page.evaluate(() => {
    const panel = document.getElementById('panel-vt');
    return panel ? panel.classList.contains('show') || panel.style.display !== 'none' : false;
  });
  console.log('   VT Panel visible:', vtPanelVisible);
  
  const testData = {
    cliente: 'EMPRESA PRUEBA TEST',
    lugar: 'PLANTA PRUEBA',
    equipo: 'TANQUE-001',
    procedimiento: 'VT-001',
    criterio: 'ASME SECCION V',
    norma: 'ASME V ART 9',
    conclusiones: 'El elemento examinado se encuentra en CONDICION OPERATIVA.',
    recomendaciones: 'Se recomienda inspeccion periodica cada 6 meses.'
  };
  
  console.log('3. Filling VT form...');
  await page.evaluate((data) => {
    const fields = ['vt-cliente','vt-lugar','vt-equipo','vt-procedimiento','vt-criterio','vt-norma','vt-conclusiones','vt-recomendaciones'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = data[id] || data.cliente || '';
    });
    document.getElementById('vt-cliente').value = data.cliente;
    document.getElementById('vt-lugar').value = data.lugar;
    document.getElementById('vt-equipo').value = data.equipo;
    document.getElementById('vt-procedimiento').value = data.procedimiento;
    document.getElementById('vt-criterio').value = data.criterio;
    document.getElementById('vt-norma').value = data.norma;
    document.getElementById('vt-conclusiones').value = data.conclusiones;
    document.getElementById('vt-recomendaciones').value = data.recomendaciones;
  }, testData);
  console.log('   Fields set');
  
  // Save
  console.log('4. Saving...');
  const saveResult = await page.evaluate(() => {
    return new Promise((resolve) => {
      if (typeof window.NDT !== 'undefined' && window.NDT.db && window.NDT.db.saveReport) {
        const data = {
          cliente: document.getElementById('vt-cliente').value,
          lugar: document.getElementById('vt-lugar').value,
          equipo: document.getElementById('vt-equipo').value,
          procedimiento: document.getElementById('vt-procedimiento').value,
          criterio: document.getElementById('vt-criterio').value,
          norma: document.getElementById('vt-norma').value,
          conclusiones: document.getElementById('vt-conclusiones').value,
          recomendaciones: document.getElementById('vt-recomendaciones').value,
          fecha: new Date().toISOString()
        };
        window.NDT.db.saveReport('vt', data).then(() => {
          resolve({ success: true, method: 'NDT.db.saveReport' });
        }).catch(e => resolve({ success: false, error: e.message }));
      } else {
        // Try direct IndexedDB
        const request = indexedDB.open('soliwel_ndt', 9);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('vt_reports', 'readwrite');
          const store = tx.objectStore('vt_reports');
          data.id = Date.now();
          store.add(data);
          tx.oncomplete = () => resolve({ success: true, method: 'direct IDB' });
          tx.onerror = () => resolve({ success: false, error: tx.error });
        };
        request.onerror = () => resolve({ success: false, error: request.error });
      }
    });
  }, testData);
  console.log('   Save:', saveResult);
  await page.waitForTimeout(1500);
  
  // Check IndexedDB
  console.log('\n5. IndexedDB Check...');
  const idbResult = await page.evaluate(() => {
    return new Promise((resolve) => {
      const request = indexedDB.open('soliwel_ndt', 9);
      request.onsuccess = () => {
        const db = request.result;
        const stores = Array.from(db.objectStoreNames);
        if (stores.includes('vt_reports')) {
          const tx = db.transaction('vt_reports', 'readonly');
          const store = tx.objectStore('vt_reports');
          const countReq = store.count();
          countReq.onsuccess = () => {
            const getAll = store.getAll();
            getAll.onsuccess = () => {
              const reports = getAll.result;
              resolve({ 
                success: true, 
                storeExists: true, 
                count: countReq.result,
                reports: reports.map(r => ({ id: r.id, cliente: r.cliente }))
              });
            };
          };
        } else {
          resolve({ success: false, stores: stores });
        }
      };
      request.onerror = () => resolve({ success: false, error: 'cannot open db' });
    });
  });
  console.log('   Result:', JSON.stringify(idbResult, null, 2));
  
  // Print button
  console.log('\n6. Print Button...');
  const printBtn = await page.evaluate(() => {
    const btn = document.getElementById('btn-print-vt');
    if (!btn) return { found: false };
    return { 
      found: true, 
      onclick: btn.getAttribute('onclick'),
      text: btn.textContent?.trim().substring(0,30)
    };
  });
  console.log('   Print button:', printBtn);
  
  // PDF button
  console.log('\n7. PDF Button...');
  const pdfBtn = await page.evaluate(() => {
    // Look for PDF buttons in VT panel
    const panel = document.getElementById('panel-vt');
    if (!panel) return { found: false, reason: 'panel not found' };
    const buttons = panel.querySelectorAll('button');
    for (const btn of buttons) {
      const text = btn.textContent.toLowerCase();
      const onclick = btn.getAttribute('onclick') || '';
      if (text.includes('pdf') || onclick.includes('pdf')) {
        return { found: true, onclick: onclick.substring(0, 100) };
      }
    }
    // Also try IDB buttons
    const pdfBtnId = document.getElementById('btn-pdf-vt');
    if (pdfBtnId) return { found: true, onclick: pdfBtnId.getAttribute('onclick') };
    return { found: false, buttonsCount: buttons.length };
  });
  console.log('   PDF button:', pdfBtn);
  
  await browser.close();
  
  console.log('\n=== FINAL RESULTS ===');
  console.log('IndexedDB Save:', saveResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('IndexedDB Store:', idbResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('Print Button:', printBtn.found ? '✓ PASS' : '✗ FAIL');
  console.log('PDF Button:', pdfBtn.found ? '✓ PASS' : '✗ FAIL');
})();