# Quote of the day

The right quote can motivate me anyday. I want a way to see my quotes frequently.

This is my hacky attempt to show the quotes I like on my website and eventually as a widget on my phone. 

Goal: randomly pick a quote for the day from all the stored quotes.

## Show quotes on your website.
We will use custom JavaScript and HTML to quickly read the json and parse a quote. 

```js
document.addEventListener("DOMContentLoaded", function () {
  fetch('https://raw.githubusercontent.com/svaderia/quote-of-the-day/main/quotes.json')
    .then(response => response.json())
    .then(quotes => {
      const today = new Date().toISOString().split('T')[0];
      const seed = today.split('-').join('');
      const randomIndex = Math.floor(seededRandom(seed) * quotes.length);
      const randomQuote = quotes[randomIndex];
      document.getElementById('quote').innerText = randomQuote.quote;
      document.getElementById('attribution').innerText = "- " + randomQuote.attribution;
    })
    .catch(error => console.error('Error fetching the quote:', error));
});

// https://stackoverflow.com/a/19303725
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
```
Change the link to the raw `quotes.json` of your repository. 

Add the following HTML to your markdown/html file.

```html
<script src="{{ '/assets/js/quote.js' | relative_url }}"></script>

<div>
<div class="quote-of-the-day notice">
    <p id="quote">Loading</p>
    <footer id="attribution"></footer>
</div>
<p class="quote-info"><a href="/path-to-your-post">What's this?</a></p>
</div>
```
The `src` in above `script` tag is in `liquid` format for it to work well with my jekyll setup. You should define the way that works for your setup.  
The `<p>` tag at the end points to the link of the blog where I explain the motivation of doing this.

The quotes are shown on my [website](svaderia.github.io).  
See [this](https://github.com/svaderia/svaderia.github.io/commit/9704cadbca356e3d4b092c17d6bd988513c11695) for more details on CSS.


## Show quotes on your iPhone with custom widget
> TODO
