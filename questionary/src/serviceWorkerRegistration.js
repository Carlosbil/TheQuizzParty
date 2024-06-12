// Este archivo se basa en la configuración predeterminada de create-react-app
// para el service worker.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] es la dirección localhost en IPv6.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 coincide con la dirección localhost en IPv4.
    window.location.hostname.match(
        /^127(?:\.[0-9]+){0,2}\.[0-9]+$/
    )
);

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // El constructor de URL está disponible en todos los navegadores que soportan SW.
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            // Nuestro service worker no funcionará si PUBLIC_URL está en un origen diferente
            // desde lo que nuestra página está servida. Esto puede suceder si se usa una CDN para servir los recursos.
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // Esto es ejecutado en localhost. Vamos a comprobar si todavía existe un service worker o no.
                checkValidServiceWorker(swUrl, config);

                // Agrega una verificación adicional para asegurarte de que los service workers estén configurados correctamente.
                navigator.serviceWorker.ready.then(() => {
                    console.log(
                        'Esta aplicación web está siendo servida en caché por un service worker.'
                    );
                });
            } else {
                // No es localhost. Solo registra el service worker.
                registerValidSW(swUrl, config);
            }
        });
    }
}

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // En este punto, el contenido precacheado ha sido actualizado.
                            console.log(
                                'Nuevo contenido está disponible y será usado cuando todas las ' +
                                'pestañas estén cerradas.'
                            );

                            // Ejecuta el callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            // En este punto, todo ha sido precacheado.
                            console.log('El contenido está en caché para su uso sin conexión.');

                            // Ejecuta el callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error durante el registro del service worker:', error);
        });
}

function checkValidServiceWorker(swUrl, config) {
    // Comprueba si el service worker se puede encontrar. Si no se puede recargar la página.
    fetch(swUrl, {
        headers: { 'Service-Worker': 'script' }
    })
        .then(response => {
            // Asegúrate de que el service worker exista y de que realmente estemos obteniendo un archivo JS.
            const contentType = response.headers.get('content-type');
            if (
                response.status === 404 ||
                (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                // No se encontró ningún service worker. Probablemente sea una aplicación diferente.
                navigator.serviceWorker.ready.then(registration => {
                    registration.unregister().then(() => {
                        window.location.reload();
                    });
                });
            } else {
                // Service worker encontrado. Procede como de costumbre.
                registerValidSW(swUrl, config);
            }
        })
        .catch(() => {
            console.log(
                'No se encontró ninguna conexión a Internet. La aplicación se está ejecutando en modo sin conexión.'
            );
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}
