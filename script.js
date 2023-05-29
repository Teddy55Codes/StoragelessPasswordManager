const generate_hash = document.getElementById("generate_hash");
const hash_algorithm_selection = document.getElementById("hash_algorithm_selection");
const credential_type_username_url = document.getElementById("credential_type_username_url");
const credential_type_url = document.getElementById("credential_type_url");
const enable_special_chars = document.getElementById("enable_special_chars");

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

function makeFormVisible() {
    document.getElementById("generation_card").style.display = "block"
    generate_hash.style.display = display_for_initially_hidden_elements;
}

credential_type_username_url.onclick = () => {
    document.getElementById("credentials_form_username").style.display = display_for_initially_hidden_elements;
    makeFormVisible();
}

credential_type_url.onclick = () => {
    document.getElementById("credentials_form_username").style.display = "none";
    makeFormVisible();
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

