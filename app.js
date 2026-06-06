"use strict";

const HASHCAT_MODES = {
  MD5: 0,
  "SHA-1": 100,
  MySQL323: 200,
  MySQL5: 300,
  phpass: 400,
  md5crypt: 500,
  "MD4": 900,
  NTLM: 1000,
  "SHA-224": 1300,
  "SHA-256": 1400,
  "DES crypt": 1500,
  "Apache MD5-crypt": 1600,
  "SHA-512": 1700,
  "SHA-512 crypt": 1800,
  "Domain Cached Credentials 2": 2100,
  "LM": 3000,
  bcrypt: 3200,
  NetNTLMv1: 5500,
  NetNTLMv2: 5600,
  "RIPEMD-160": 6000,
  Whirlpool: 6100,
  "Drupal7": 7900,
  "SHA-256 crypt": 7400,
  "scrypt": 8900,
  "Django PBKDF2-SHA256": 10000,
  "PBKDF2-SHA256": 10900,
  "SHA-384": 10800,
  "Argon2id": 82000,
  "Argon2i": 70000,
};

const JOHN_FORMATS = {
  MD5: "raw-md5",
  "SHA-1": "raw-sha1",
  "SHA-224": "raw-sha224",
  "SHA-256": "raw-sha256",
  "SHA-384": "raw-sha384",
  "SHA-512": "raw-sha512",
  NTLM: "NT",
  "MD4": "raw-md4",
  bcrypt: "bcrypt",
  "Argon2id": "argon2",
  "Argon2i": "argon2",
  "Argon2d": "argon2",
  "scrypt": "scrypt",
  md5crypt: "md5crypt",
  "Apache MD5-crypt": "md5crypt",
  "SHA-256 crypt": "sha256crypt",
  "SHA-512 crypt": "sha512crypt",
  phpass: "phpass",
  "MySQL5": "mysql-sha1",
  "DES crypt": "descrypt",
  NetNTLMv1: "netntlm",
  NetNTLMv2: "netntlmv2",
};

const DIFFICULTY = {
  MD5: "Very fast",
  "MD4": "Very fast",
  NTLM: "Very fast",
  "SHA-1": "Fast",
  "SHA-224": "Fast",
  "SHA-256": "Fast",
  "SHA-384": "Fast",
  "SHA-512": "Fast",
  MySQL323: "Very fast",
  MySQL5: "Fast",
  "DES crypt": "Legacy slow",
  md5crypt: "Moderate",
  "Apache MD5-crypt": "Moderate",
  "SHA-256 crypt": "Moderate",
  "SHA-512 crypt": "Moderate",
  phpass: "Moderate",
  bcrypt: "Slow",
  "Argon2id": "Memory-hard",
  "Argon2i": "Memory-hard",
  "Argon2d": "Memory-hard",
  scrypt: "Memory-hard",
  NetNTLMv1: "Protocol hash",
  NetNTLMv2: "Protocol hash",
};

const PREFIX_RULES = [
  ["$argon2id$", "Argon2id", "PHC string for Argon2id, a modern memory-hard password hash."],
  ["$argon2i$", "Argon2i", "PHC string for Argon2i, side-channel resistant Argon2 variant."],
  ["$argon2d$", "Argon2d", "PHC string for Argon2d, GPU-resistant Argon2 variant."],
  ["$2y$", "bcrypt", "bcrypt variant used by PHP and crypt_blowfish."],
  ["$2b$", "bcrypt", "bcrypt current variant with embedded cost and salt."],
  ["$2a$", "bcrypt", "bcrypt legacy variant with embedded cost and salt."],
  ["$2x$", "bcrypt", "bcrypt compatibility variant seen in older PHP systems."],
  ["$scrypt$", "scrypt", "scrypt password hash with tunable CPU and memory cost."],
  ["$7$", "scrypt", "Unix crypt-style scrypt format."],
  ["$6$", "SHA-512 crypt", "Unix crypt SHA-512 password hash."],
  ["$5$", "SHA-256 crypt", "Unix crypt SHA-256 password hash."],
  ["$1$", "md5crypt", "Unix MD5-crypt or Cisco-IOS type 5 password hash."],
  ["$apr1$", "Apache MD5-crypt", "Apache htpasswd MD5-crypt format."],
  ["$P$", "phpass", "Portable PHP password hash used by WordPress."],
  ["$H$", "phpass", "Portable PHP password hash used by phpBB."],
  ["$S$", "Drupal7", "Drupal 7 SHA-512 based password hash."],
  ["pbkdf2_sha256$", "Django PBKDF2-SHA256", "Django default PBKDF2-HMAC-SHA256 format."],
  ["pbkdf2_sha1$", "Django PBKDF2-SHA1", "Django legacy PBKDF2-HMAC-SHA1 format."],
  ["sha1$", "Django salted SHA-1", "Django legacy salted SHA-1 format."],
  ["md5$", "Django salted MD5", "Django legacy salted MD5 format."],
  ["{SSHA}", "LDAP salted SHA-1", "LDAP salted SHA-1 wrapper."],
  ["{SHA}", "LDAP SHA-1", "LDAP SHA-1 wrapper."],
  ["{MD5}", "LDAP MD5", "LDAP MD5 wrapper."],
  ["$DCC2$", "Domain Cached Credentials 2", "Windows cached domain credential format."],
  ["$pbkdf2-sha256$", "PBKDF2-SHA256", "Passlib PBKDF2-HMAC-SHA256 format."],
  ["$pbkdf2$", "PBKDF2-SHA1", "Atlassian-style PBKDF2 format."],
];

