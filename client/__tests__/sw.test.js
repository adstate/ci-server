const makeServiceWorkerEnv = require('service-worker-mock');
const makeFetchMock = require('service-worker-mock/fetch');


describe('Service worker', () => {
    beforeEach(() => {
        const serviceWorkerEnv = makeServiceWorkerEnv();
        Object.defineProperty(serviceWorkerEnv, "addEventListener", {
          value: serviceWorkerEnv.addEventListener,
          enumerable: true
        });

        Object.assign(global, serviceWorkerEnv);
        jest.resetModules();
    });

    test('should add listeners', () => {
        require('../public/service-worker-custom.js');

        expect(self.listeners.get('install')).toBeDefined();
        expect(self.listeners.get('activate')).toBeDefined();
        expect(self.listeners.get('fetch')).toBeDefined();
    });

    test('should delete old caches on activate', async () => {
        require('../public/service-worker-custom.js');
   
        await self.caches.open('ci-cache-old');
        expect(self.snapshot().caches['ci-cache-old']).toBeDefined();

        await self.trigger('activate');
        expect(self.snapshot().caches['ci-cache-old']).toBeUndefined();
    });
});
