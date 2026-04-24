function formatJson() {
  const input = document.querySelector('#jsonInput').value;
  const output = document.querySelector('#jsonOutput');
  try {
    output.textContent = JSON.stringify(JSON.parse(input), null, 2);
  } catch (error) {
    output.textContent = `JSON inválido: ${error.message}`;
  }
}

function encodeBase64() {
  const input = document.querySelector('#baseInput').value;
  document.querySelector('#baseOutput').textContent = btoa(unescape(encodeURIComponent(input)));
}

function decodeBase64() {
  const input = document.querySelector('#baseInput').value;
  try {
    document.querySelector('#baseOutput').textContent = decodeURIComponent(escape(atob(input)));
  } catch (error) {
    document.querySelector('#baseOutput').textContent = `Base64 inválido: ${error.message}`;
  }
}

function generateUuid() {
  document.querySelector('#utilsOutput').textContent = crypto.randomUUID();
}

function timestampNow() {
  document.querySelector('#utilsOutput').textContent = Math.floor(Date.now() / 1000).toString();
}