const HEX_LENGTH_RULES = {
  16: ["MySQL323", "CRC-64", "Half MD5", "LM"],
  24: ["Tiger-128"],
  32: ["MD5", "NTLM", "MD4", "RIPEMD-128"],
  40: ["SHA-1", "RIPEMD-160", "MySQL5"],
  48: ["Tiger-192", "Haval-192"],
  56: ["SHA-224", "SHA3-224"],
  64: ["SHA-256", "SHA3-256", "BLAKE2s-256", "RIPEMD-256"],
  80: ["RIPEMD-320"],
  96: ["SHA-384", "SHA3-384"],
  128: ["SHA-512", "SHA3-512", "BLAKE2b-512", "Whirlpool"],
};

const EXAMPLES = [
  {
    name: "MD5",
    value: "5f4dcc3b5aa765d61d8327deb882cf99",
  },
  {
    name: "SHA-256",
    value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    name: "bcrypt",
    value: "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQNQy.uK4Of2T7G.VHvgvWK",
  },
  {
    name: "Argon2id",
    value: "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ubbdWRWJTmaaJObG",
  },
  {
    name: "MySQL5",
    value: "*94BDCEBE19083CE2A1F959FD02F964C7AF4CFC29",
  },
  {
    name: "JWT hint",
    value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U",
  },
];

const input = document.querySelector("#hash-input");
const form = document.querySelector("#hash-form");
const results = document.querySelector("#results");
const resultTitle = document.querySelector("#result-title");
const resultCount = document.querySelector("#result-count");
const clearButton = document.querySelector("#clear-button");
const copyButton = document.querySelector("#copy-button");
const exampleGrid = document.querySelector("#example-grid");

function isHex(text) {
  return /^[0-9a-fA-F]+$/.test(text);
}

function isUpperHex(text) {
  return /^[0-9A-F]+$/.test(text);
}

function isDesCrypt(text) {
  return /^[./0-9A-Za-z]{13}$/.test(text);
}

function isBase58(text) {
  return text.length >= 26 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(text);
}

function isBase32(text) {
  return text.length >= 16 && /^[A-Z2-7]+=*$/.test(text) && /[2-7]/.test(text);
}

function parseBcryptCost(text) {
  const match = text.match(/^\$2[abxy]\$(\d{2})\$/);
  if (!match) {
    return "";
  }
  const cost = Number(match[1]);
  if (cost < 10) {
    return ` cost=${cost}; below the common modern minimum of 10.`;
  }
  if (cost >= 14) {
    return ` cost=${cost}; intentionally expensive to verify.`;
  }
  return ` cost=${cost}; typical modern bcrypt work factor.`;
}

function parseArgonParams(text) {
  const match = text.match(/^\$argon2(?:id|i|d)\$v=\d+\$([^$]+)\$/);
  if (!match) {
    return "";
  }
  return ` parameters: ${match[1]}.`;
}

function commandSet(algorithm, mode, value) {
  const commands = [];
  if (mode !== null) {
    commands.push({
      label: "Hashcat",
      value: `hashcat -m ${mode} -a 0 hashes.txt wordlist.txt`,
    });
  }

  if (JOHN_FORMATS[algorithm]) {
    commands.push({
      label: "John",
      value: `john --format=${JOHN_FORMATS[algorithm]} --wordlist=wordlist.txt hashes.txt`,
    });
  }

  if (!commands.length || algorithm.includes("not a hash") || algorithm.startsWith("PHC string")) {
    return [];
  }

  commands.push({
    label: "Single hash file",
    value: `printf '%s\\n' '${value.replaceAll("'", "'\\''")}' > hashes.txt`,
  });

  return commands;
}

