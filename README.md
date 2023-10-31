# EN Extensions

EN extensions add a number of helpful features to Engaging Networks templates, such as:

- Support for Proxy fields
- Binding field values to text
- Multi-step form support
- Social sharing enhancements
- Support for showing/hiding content based on field values

## Usage

To use the components, add the generated javascript file in the 'dist' folder to your page template.

Then, initialise the extensions on your page template, passing in any configuration options. All configuration options are optional. You can use the lifecycle hook functions to run code at various points in the initialisation process.

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
A brief documentation for each extension is included in comments at the top of its file in the 'src' folder.

## Development

Clone the repository and run `npm install` to install dependencies.

Run `npm run build` to build the javascript file.

Run `npm run watch` to watch for changes during development and rebuild the javascript file.

To deploy, upload the contents of the 'dist' folder to the Engaging Networks file manager.
