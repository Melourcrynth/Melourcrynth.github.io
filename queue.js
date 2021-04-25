(function () {
    'use strict';

    const contextByType = {
        sketch:   'success',
        drawing:  'primary',
        painting: 'danger',
        story:    'warning',
    };

    const uls = {
        todo:  document.getElementById( 'todo-column'),
        doing: document.getElementById('doing-column'),
        done:  document.getElementById( 'done-column'),
    };

    function addLoading(ul) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = 'Loading...';
        ul.appendChild(li);
    }

    function displayLoading() {
        for (const key of Object.keys(uls)) {
            addLoading(uls[key]);
        }
    }

    function addTask(ul, task) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between',
                         'align-items-center', 'border-secondary', 'text-dark',
                         'list-group-item-' + contextByType[task.type]);
        li.textContent = task.codename;

        const span = document.createElement('span');
        span.classList.add('badge', 'badge-dark');
        span.textContent = task.type;
        li.appendChild(span);

        ul.appendChild(li);
    }

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

    function display(data) {
        for (const key of Object.keys(uls)) {
            const ul = uls[key];
            ul.removeChild(ul.firstChild);
            for (const task of data[key]) {
                addTask(ul, task);
            }
        }

        const footer = document.getElementById('footer');
        footer.textContent = 'Updated ' + formatDate(data.updated) + '.';
    }

    function displayError() {
        const div = document.createElement('div');
        div.classList.add('alert', 'alert-danger', 'mt-4');
        div.textContent = 'Loading queue data failed.';
        document.getElementById('main-container').prepend(div);

        for (const key of Object.keys(uls)) {
            const li = uls[key].firstChild;
            li.textContent = 'Failed to load.';
        }
    }

    displayLoading();

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                display(JSON.parse(xhr.responseText));
            }
            else {
                displayError();
            }
        }
    };
    xhr.open('GET', 'queue.json?cachebuster=' + Date.now(), true);
    xhr.send();
}());
