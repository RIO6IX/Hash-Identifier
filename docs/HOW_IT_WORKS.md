# How It Works

Hash Identifier does not crack hashes. It identifies likely formats by inspecting the visible structure of the string.

## Why Hash Identification Works

Many hash formats leak clues about how they were generated. The most useful clues are:

- Prefix
- Length
- Character set
- Separator pattern
- Known wrapper format

Modern password hashes often identify themselves directly. For example:

```text
$2b$12$...
```

This points to bcrypt.

```text
$argon2id$v=19$m=65536,t=3,p=4$...
```

This points to Argon2id.

Older hashes such as MD5 and SHA-1 usually do not include a prefix. For those, the tool uses length and character set.

## Step 1: Trim Input

The app removes leading and trailing whitespace from each line.

```text
"  5f4dcc3b5aa765d61d8327deb882cf99  "
```

becomes:

```text
5f4dcc3b5aa765d61d8327deb882cf99
```

## Step 2: Prefix Rules

Prefix rules are the strongest evidence.

Examples:

```text
$argon2id$       -> Argon2id
$2b$             -> bcrypt
$6$              -> SHA-512 crypt
$apr1$           -> Apache MD5-crypt
pbkdf2_sha256$   -> Django PBKDF2-SHA256
{SSHA}           -> LDAP salted SHA-1
```

If a prefix matches, the app returns a high-confidence candidate.

## Step 3: Known Pattern Rules

Some formats have distinctive layouts.

Examples:

```text
*94BDCEBE19083CE2A1F959FD02F964C7AF4CFC29
```

This is MySQL5 because it starts with `*` followed by 40 uppercase hex characters.

NetNTLM formats are detected using colon-separated challenge/response patterns.

DES crypt is detected as 13 characters from the traditional Unix crypt alphabet.

## Step 4: Hex Length Rules

If the input is pure hexadecimal, the app checks the length.

```text
32 hex chars  -> MD5, NTLM, MD4, RIPEMD-128
40 hex chars  -> SHA-1, RIPEMD-160
64 hex chars  -> SHA-256, SHA3-256, BLAKE2s-256, RIPEMD-256
96 hex chars  -> SHA-384, SHA3-384
128 hex chars -> SHA-512, SHA3-512, BLAKE2b-512, Whirlpool
```

Length alone is not always unique. For example, MD5, NTLM, and MD4 all produce 32 hex characters. That is why the app shows multiple ranked candidates instead of pretending it knows the exact algorithm.

## Step 5: Generic PHC Fallback

If a string starts like a modular crypt or PHC string but the app does not know the exact format, it reports a low-confidence PHC-style candidate.

Example:

```text
$somehash$params$salt$digest
```

## Step 6: Non-Hash Hints

People often paste encoded data instead of hashes. The app tries to identify those cases.

Examples:

- JWT tokens
- URLs
- Base64 blobs
- Base32 strings
- Base58 identifiers
- `0x` prefixed hex values

These are reported as low-confidence "not a hash" hints.

## Command Templates

When a known algorithm has a Hashcat mode or John the Ripper format, the app displays command templates.

Example:

```bash
hashcat -m 0 -a 0 hashes.txt wordlist.txt
john --format=raw-md5 --wordlist=wordlist.txt hashes.txt
```

These are only templates. The web app does not run them.

## Limitations

Hash identification from shape is not perfect.

Important limitations:

- Algorithms with the same output length can look identical.
- A truncated SHA-256 hash can look like MD5.
- Uppercase and lowercase output can depend on the tool that generated the hash.
- Custom application hashes may not match public formats.
- Encoded data can sometimes look hash-like.

Good security tools should be honest about uncertainty. This app reports confidence levels and evidence so the user can understand why a match was suggested.
