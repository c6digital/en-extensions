# EN Extensions

EN extensions add a number of helpful features to Engaging Networks template development, such as:

- Support for Proxy fields
- Binding field values to text
- Multi-step form support
- Social sharing enhancements
- Support for showing/hiding content based on field values
- Various enhancements to different page types (Donate, ETT, Tweet Target).
- Events for conversions you can hook into to send data to your analytics

ENX aims to be a general purpose library for adding enhancements to Engaging Networks pages that can be controlled via its configuration options through its constructor or via a `window.ENXPageConfig` variable (for per-page configuration). If a component can be used across multiple different Engaging Networks clients and its behaviour can be configured, then it's a good candidate for inclusion in ENX.

Any further customisations should be done via a Client Theme and then hooked into ENX via the lifecycle hooks.

## Development

Clone the repository and run `npm install` to install dependencies.

Run `npm run build` to build the production assets.

Run `npm run watch` to watch for changes during development and rebuild the assets.

## Installation

You can use ENX from NPM, a CDN or by copying the files here directly from the `dist` folder and uploading them to your Engaging Networks account.

Let's cover each scenario:

### NPM

You will need to use a module builder such as ESBuild or Webpack to use the NPM package.

Run `npm install en-extensions` to install the package, then import it into your project.

```javascript
import ENX from 'en-extensions';
```

```css
@import "../node_modules/en-extensions/src/styles/index.css";
/* Your CSS code */
```

### CDN
You can include the latest version of ENX from the jsDelivr CDN.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/en-extensions/dist/enx.min.css">
<script src="https://cdn.jsdelivr.net/npm/en-extensions/dist/enx.min.js"></script>
```

It's recommended to use a versioned URL to ensure your page does not break if a new version of ENX is released.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/en-extensions@0.0.1/dist/enx.min.css">
<script src="https://cdn.jsdelivr.net/npm/en-extensions@0.0.1/dist/enx.min.js"></script>
```

### Direct Download
You can download the files from the `dist` folder and upload them to your Engaging Networks account.

## Usage

If you're using a module builder, you will have imported the ENX class. If you're using a CDN or direct download, you will have access to the global `ENX` class on the `window` object.

Here is an example of how to initialise ENX with a few configuration options. All config options are optional, you can just use `new ENX()` to use the default configuration.

```html
<script>
  new ENX({
     proxies: [
       {
         source: 'transaction.recurrpay', 
         target: 'supporter.NOT_TAGGED_17'
       },
     ],
     beforeInit: () => { console.log('beforeInit') },
     beforeCloakRemoval: () => { console.log('beforeCloakRemoval') },
     afterInit: () => { console.log('afterInit') },
 });
 </script>
```
Refer to the `./src/default-config.js` file for the full list of configuration options and their default values. You can use the configuration object to enable/disable any of the components, to customise their behaviour, or add custom code to run at specific points of ENX's lifecycle.

It is also possible to customise configuration options per page by defining a `window.ENXPageConfig` variable in a code block on your page. Options defined in `window.ENXPageConfig` will override the default options and any global options defined in the `ENX` constructor.

```html
<script>
  window.ENXPageConfig = {
    beforeInit: () => { console.log('Page-specific before init function') },
  };
</script>
```
You can always view the activate config on a page by inspecting the `window.ENXConfig` variable in the console.

## Components

### ENX Cloak

Add `.enx-cloak` to any element you want to be hidden until ENX has finished loading.

## ENX Convert

### Handling conversions

This component will dispatch Events when it believes a conversion has occurred. The following events will be dispatched:

* `synthetic-en:conversion` will be dispatched for all conversions
* `synthetic-en:conversion:{pageType}` will be dispatched for all conversions. {pageType} will be equal to the value of the `pageType` property found in the `pageJson` data.
* `synthetic-en:conversion:group:donation` will be dispatched for conversions on donation, premiumgift or ecommerce page types.
* `synthetic-en:conversion:group:submission` will be dispatched for conversions on all other page types.

