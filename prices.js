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

    const updatedElement = document.getElementById('update-datetime');
    updatedElement.textContent = formatDate(updatedElement.textContent);
}());
