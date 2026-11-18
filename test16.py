from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,os
os.chdir('/mnt/data/WB-1.6-Gelistirme')
s=ThreadingHTTPServer(('127.0.0.1',8877),SimpleHTTPRequestHandler)
threading.Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8877/index.html',wait_until='load',timeout=25000)
 page.locator('nav button[data-page="explore"]').click()
 page.locator('#wb16-open-learning').click()
 assert page.locator('#wb-orbital-picture svg').count()==1
 page.locator('#wb-orbital').select_option('2py')
 assert 'düğüm' in page.locator('#wb-orbital-info').inner_text()
 page.locator('#wb-balance').click()
 assert '4 Fe' in page.locator('#wb-balance-output').inner_text()
 page.locator('#wb-step-calc').click()
 assert '0.25' in page.locator('#wb-step-output').inner_text()
 page.locator('#wb16-open-mistakes').count()==0
 page.locator('nav button[data-page="explore"]').click()
 page.locator('#wb16-open-mistakes').click()
 assert 'Henüz yanlış' in page.locator('#wb-mistakes-list').inner_text()
 assert not errors,errors
 print('PASS browser smoke: orbital, mechanism, balancing, step calculation, mistakes; no JS errors')
 b.close()
s.shutdown()
