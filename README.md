# Hash Identifier

A static, GitHub Pages-ready web application that identifies likely hash types from:

- Prefixes such as `$argon2id$`, `$2b$`, `$6$`, `$P$`, and Django/LDAP wrappers
- Known patterns such as MySQL5, NetNTLMv1/v2, and DES crypt
- Hex digest length and character set
- Common non-hash inputs such as JWTs, URLs, Base32, Base58, and Base64 blobs

The app runs fully in the browser. It does not upload, crack, reverse, or store hashes.

## Project Files

- `index.html` - app markup and about page
- `styles.css` - responsive UI styling
- `app.js` - hash detection rules and UI logic
- `.nojekyll` - keeps GitHub Pages from applying Jekyll processing

## Hosting On GitHub Pages

1. Push this folder to a GitHub repository.
2. Open repository **Settings**.
3. Go to **Pages**.
4. Set the source to the `main` branch and root folder.
5. Save, then open the Pages URL GitHub gives you.

## Credit

Created for Chanuka Isuru Sampath (RIO6IX).

- LinkedIn: <https://www.linkedin.com/in/chanuka-isuru-sampath/>
- GitHub: <https://github.com/RIO6IX>
- Medium: <https://medium.com/@chanuka1>
- Portfolio Website: <https://rio6ix.github.io/chanuka/>
- Youtube: <https://www.youtube.com/@chanukaisuru0>
- Medium Blog: <https://chanuka1.medium.com/>

## Research References

- OWASP Password Storage Cheat Sheet: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- hashcat example hashes and mode numbers: <https://hashcat.net/wiki/doku.php?id=example_hashes>
