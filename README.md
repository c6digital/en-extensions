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

To use it, in your ENX constructor, pass in an array of objects with the following structure:

```javascript
proxies: [{
  source: 'transaction.recurrpay', 
  target: 'supporter.NOT_TAGGED_17'
}]
```
