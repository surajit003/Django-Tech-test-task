function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, prop] of formData) {
        data[key] = prop;
    }
    return data;
}

function showFormErrors(errors) {
    let msg = '';
    Object.keys(errors).forEach(key => msg += key + ': ' + errors[key] + '\n');
    alert(msg);
}

function updateFirstTextNode(element, content) {
    // replace only the first text node with the new text, leave the icon and other content as it is
    // used to set only the button's text to "Loading..."
    for (let i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeType === 3 && element.childNodes[i].textContent.trim()) {
            element.childNodes[i].textContent = content;
            break;
        }
    }
}

function setFormLoading(form, loading) {
    const submitButtons = form.querySelectorAll('button[type=submit]');
    if (loading) {
        submitButtons.forEach(submitButton => {
            submitButton.setAttribute('disabled', 'disabled');
            submitButton.dataset.originalhtml = submitButton.innerHTML;
            this.updateFirstTextNode(submitButton, 'Loading...');
        });
    } else {
        submitButtons.forEach(submitButton => {
            submitButton.removeAttribute('disabled');
            if (submitButton.dataset.originalhtml) {
                submitButton.innerHTML = submitButton.dataset.originalhtml;
            }
        });
    }
}

function validateEmail(email) {
    email = email.trim();
    if (!email) {
        return false;
    }
    if (email.indexOf(' ') > 0 || email.indexOf('<') > -1) {
        return /^[^<>]+\s*<[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*>$/
            .test(email.toLowerCase());
    } else {
        const emailAddressRe = /<?(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))>?$/;
        // const emailAddressRe = /<?[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>?$/;
        // const emailAddressRe = /<?[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*>?$/;
        return emailAddressRe.test(email.toLowerCase());
    }
}

function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function getUrlVars() {
    let vars = {}
    let hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash.length === 2) {
            vars[hash[0]] = hash[1].split('#')[0];
        }
    }
    return vars;
}

function encodeDataToQueryString(data) {
    return Object
        .keys(data)
        .map(value => `${value}=${encodeURIComponent(data[value])}`)
        .join('&');
}

function redirectUrl(baseUrl = null, encodedQueryString = null) {
    if (baseUrl == null) {
        baseUrl = `${window.location.origin}${window.location.pathname}`;
    }
    if (encodedQueryString != null) {
        baseUrl = `${baseUrl}?${encodedQueryString}`
    }
    location.href = baseUrl;
}

function convertArrayToJson(arr) {
    result = []
    for (var i = 0; i < arr.length; i++) {
        result.push(
            {"id": arr[i]}
        )
    }
    return result
}