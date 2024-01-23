# EN Extensions

EN extensions add a number of helpful features to Engaging Networks templates, such as:

- Support for Proxy fields
- Binding field values to text
- Multi-step form support
- Social sharing enhancements
- Support for showing/hiding content based on field values

## Development

Clone the repository and run `npm install` to install dependencies.

Run `npm run build` to build the javascript file.

Run `npm run watch` to watch for changes during development and rebuild the javascript file.

To deploy, upload the contents of the 'dist' folder to the Engaging Networks file manager.

## Usage

To use the components, add the generated javascript file in the 'dist' folder to your page template.

Then, initialise the extensions on your page template, passing in any configuration options. All configuration options are optional. You can use the lifecycle hook functions to run code at various points in the initialisation process.

```html
<script>
  const enExtensions = new ENX({
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
It is also possible to customise configuration options per page by defining a `window.ENXPageConfig` variable in a code block on your page.

Options defined in `window.ENXPageConfig` will override the default options, and any options set at a template level.

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

### ENX Model

One-way bind the text content of an element to the value of a form field. e.g. an element with the class name `enx-model:supporter.firstName` will be bound to the value of the input with the name `supporter.firstName`.

### ENX Proxy Fields

This class binds the value of a field to to another field.

To use in, pass in an array of objects with the following structure via the ENX constructor on window.ENXPageConfig.

```javascript
proxies: [{
  source: 'transaction.recurrpay', 
  target: 'supporter.NOT_TAGGED_17'
}]
```

It's also possible to create these by setting your target field's label to enx-proxy[sourceFieldName] e.g. enx-proxy[transaction.recurrpay]

### ENX HTML

Copy the HTML content of an element to another element. e.g. an element with the class name `enx-html:campaign-content` will copy the HTML content of the element with the class `campaign-content` to the element with the class name `enx-html:campaign-content`.

## ENX Text

Copy the text content of an element to another element. e.g. an element with the class name `enx-text:contact--first-name` will copy the text content of the element with the class `contact--first-name` to the element with the class name `enx-text:contact--first-name`.

### ENX Show

Using a special class format, you can have elements only be visible when a form field has a certain value.

The format is: `enx-show:fieldName[fieldValue]`.

For example, an element with the class name `enx-show:transaction.recurrpay[Y]` will only be visible when the value of the field `transaction.recurrpay` is `Y`. If the field is a checkbox or radio button, it will be visible when the input of the group with this value is checked.

### ENX Share

Add a native share button to your page. This will open the native share dialog if supported by the device or browser. If that's not supported, it will add a "Copy" button that will copy the link to the clipboard.

To add this functionality add a text block with the custom class `social-share-native-link`, containing the URL you want to share. To customise the title and description of the share, you can add further text blocks with custom classes `social-share-native-title` and `social-share-native-description` respectively. 

It also supports doing custom sharing via a set of custom buttons and text blocks to set up your share attributes. For Facebook, put your URL to share inside an element with the class "social-share-fb" and add a button with the classes "custom-share-settings facebook-button". For Twitter, put your message to share inside an element with the class "social-share-tw" and add a button with the classes "custom-share-settings twitter-button". For WhatsApp, put your message to share inside an element with the class "social-share-wa" and add a button with the classes "custom-share-settings whatsapp-button". For Email, put your subject inside an element with the class "social-share-em-subject", your body inside an element with the class "social-share-em-body" and add a button with the classes "custom-share-settings email-button".

### ENX Multistep Form

This component allows you to create multi-step forms in Engaging Networks. It is automatically initialised on any page with an element with the class `enx-multistep`.

To get started, each section of the multi-step must have the class `enx-multistep` and `enx-multistep-name--{section-name}`. The can be added to advanced rows or used in code blocks.

Multistep sections can use a combination of the following CSS classes:

- `.enx-multistep`: used on all sections to indicate it's a section of a multistep form
- `.enx-multistep-name--{name}`: used on all sections to provide URL hash
- `.enx-multistep-force-start`: forces this section to load first, even if someone uses URL with a hash on

A section can be activated using a button with attribute:

- `enx-multistep-destination="{name}"`

By default, the fields visible in the section are validated when clicking the button, before changing to the destination section but validation can be skipped, using a button with attribute:

- `no-validate`

### ENX Read More Mobile

This component allows you to create a read more/less section for mobile devices. It is automatically initialised on any page with an element with the class `enx-read-more-mobile`. Add this class to any text block to make it collapse on mobile devices.

You can further control how many child elements remain visible by adding a number to the class name. For example, `enx-read-more-mobile[1]` will keep 1 child element visible on mobile with the rest collapsed behind the "Read more" button.

The default number of visible child elements is 2.

### ENX Live Validation

This component will format various fields as the user types and remove error messages. It has some default options, which can all be overridden via the ENX constructor or ENXPagConfig.

```javascript
{
    enabled: true,
    removeErrorsOnInput: true,
    sortCodeField: "supporter.bankRoutingNumber",
    accountNumberField: "supporter.bankAccountNumber",
}
```

### ENX Donate

This component contains a few functions that run automatically for donation page enhancement. They don't require any configuration.

### ENX Email Target

Enhances ETT pages by adding a photo of the Member of Parliament (Westminster) who is the target. To add this functionality, add the following HTML to your page template:

```html
<img alt="Photo of {contact_data~firstName} {contact_data~lastName}" data-mp-location="{contact_data~organization}" data-mp-name="{contact_data~firstName} {contact_data~lastName}" height="auto" src="https://members-api.parliament.uk/api/Members/1/Thumbnail" width="30px" />
```

### ENX Tweet Target

Adds a number of enhancements to Tweet to Target pages, including:

- Custom Tweets and the ability to cycle through multiple tweets in a random order.

To add this functionality, create an advanced row with the class "ttt--custom-tweets". Each copy block you add to this row will be a custom tweet.

- Adding MP's photo to the page.

To add this functionality, you need to "Enable background information tab for each contact" in the contact block settings. Inside that block, add the following JSON. This must be valid JSON with no whitespace or extra lines.

```json
{
    "name": "{contact_data~firstName} {contact_data~lastName}",
    "location": "{contact_data~organization}"
}
```

- Hiding the background information tab. Add the class "ttt--hide-background-tab" to the contact block.
- Hiding the "Send" button. Add the class "ttt--hide-sent-btn" to the contact block.
- Hiding the target profile. Add the class "ttt--hide-target-profile" to the contact block.
- Redirecting to the next page automatically after doing a Tweet. Add the class "ttt--redirect-on-tweet" to the contact block.
