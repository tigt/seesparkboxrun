See Sparkbox Run
================

Proof-of-concept for making seesparkbox.com load hecka fast, without sacrificing prettiness, functionality, or browser support.

| :sparkles: | :zap::package: | :zap::package::dash: |
|------------|------|-----|
| **Live Site** | [seesparkbox.com](https://seesparkbox.com/) | [seesparkboxrun.ti.gt](https://seesparkboxrun.ti.gt/) |
| **WebPageTest** |[result/160519_KN_6RA](http://www.webpagetest.org/result/160519_KN_6RA/) | [result/160519_RG_6PD](https://www.webpagetest.org/result/160519_RG_6PD/) |

Takeaways
---------

The real site has much more responsibility than mine. I had luxuries:

* Only did the home page
* Flat files, instead of cooperating with backend systems
* [2 years after y'all did](http://building.seesparkbox.com/), so I enjoy increased browser support for many things

Still, the same principles apply, and I found some low-hanging fruit which should be useful. Also, I had to debug obfuscated JavaScript, which wasn't the *most* fun thing I've ever done.

All metrics were recorded on WebPageTest's Chrome with 3G connection-shaping. Originally I was testing HTTP vs. HTTP, but seesparkbox.com started redirecting HTTPS-only around yesterday, so that's a bust.

These numbers were a *lot* more impressive on HTTP.

| Metric            | Then      | Now     |
|-------------------|-----------|---------|
| First paint       | 2.6s      | 2s      |
| Visually complete | 6.9s      | 3.9s    |
| Speed Index       | 2711      | 2118    |
| DOMInteractive    | 3.5s      | 2.1s    |
| Load complete     | 12.6s     | 6.6s    |
| Size              | 1,755kB   | 328kB   |
| Requests          | 25        | 17      |
| Cost              | [11¢][$$] | [2¢][$] |

[$$]: https://whatdoesmysitecost.com/test/160516_DG_P5D
[$]: https://whatdoesmysitecost.com/test/160519_RG_6PD

Commit Style
------------

See [Git Commit Style](https://github.com/sparkbox/standard/tree/master/style/git#the-art-of-the-commit-message).

Technologies Used
-----------------

* Images
  + ImageAlpha
  + ImageOptim
  + The GIMP
  + Inkscape
  + SVGOMG
* Webfonts
  + FontSquirrel
  + FontForge
  + TTX
* Miscellaneous
  + Wget
  + Zopfli
  + Atom (especially the Search In Directory feature)

Team Members
------------

* Sparkbox (built the site)
* Taylor Hunt (hacked at the site)
