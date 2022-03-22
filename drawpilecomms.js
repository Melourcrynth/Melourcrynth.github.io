(function () {
    'use strict';

    function formatDate(input) {
        try {
            const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'medium',
            });
            const timeZone  = dateTimeFormat.resolvedOptions().timeZone;
            const formatted = dateTimeFormat.format(Date.parse(input))
            return formatted + ' (adjusted to time zone of ' + timeZone + ')';
        }
        catch (e) {
            console.error(e);
            return input;
        }
    }

    function sha256(input) {
        return crypto.subtle.digest('SHA-256', new TextEncoder('UTF-8').encode(input)).then(buf => Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join(''));
    }

    function showExample(element, url, alt) {
        const a       = document.createElement('a');
        a.href        = 'https://cdn.discordapp.com/attachments/' + url + '.png';
        a.textContent = alt;
        a.target      = '_blank';
        element.appendChild(a);
    }

    const updatedElement = document.getElementById('update-datetime');
    updatedElement.textContent = formatDate(updatedElement.textContent);

    const salt     = 'z\\YpdEJ$$GLck0yV;>{b-%5y0';
    const fragment = window.location.hash || '';
    sha256(salt + fragment)
        .then(checksum => {
            const expected = 'f02727d0bad5f5943fbaf99f667e4cb8'
                           + '9d7cdfc6bd4539753fdcad0d490cc1ef';
            return checksum === expected ? fragment : '';
        })
        .then(input => {
            const match = /^#([^;]+);([^;]+)$/.exec(input);
            if (match) {
                const sketchExampleElement = document.getElementById('sketch-example');
                showExample(sketchExampleElement, match[1], 'Example sketch.');
                document.getElementById('sketch-more').textContent = 'Ask for more examples.';

                const drawingExampleElement = document.getElementById('drawing-example');
                showExample(drawingExampleElement, match[2], 'Example drawing.');
                document.getElementById('drawing-more').textContent = 'Ask for more examples.';
            }
        });
}());
