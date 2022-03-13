function getJSON(url) {
    const self = this;
    return fetch(url)
        .then(function (response) {
            if (response.status !== 200) {
                throw new Error(response.status + ', ' + response.statusText);
            }
            if (!self.isJSON(response)) {
                throw new TypeError('Unexpected content type from the server');
            }
            return response.json();
        });
}

function get(url) {
    return fetch(url)
        .then(response => {
            return response
        });
}

function basicPOSTFetchOptions() {
    return {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
    };
}

function isJSON(response) {
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json');
}

function post(url, fetchOptions) {
    const self = this;
    return fetch(url, fetchOptions)
        .then(function (response) {
            if (response.status !== 201) {
                throw new Error(response.status + ', ' + response.statusText);
            }
            if (!self.isJSON(response)) {
                throw new TypeError('Unexpected content type from the server');
            }
            return response;
        });
}

function postJSON(url, body) {
    const fetchOptions = this.basicPOSTFetchOptions();
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.headers['Accept'] = 'application/json';
    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }
    return this.post(url, fetchOptions);
}

function postForm(url, body) {
    const options = {
        method: 'POST',
        credentials: 'same-origin',
        body: body,
    }
    return fetch(url, options);
}
