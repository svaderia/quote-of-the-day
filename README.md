> Here is a 3 part blog post that talks about the project [Bringing Motivation to Your Day: Quote of the Day Project](https://svaderia.github.io/articles/bringing-motivation-to-your-day-quote-of-the-day-project/)
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
Checkout the awesome [Sciptable](https://scriptable.app/) project. 
It runs the JavaScript code on your iPhone and includes some custom APIs to modify the widget.
We can use it to create a widget that pulls the data form the `quote.json` like our website and show it on the widget.

Following is the javascript code that does this.

```javascript
const URL = 'https://raw.githubusercontent.com/svaderia/quote-of-the-day/main/quotes.json';

// Fetch quotes
const response = await new Request(URL).loadJSON();
const quotes = response;

// Get today's date and create a seed
const today = new Date().toISOString().split('T')[0];
const seed = today.split('-').join('');

// Generate a seeded random number
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const randomIndex = Math.floor(seededRandom(seed) * quotes.length);
const randomQuote = quotes[randomIndex];

// Create widget
let widget = new ListWidget();

// Set semi-transparent background color
widget.backgroundColor = new Color("#000000", 0.3); // Black color with 50% opacity

// Add quote text
let quoteText = widget.addText(randomQuote.quote);
quoteText.textColor = Color.white();
quoteText.font = Font.boldSystemFont(16);
quoteText.centerAlignText();

// Add attribution text
let attributionText = widget.addText("- " + randomQuote.attribution);
attributionText.textColor = Color.gray();
attributionText.font = Font.italicSystemFont(12);
attributionText.centerAlignText();

// Set the widget
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}

Script.complete();
```

## Add a new quote
Now we need to make it easier to add new quotes. As usual let's make a quick python script. See `scripts/bin/qt` file.

After that, I ran `stow --target=$HOME scripts` to make a symlink in my `$HOME/bin` folder. so now I can add new quotes easily with `qt` command.
