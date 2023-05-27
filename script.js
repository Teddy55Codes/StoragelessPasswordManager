let generate_button =  document.getElementById("generate_hash");
let url_input = document.getElementById("url_input");
let hash_result_text = document.getElementById("hash_result");
let hash_result_title = document.getElementById("hash_result_title");
let hash_algorithm_selection = document.getElementById("hash_algorithm_selection");

function hasher(str, hash_function) {
  return crypto.subtle.digest(hash_function, new TextEncoder("utf-8").encode(str)).then(buf => {
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
  });
}

generate_button.onclick = async () => {
  hash_result_text.innerText = (await hasher(url_input.value, hash_algorithm_selection.options[hash_algorithm_selection.selectedIndex].value)).toString();
  hash_result_title.style.visibility='visible';
}