To handle a conversion, you can listen for these events in your template code and handle them according to your own needs (for example, sending the conversion to an analytics service):

```js
window.addEventListener("synthetic-en:conversion", () => {
  // your code here
});
```

### Overriding default conversion detection

To prevent the library dispatching a conversion event on a specific page, add a code block with the following content to the subpage where the conversion would happen:

```html
<script>
  window.ENConversion_DontConvert = true;
</script>
```

To have the library dispatch a conversion event on a page where it normally would not, add a code block with the following content to the subpage where you would like that to happen:

```html
<script>
  window.ENConversion_Convert = true;
</script>
```

### Manually triggering a conversion

If you wish to manually trigger a conversion, you can use the `convert` function of the library directly:

```js
ENX.enxConvert.convert()
```

### ENX Donate

This component contains a few functions that run automatically for donation page enhancement. They don't require any configuration.

### ENX Email Target

Enhances ETT pages by adding a photo of the Member of Parliament (Westminster) who is the target. To add this functionality, add the following HTML to your page template:

```html
<img alt="Photo of {contact_data~firstName} {contact_data~lastName}" data-mp-location="{contact_data~organization}" data-mp-name="{contact_data~firstName} {contact_data~lastName}" height="auto" src="https://members-api.parliament.uk/api/Members/1/Thumbnail" width="30px" />
```

### ENX HTML

Copy the HTML content of an element to another element. e.g. an element with the class name `enx-html[source=campaign-content]` will copy the HTML content of the element with the class `campaign-content` to the element with the class name `enx-html[source=campaign-content]`.

### ENX Model

One-way bind the text content of an element to the value of a form field. e.g. an element with the class name `enx-model[source=supporter.firstName]` will be bound to the value of the input with the name `supporter.firstName`.

### ENX Multistep Form

This component allows you to create multi-step forms in Engaging Networks.

To get started, add several "advanced row" components to your page. Each row of the multi-step must have the class `enx-multistep[name=section-name]` where `section-name` is a name given to this step. For example, `enx-multistep[name=payment]`.

You can also add the `[force-start=true]` attribute to your section class name to force that section to load first. For example, `enx-multistep[name=payment][force-start=true]`.

You can load a page add a specific section by using it's name in the URL hash. For example, `https://yourendomain.com/page/12345#payment`.

To navigate between sections, add a button, in a code block, with the class `enx-multistep:button[destination=section-name]` where `section-name` is the name of the section you want to navigate to. For example, `enx-multistep:button[destination=payment]`.

By default, the fields visible in the section are validated when clicking the button before changing to the destination section. But validation can be skipped, by adding the `[no-validate=true]` attribute to the button class. For example `enx-multistep:button[destination=payment][no-validate=true]`. This won't disable EN's server-side validation.

### ENX Proxy Fields

This class binds the value of a field to to another field.

To use in, pass in an array of objects with the following structure via the ENX constructor or `window.ENXPageConfig`.

```javascript
proxies: [{
  source: 'transaction.recurrpay', 
  target: 'supporter.NOT_TAGGED_17'
}]
```

It's also possible to create these without adding code by setting your target field's label to `enx-proxy[source=sourceFieldName]` e.g. `enx-proxy[source=transaction.recurrpay]`

### ENX Read More Mobile

This component allows you to create a read more/less section for mobile devices. It is automatically initialised on any page with an element with the class `enx-read-more-mobile`. Add this class to any text block to make it collapse on mobile devices.

You can further control how many child elements remain visible by adding a number to the class name. For example, `enx-read-more-mobile[visible=1]` will keep 1 child element visible on mobile with the rest collapsed behind the "Read more" button. If not specified, the default number of visible child elements is 2.

### ENX Share

Add a native share button to your page. This will open the native share dialog if supported by the device or browser. If that's not supported, it will add a "Copy" button that will copy the link to the clipboard.

To add this functionality add a text block with the custom class `enx-share:native-link`, containing the URL you want to share. To customise the title and description of the share, you can add further text blocks with custom classes `enx-share:native-title` and `enx-share:native-description` respectively.

