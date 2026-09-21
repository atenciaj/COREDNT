const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:3001';

(async () => {
  console.log('🔍 INICIANDO AUDITORÍA NDT...\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    consoleErrors: [],
    failedResources: [],
    modules: [],
    formTests: []
  };

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
    }
  });

  // Capture failed resources
  page.on('requestfailed', request => {
    results.failedResources.push({
      url: request.url(),
      failure: request.failure().errorText
    });
  });

  try {
    // 1. Load main page
    console.log('1️⃣ Cargando página principal...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('   ✅ Página cargada:', await page.title());
    await page.screenshot({ path: 'E:/aplicacion reportes/audit-main.png', fullPage: true });
    console.log('   📸 Screenshot guardado\n');

    // 2. Check for NDT namespace
    console.log('2️⃣ Verificando namespace NDT...');
    const ndtExists = await page.evaluate(() => {
      return {
        NDT: typeof window.NDT !== 'undefined',
        hasApp: typeof window.NDT?.App !== 'undefined',
        hasDB: typeof window.NDT?.DB !== 'undefined',
        hasCalibraciones: typeof window.NDT?.Calibraciones !== 'undefined',
        hasCertificaciones: typeof window.NDT?.Certificaciones !== 'undefined',
        hasEquipos: typeof window.NDT?.Equipos !== 'undefined'
      };
    });
    console.log('   Namespace NDT:', ndtExists);
    
    // 3. Test each module navigation
    console.log('\n3️⃣ Probando navegación de módulos...');
    
    const modules = [
      { name: 'Equipos', id: 'btn-equipos' },
      { name: 'Calibraciones', id: 'btn-calibraciones' },
      { name: 'Procedimientos', id: 'btn-procedimientos' },
      { name: 'Solicitudes', id: 'btn-solicitudes' },
      { name: 'Fichas Seguridad', id: 'btn-fichas' },
      { name: 'Certificaciones', id: 'btn-certificaciones' },
      { name: 'Indicadores', id: 'btn-indicadores' },
      { name: 'Integridad', id: 'btn-integridad' }
    ];

    for (const mod of modules) {
      try {
        const btnSelector = `#${mod.id}, button[id="${mod.id}"], [data-module="${mod.id}"]`;
        const btn = page.locator(btnSelector).first();
        
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          await page.waitForTimeout(500);
          console.log(`   ✅ ${mod.name}: Navegado`);
          
          // Check if container has content
          const hasContent = await page.evaluate((name) => {
            const container = document.querySelector(`[id*="${name.toLowerCase()}"]`);
            return container ? container.innerHTML.length > 100 : false;
          }, mod.name);
          
          if (hasContent) {
            console.log(`   📄 ${mod.name}: Tiene contenido`);
          }
        } else {
          console.log(`   ⚠️ ${mod.name}: Botón no visible`);
        }
      } catch (e) {
        console.log(`   ❌ ${mod.name}: ${e.message}`);
      }
    }

    // 4. Test Dashboard
    console.log('\n4️⃣ Probando Dashboard...');
    const dashboardBtn = page.locator('#btn-dashboard, button[id="btn-dashboard"]').first();
    if (await dashboardBtn.isVisible({ timeout: 2000 })) {
      await dashboardBtn.click();
      await page.waitForTimeout(1000);
      console.log('   ✅ Dashboard cargado');
    }

    // 5. Check IndexedDB connection
    console.log('\n5️⃣ Verificando IndexedDB...');
    const dbStatus = await page.evaluate(async () => {
      try {
        const db = await window.NDT.DB.initDB();
        return {
          success: true,
          name: db.name,
          version: db.version
        };
      } catch (e) {
        return { success: false, error: e.message };
      }
    });
    console.log('   IndexedDB:', JSON.stringify(dbStatus));

    // 6. Test form interactions
    console.log('\n6️⃣ Probando formularios...');
    
    // Go to Equipos
    await page.click('#btn-equipos');
    await page.waitForTimeout(500);
    
    // Check for form elements
    const formElements = await page.evaluate(() => {
      return {
        inputs: document.querySelectorAll('input').length,
        selects: document.querySelectorAll('select').length,
        buttons: document.querySelectorAll('button').length,
        forms: document.querySelectorAll('form').length
      };
    });
    console.log('   Elementos de formulario:', formElements);

    // Summary
    console.log('\n===========================================');
    console.log('📊 RESUMEN DE AUDITORÍA');
    console.log('===========================================');
    console.log(`❌ Errores de consola: ${results.consoleErrors.length}`);
    if (results.consoleErrors.length > 0) {
      results.consoleErrors.forEach(e => console.log(`   - ${e}`));
    }
    console.log(`❌ Recursos fallidos: ${results.failedResources.length}`);
    if (results.failedResources.length > 0) {
      results.failedResources.forEach(r => console.log(`   - ${r.url}: ${r.failure}`));
    }
    
    console.log('\n✅ Auditoría completada');
    
    await page.screenshot({ path: 'E:/aplicacion reportes/audit-final.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Error en auditoría:', error.message);
  } finally {
    await browser.close();
  }
})();