function candidate(algorithm, confidence, reason, rawValue) {
  const mode = HASHCAT_MODES[algorithm] ?? null;
  return {
    algorithm,
    confidence,
    reason,
    mode,
    johnFormat: JOHN_FORMATS[algorithm] ?? null,
    difficulty: DIFFICULTY[algorithm] ?? "Unknown",
    commands: commandSet(algorithm, mode, rawValue),
  };
}

function identifyHash(rawValue) {
  const text = rawValue.trim();
  if (!text) {
    return [];
  }

  for (const [prefix, algorithm, note] of PREFIX_RULES) {
    if (text.startsWith(prefix)) {
      const parameterNote =
        algorithm === "bcrypt" ? parseBcryptCost(text) : parseArgonParams(text);
      return [candidate(algorithm, "high", `Prefix ${prefix}: ${note}${parameterNote}`, text)];
    }
  }

  if (/^https?:\/\//i.test(text)) {
    return [candidate("URL (not a hash)", "low", "Starts with a web URL scheme, so it is probably a link pasted by mistake.", text)];
  }

  if (/^0x[0-9a-fA-F]+$/.test(text)) {
    return [candidate("0x-prefixed hex (not a raw hash)", "low", "Looks like an Ethereum address, memory address, or prefixed hex value.", text)];
  }

  if (/^\*[0-9A-F]{40}$/.test(text)) {
    return [candidate("MySQL5", "high", "Asterisk plus 40 uppercase hex characters is the MySQL 4.1/MySQL5 password format.", text)];
  }

  if (text.includes("::") && (text.match(/:/g) || []).length >= 4) {
    const parts = text.split(":");
    if (parts.length >= 6 && parts[4]?.length === 32 && isHex(parts[4])) {
      return [candidate("NetNTLMv2", "high", "Colon-separated NetNTLMv2 challenge/response with a 32-hex HMAC field.", text)];
    }
    if (parts.length >= 6 && parts[3]?.length === 48 && isHex(parts[3])) {
      return [candidate("NetNTLMv1", "high", "Colon-separated NetNTLMv1 record with a 48-hex response field.", text)];
    }
  }

  if (isDesCrypt(text)) {
    return [candidate("DES crypt", "medium", "13 characters from the traditional Unix crypt alphabet ./0-9A-Za-z.", text)];
  }

  if (isHex(text)) {
    const algorithms = HEX_LENGTH_RULES[text.length] || [];
    return algorithms.map((algorithm, index) => {
      const confidence = index === 0 ? "medium" : "low";
      const label = index === 0 ? "most common candidate" : "also possible";
      return candidate(
        algorithm,
        confidence,
        `${text.length} hex characters (${text.length * 4} bits): ${label} at this length.`,
        text
      );
    });
  }

  if (/^\$[A-Za-z0-9_-]+\$/.test(text)) {
    const name = text.slice(1).split("$", 1)[0];
    return [candidate(`PHC string (${name})`, "low", "Starts like a PHC/modular crypt string, but no specific rule matched.", text)];
  }

  if (text.startsWith("eyJ") && text.includes(".")) {
    return [candidate("JWT (not a hash)", "low", "Starts like a base64url-encoded JSON Web Token header.", text)];
  }

  if (isBase32(text)) {
    return [candidate("Base32 blob (not a hash)", "low", "Uppercase A-Z and digits 2-7 suggest Base32, such as a TOTP secret.", text)];
  }

  if (isBase58(text)) {
    return [candidate("Base58 blob (not a hash)", "low", "Base58-style alphabet suggests an address or encoded identifier.", text)];
  }

  if (/[+/=]/.test(text) && text.length > 8) {
    return [candidate("Base64 blob (not a hash)", "low", "Contains Base64 characters and padding; likely encoded data rather than a raw hash.", text)];
  }

  return [];
}

