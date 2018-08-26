import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (environment.ga !== undefined) {
  document.write(`
    <script>
      ga('create', '${environment.ga}', 'auto');
      ga('require', 'urlChangeTracker');
      ga('send', 'pageview');
    </script>
  `);
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
