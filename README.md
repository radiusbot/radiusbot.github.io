# Radiusbot developer site

Published at https://radiusbot.github.io/ (GitHub Pages, repo `radiusbot/radiusbot.github.io`, `main` branch, root).

This is the **developer website** listed in the Play Console, the App Store (Marketing URL) and AdMob. Its job is to serve `app-ads.txt` at the domain root, where AdMob looks for it.

| File | What it is |
|---|---|
| `app-ads.txt` | Authorized ad sellers. One line per ad network. The Google line covers both the Android and iOS apps, since both use publisher `pub-1337229327886397`. Add AppLovin's lines here if its dashboard gives you any. |
| `index.html` | Small landing page linking to each app's privacy policy. |

Edit here, then copy the files to the `radiusbot.github.io` repo and push. GitHub Pages updates within a few minutes; AdMob re-crawls within about 24 hours.