It also supports doing custom sharing via a set of custom buttons and text blocks to set up your share attributes:
- For Facebook, put your URL to share inside an element with the class `enx-share:facebook-link` and add a button with the class `enx-share:facebook-button`. 
- For Twitter, put your message to share inside an element with the class `enx-share:twitter-msg` and add a button with the classes `enx-share:twitter-button`. 
- For WhatsApp, put your message to share inside an element with the class `enx-share:whatsapp-msg` and add a button with the classes `enx-share:whatsapp-button`. 
- For Email, put your subject inside an element with the class `enx-share:email-subject`, your body inside an element with the class `enx-share:email-body` and add a button with the classes `enx-share:email-button`.

### ENX Show

Using a special class format, you can have elements only be visible when a form field has a certain value.

The format is: `enx-show[field=fieldName][value=fieldValue]`.

For example, an element with the class name `enx-show[field=transaction.recurrpay][value=Y]` will only be visible when the value of the field `transaction.recurrpay` is `Y`. If the field is a checkbox or radio button, it will be visible when the input of the group with this value is checked.

## ENX Text
Similar to ENX HTML, but for text content only.

Copy the text content of an element to another element. e.g. an element with the class name `enx-text[source=contact--first-name]` will copy the text content of the element with the class `contact--first-name` to the element with the class name `enx-text[source=contact--first-name]`.

### ENX Tweet Target

Adds a number of enhancements to Tweet to Target pages, including:

- Custom Tweets and the ability to cycle through multiple tweets in a random order.

To add this functionality, create a row with the class `enx-tweet-target:custom-tweets`. Each copy block you add to this row will be a custom tweet (in additional to the default tweet defined in EN).

- Adding MP's photo to the page.

To add this functionality, you need to "Enable background information tab for each contact" in the contact block settings. Inside that block, add the following JSON. This must be valid JSON with no whitespace or extra lines.

```json
{
    "name": "{contact_data~firstName} {contact_data~lastName}",
    "location": "{contact_data~organization}"
}
```
- Hiding the background information tab.
- Hiding the "Send" button.
- Hiding the target profile.
- Redirecting to the next page automatically after doing a Tweet.

All of these options are enabled by default when you add a class to a row on the page with the name `enx-tweet-target`.

You can specifically disable each of these options by adding any of the following properties to the `enx-tweet-target` class.

`enx-tweet-target[custom-tweets=false][mp-photo=false][hide-background-tab=false][hide-sent-btn=false][show-target-profile=false][redirect-on-tweet=false]`

### ENX Validate

This component will format various fields as the user types and remove error messages. It has some default options, which can all be overridden via the ENX constructor or ENXPagConfig. To disable it, replace this configuration with `false`.

```javascript
{
    removeErrorsOnInput: true,
    sortCodeField: "supporter.bankRoutingNumber",
    accountNumberField: "supporter.bankAccountNumber",
}
```

### ENX Widget

Add data to your page from the data services API.

You can customise the enxWidget config by adding it to your per page ENX config, like this:

```javascript
window.ENXPageConfig = {
  enxWidget: {
    type: "petition", // other options: petition, fundraising
    metric: "participatingSupporters", // other options: totalAmountDonated, totalNumberOfDonations
    offsetCount: 0,
    hiddenUntilCount: 0,
    token: "your-token",
  }
};
```

Then, on your page, you can add a text block with the class `signature-counter` to display the data. The following replacements are supported:

- {signature.remaining} - the remaining number of signatures needed to reach the target
- {signature.percent} - the percentage of the target reached
- {signature.count} - the current number of signatures
- {signature.target} - the target number of signatures

Finally, add a custom code block with the following content where you want your widget to display:

```html
<div class="enWidget enWidget--progressBar">
    <div class="enWidget__display">
        <div class="enWidget__bar">
            <div class="enWidget__progress">
                <div class="enWidget__fill" style="width: 50%; height: 100%;"></div>
            </div>
        </div>
    </div>
</div>
```