function splitInputs(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function inputProfile(value) {
  const text = value.trim();
  const charset = isHex(text)
    ? "hex"
    : /^[A-Za-z0-9+/=_-]+$/.test(text)
      ? "base64/base64url-like"
      : "mixed";
  return {
    length: text.length,
    bits: isHex(text) ? text.length * 4 : null,
    charset,
    hasPrefix: /^[{$]/.test(text) || text.includes("$"),
  };
}

function renderResults(items) {
  const totalMatches = items.reduce((sum, item) => sum + item.candidates.length, 0);
  resultTitle.textContent = items.length ? "Analysis complete" : "Ready";
  resultCount.textContent = `${totalMatches} ${totalMatches === 1 ? "match" : "matches"}`;

  if (!items.length) {
    results.className = "results empty-state";
    results.innerHTML = "<p>Paste a hash and run identification. The input box starts clear and nothing leaves your browser.</p>";
    return;
  }

  results.className = "results";
  results.innerHTML = items
    .map((item, itemIndex) => {
      const profile = inputProfile(item.value);
      const profileChips = [
        `${profile.length} chars`,
        profile.bits === null ? profile.charset : `${profile.bits} bits`,
        profile.charset,
        profile.hasPrefix ? "prefix signal" : "no prefix",
      ];
      const candidates =
        item.candidates.length > 0
          ? item.candidates
              .map(
                (entry) => `
                  <div class="candidate">
                    <div class="candidate-main">
                      <strong>${escapeHtml(entry.algorithm)}</strong>
                      <span class="confidence ${entry.confidence}">${entry.confidence}</span>
                      ${
                        entry.mode === null
                          ? ""
                          : `<span class="mode-pill">hashcat -m ${entry.mode}</span>`
                      }
                      ${
                        entry.johnFormat === null
                          ? ""
                          : `<span class="mode-pill">john ${escapeHtml(entry.johnFormat)}</span>`
                      }
                      <span class="difficulty-pill">${escapeHtml(entry.difficulty)}</span>
                    </div>
                    <p class="reason">${escapeHtml(entry.reason)}</p>
                    ${
                      entry.commands.length
                        ? `<div class="command-box">
                            <p>Authorized testing commands</p>
                            ${entry.commands
                              .map(
                                (command) => `
                                  <div class="command-row">
                                    <span>${escapeHtml(command.label)}</span>
                                    <code>${escapeHtml(command.value)}</code>
                                  </div>
                                `
                              )
                              .join("")}
                          </div>`
                        : ""
                    }
                  </div>
                `
              )
              .join("")
          : `
              <div class="candidate">
                <div class="candidate-main">
                  <strong>Unknown</strong>
                  <span class="confidence none">no match</span>
                </div>
                <p class="reason">No prefix, known pattern, or supported hex length matched. This may be truncated, encoded, custom, or not a hash.</p>
              </div>
            `;

      return `
        <article class="result-card" style="--entry-delay: ${Math.min(itemIndex * 70, 420)}ms">
          <div class="result-card-header">
            <div>
              <div class="hash-preview">${escapeHtml(item.value)}</div>
              <div class="profile-chips">
                ${profileChips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}
              </div>
            </div>
          </div>
          <div class="candidate-list">${candidates}</div>
        </article>
      `;
    })
    .join("");
}

function runIdentification() {
  const lines = splitInputs(input.value);
  const analyzed = lines.map((value) => ({
    value,
    candidates: identifyHash(value),
  }));
  renderResults(analyzed);
  return analyzed;
}

function reportText() {
  const analyzed = runIdentification();
  return analyzed
    .map((item) => {
      const candidates = item.candidates.length
        ? item.candidates
            .map((entry) => {
              const mode = entry.mode === null ? "no hashcat mode" : `hashcat -m ${entry.mode}`;
              const commands = entry.commands.length
                ? `\n  Commands:\n${entry.commands.map((command) => `  - ${command.label}: ${command.value}`).join("\n")}`
                : "";
              return `- ${entry.algorithm} (${entry.confidence}, ${mode}, difficulty: ${entry.difficulty}): ${entry.reason}${commands}`;
            })
            .join("\n")
        : "- Unknown: no supported pattern matched.";
      return `${item.value}\n${candidates}`;
    })
    .join("\n\n");
}

function loadExamples() {
  exampleGrid.innerHTML = EXAMPLES.map(
    (example) => `
      <button class="example-button" type="button" data-value="${escapeHtml(example.value)}">
        <strong>${escapeHtml(example.name)}</strong>
        <span>${escapeHtml(example.value)}</span>
      </button>
    `
  ).join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runIdentification();
});

clearButton.addEventListener("click", () => {
  input.value = "";
  renderResults([]);
  input.focus();
});

copyButton.addEventListener("click", async () => {
  const text = reportText();
  if (!text) {
    return;
  }
  await navigator.clipboard.writeText(text);
  copyButton.textContent = "Copied";
  window.setTimeout(() => {
    copyButton.textContent = "Copy report";
  }, 1400);
});

exampleGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-value]");
  if (!button) {
    return;
  }
  input.value = button.dataset.value;
  document.querySelector("#tool").scrollIntoView({ behavior: "smooth", block: "start" });
  runIdentification();
});

loadExamples();
renderResults([]);
