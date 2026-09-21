from pypdf import PdfReader
import json

base = 'F:/Nueva carpeta (2)/carlos ortiz/carlos ortiz/'
reports = {}

files = {
    'pt': '2129 SW-GT-PT-R-2129 REPORTE LIQUIDOS PENETRANTES A EJE DE GIRO.pdf',
    'ut': '2076. SW-GT-UTT-R-2076 REPORTE MEDICION ESPESORES EVAPORADOR I.pdf',
    'mt': '1610. SW-GT-MT-R-1610 SKCC Rodillo secador No 16 L1.pdf',
    'vt': '1597. SW-GT-VT-R-1597 Reporte videoscopia de Secador No 17- SKCC.pdf'
}

for k, fname in files.items():
    try:
        r = PdfReader(base + fname)
        texts = [p.extract_text() for p in r.pages]
        reports[k] = {'file': fname, 'pages': len(r.pages), 'text': texts}
        print(f'OK {k}: {len(r.pages)} pages')
    except Exception as e:
        print(f'ERR {k}: {e}')

with open('G:/aplicacion reportes/_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(reports, f, ensure_ascii=False, indent=2)
print('Done')
