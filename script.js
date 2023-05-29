const generate_hash = document.getElementById("generate_hash");
const hash_algorithm_selection = document.getElementById("hash_algorithm_selection");
const credential_type_username_url = document.getElementById("credential_type_username_url");
const credential_type_url = document.getElementById("credential_type_url");
const credentials_form_username = document.getElementById("credentials_form_username");
const credentials_form_url = document.getElementById("credentials_form_url");
const credentials_form_salt = document.getElementById("credentials_form_salt");
const credentials_form_special_chars = document.getElementById("credentials_form_special_chars");
const enable_special_chars = document.getElementById("enable_special_chars");
const credentials_form_max_length = document.getElementById("credentials_form_max_length");

const salt_start_text = ":START_SALT:";
const display_for_initially_hidden_elements = "inline";

// un-check on F5 refresh (otherwise a radio button can be checked while not credential input fields visible)
credential_type_username_url.checked = false;
credential_type_url.checked = false;

function hasher(str, hash_function) {
    return crypto.subtle.digest(hash_function, new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
}

function limitString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    }

    return str.slice(-maxLength);
}

credential_type_username_url.onclick = () => {
    credentials_form_username.style.display = display_for_initially_hidden_elements;
    credentials_form_url.style.display = display_for_initially_hidden_elements;
    credentials_form_salt.style.display = display_for_initially_hidden_elements;
    credentials_form_special_chars.style.display = display_for_initially_hidden_elements;
    generate_hash.style.display = display_for_initially_hidden_elements;
    credentials_form_max_length.style.display = display_for_initially_hidden_elements;
}

credential_type_url.onclick = () => {
    credentials_form_username.style.display = "none";
    credentials_form_salt.style.display = display_for_initially_hidden_elements;
    credentials_form_url.style.display = display_for_initially_hidden_elements;
    credentials_form_special_chars.style.display = display_for_initially_hidden_elements;
    generate_hash.style.display = display_for_initially_hidden_elements;
    credentials_form_max_length.style.display = display_for_initially_hidden_elements;
}

generate_hash.onclick = async () => {
    let hash_result = document.getElementById("hash_result");
    let url_input = document.getElementById("url_input");
    let salt_input = document.getElementById("salt_input");

    let special_chars = enable_special_chars.checked ? "!#*" : "";
    let max_length = document.getElementById("max_password_length").value;

    if (credential_type_username_url.checked) {
        let username_input = document.getElementById("username_input")
        let generated_password = (await hasher(
            username_input.value + "@" + url_input.value + salt_start_text + salt_input.value,
            hash_algorithm_selection.options[hash_algorithm_selection.selectedIndex].value)).toString();
        hash_result.innerHTML = limitString(generated_password + special_chars, max_length);

    } else if (credential_type_url.checked) {
        let generated_password = (await hasher(
            url_input.value + salt_start_text + salt_input.value,
            hash_algorithm_selection.options[hash_algorithm_selection.selectedIndex].value)).toString();
        hash_result.innerHTML = limitString(generated_password + special_chars, max_length);
    } else {
        return;
    }
    document.getElementById("hash_result_title").style.display = "block";
    hash_result.style.display = display_for_initially_hidden_elements;
}

