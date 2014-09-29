# Implementation

*Code https://github.com/alexeypetrushin/salejs this version marked with tag `3-implementation`*

Adding Stub for Shop for Development. We already have a stub, but its used for mockups,
we need also another stub, for Development.

Adding basic server to serve static assets for Cart Widget.

<iframe width="853" height="480" src="//www.youtube.com/embed/YJ63ayG2BCk" frameborder="0" allowfullscreen></iframe>

Adding Asset loading system for Cart Widget.

<iframe width="853" height="480" src="//www.youtube.com/embed/g8DDEiRjjjQ" frameborder="0" allowfullscreen></iframe>

Adding support for Client Templates.

Adding support for Client Localisation.

<iframe width="853" height="480" src="//www.youtube.com/embed/6ECXIGMPiq8" frameborder="0" allowfullscreen></iframe>

Adding support for Local Storage.

Adding support for Events.

Adding Model for Cart.

Adding View for Cart.

<iframe width="853" height="480" src="//www.youtube.com/embed/FOrROby7hv4" frameborder="0" allowfullscreen></iframe>

Adding Views for Buy Button and Contact Form.

Updating the Stub for Shop to show multiple items.

Wiring Views and Models together.

<iframe width="853" height="480" src="//www.youtube.com/embed/ouioxk0VlQw" frameborder="0" allowfullscreen></iframe>

Adding support for Cross-Domain Client-Server requests.

<iframe width="853" height="480" src="//www.youtube.com/embed/oS-95DyzEFI" frameborder="0" allowfullscreen></iframe>

Adding support for Server Templates and Localisation.

Sending Mail with Order to Shop owner.

<iframe width="853" height="480" src="//www.youtube.com/embed/alYof3FLEZ0" frameborder="0" allowfullscreen></iframe>

## Mistakes

- Don't implement Asset loading System for Cart Widget. I spend a lot of time working on it.
It makes it's easier for users to use Cart Widget, but it doesn't add any business value.
Maybe it would be better to just ignore it for now and use it as it is, thus saving time
spent on development.

- Use Backbone.js. I originally though that code will be minimal and simple and Backbone.js
would be an unnecessary overhead. But, as it turned out - the code ended up more complicated
than I expected. Maybe using Backbone.js instead of reimplementing some of basics of MVC (like
`Events`) would be better choice.

- Add Localisation. When creating prototype you usually shouldn't be concerned about localisation
at all, it should be done as simple as possible and just for one language. But, in my case  I
needed support for the russian language right from the start. So, I doesn't have a choice and has
to add it, but in most cases there's no need for it, it can be added later there will be a need
for it.

- Date  : 2013/11/29