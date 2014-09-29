// iBrowser, programmatically controlled browser for testing, uses `iframe` internally.
(function(){
  // Global.
  var global
  if(typeof global == 'undefined') global = window

  // # Helpers.
  //
  // Strings started with .#* symbols should be threated as CSS selectors.
  var cssSelectorRe = /^[\.#*]/
  var isDefined = function(obj){return (typeof obj !== "undefined") && (obj !== null)}
  var strip = function(str){
    if(!isDefined(str)) return str
    return str.replace(/^\s+/, '').replace(/\s+$/, '')
  }
  var eachIn = function(list, callback){
    for(var i=0; i < list.length; i++) callback(list[i], i)
  }
  var hasProperty = {}.hasOwnProperty
  var eachOf = function(hash, callback){
    for (key in hash) {
      if (!hasProperty.call(hash, key)) continue;
      callback(hash[key], key)
    }
  }
  var isFunction = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Function]'
  }
  var waitIt = function(waitInterval, waitTimeout, tryCallback, timeoutCallback){
    var startTime = Date.now()
    var tryIt = function(){
      if(!(tryCallback() == false)) return
      var time = Date.now()
      if((time - startTime) < waitTimeout) setTimeout(tryIt, waitInterval)
      else timeoutCallback()
    }
    tryIt()
  }

  // # DOM Wrapper
  //
  // DomWrapper needed to abstract dom manipulations, currently only jQuery supported.
  var JQueryDomWrapper = function(jQuery){
    this.jQuery = jQuery
  }
  jproto = JQueryDomWrapper.prototype
  jproto.find = function(context, query){
    var elements = []
    this.jQuery(context).find(query).each(function(){elements.push(this)})
    return elements
  }
  jproto.findWithText = function(context, text){
    // Searching for elements having query as text.
    var query = "*:contains('" + text + "')"
    var elements = []
    var that = this
    eachIn(this.find(context, query), function(e){
      // Checking for exact match.
      if(strip(that.jQuery(e).html()) == text) elements.push(e)
    })
    return elements
  }
  jproto.html = function(element){
    return this.jQuery(element).html()
  }
  jproto.isVisible = function(element){
    element = this.jQuery(element)
    // Element and all its parents are visible.
    return element.is(':visible') && (element.parents(':hidden').size() == 0)
  }
  jproto.getValue = function(element){
    return this.jQuery(element).val()
  }
  jproto.setValue = function(element, value){
    // Changing value and firing onChange event.
    this.jQuery(element).val(value).change()
  }
  jproto.getText = function(element){
    return this.jQuery(element).text()
  }
  jproto.trigger = function(element, event){
    this.jQuery(element).trigger(event)
  }

  // # Context
  //
  // Context is current scope inside of page, all operations are performend within the context,
  // default context is `body`.
  var Context = function(window, element, domWrapper){
    if(!isDefined(window)) throw new Error("window required for creating context!")
    if(!isDefined(domWrapper)) throw new Error("dom wrapper required for creating context!")
    if(!isDefined(element)) throw new Error("element required for creating context!")

    this.window     = window
    this.domWrapper = domWrapper
    this.element    = element
  }
  var cproto = Context.prototype

  // Find element(s).
  cproto.find = function(query, options){
    options = options || {}
    var elements
    if(query.selector){
      elements = this.domWrapper.find(this.element, query.selector)
    }else if(cssSelectorRe.test(query)){
      elements = this.domWrapper.find(this.element, query)
    }else{
      elements = this.domWrapper.findWithText(this.element, query)
    }

    // Rejecting hidden elements.
    if(!options.hidden) elements = this._filterHiddenElements(elements)
    return elements
  }

  // Find exactly one element.
  cproto.findOne = function(query, options){
    var elements = this.find(query, options)
    if(elements.length < 1) throw new Error("element '" + query + "' not found!")
    if(elements.length > 1) throw new Error("found " + elements.length + " elements '" + query + "'!")
    return elements[0]
  }

  cproto.has = function(query){return this.find(query).length > 0}

  // Create new context specified by query.
  cproto.context = function(query){
    return new Context(this.window, this.domWrapper.findOne(query), this.domWrapper)
  }

  // Create list of new contexts specified by query.
  cproto.contexts = function(query){
    var contexts = []
    var that = this
    eachIn(this.domWrapper.find(query), function(element){
      contexts.push(new Context(that.window, element, that.domWrapper))
    })
    return contexts
  }

  cproto.html = function(){return this.domWrapper.html(this.element)}

  // Text visible to user, by default content of hidden elements not included
  // (use `text hidden: true` to include hidden text).
  // Using hack here, getting text only from some html elements.
  cproto.text = function(options){
    options = options || {}
    // We can't include `div` because it then return also html of all its
    // children (including hidden children).
    // If You need text from `div` or other element will be included You
    // should mark it with `.textual` class.
    var textual = 'a, p, small, span, h1, h2, h3, label, option, input, .textual, pre'
    var elements = this.find({selector: textual}, options)

    // Geting text.
    var buff = []
    var that = this
    eachIn(elements, function(e){
      if(e.tagName.toLowerCase() == 'input') buff.push(that.domWrapper.getValue(e))
      else buff.push(that.domWrapper.getText(e))
    })
    var text = buff.join("\n")

    // Removing extra spaces.
    return text.replace(/\n+/g, ' ').replace(/\s+/g, ' ')
  }

  // Type text in input.
  cproto.type = function(){
    if(arguments.length > 1){
      var query = arguments[0]
      var value = arguments[1]
      query = cssSelectorRe.test(query) ? query : ("*[name='" + query + "']")
      var element = this.domWrapper.findOne(query)
      this.domWrapper.setValue(element, value)
    } else {
      var that = this
      eachOf(arguments[0], function(value, query){
        that.type(query, value)
      })
    }
  }

  // Click on element.
  cproto.click = function(query){this.trigger('click', query)}

  // Fire event on element.
  cproto.trigger = function(event, query){
    var element = isDefined(query) ? this.findOne(query) : this.element
    this.domWrapper.trigger(element, event)
  }

  cproto.toString = function(){return this.html()}
  cproto.inspect  = function(){return this.html()}

  cproto._filterHiddenElements = function(elements){
    visible = []
    var that = this
    eachIn(elements, function(e){
      if(that.domWrapper.isVisible(e)) visible.push(e)
    })
    return visible
  }

  // # Browser
  var Browser = function(iframe, options){
    options = options || {}
    if(!isDefined(iframe)) throw new Error("iframe required for creating browser!")
    this.iframe = iframe

    this.waitTimeout  = options.waitTimeout  || 2000
    this.waitInterval = options.waitInterval || 20

    this.getDomWrapper = options.getDomWrapper || function(iframeWindow){
      if(!isDefined(iframeWindow.jQuery)) return null
      return new JQueryDomWrapper(iframeWindow.jQuery)
    }
    this._clearBrowserContext()
  }
  var bproto = Browser.prototype

  // Current location.
  bproto.location = function(){return this.window.location.href}
  bproto.path     = function(){return this.window.location.pathname}

  // Navigate to new url, usage `browser.navigate(url, options..., callback)`.
  bproto.navigate = function(){
    // Parsing arguments.
    var url = arguments[0]
    var options
    var callback
    if(isFunction(arguments[1])){
      options  = {}
      callback = arguments[1]
    } else {
      options  = arguments[1]
      callback = arguments[2]
    }
    if(!isDefined(url)) throw new Error("url required for navigation!")

    // Clearing context and navigating to new url.
    this._clearBrowserContext()
    this.iframe.setAttribute("src", url)

    // Waiting iframe for loading.
    var that = this
    waitIt(this.waitInterval, this.waitTimeout, function(){
      // It's supposed that iframe loaded when it have jQuery and body.
      var iframeWindow = that.iframe.contentWindow
      if(!isDefined(iframeWindow)) return false
      var iframeDocument = iframeWindow.document
      if(!isDefined(iframeDocument)) return false
      var iframeBody = iframeDocument.body
      if(!isDefined(iframeBody)) return false
      var iframeDomWrapper = that.getDomWrapper(iframeWindow)
      if(!isDefined(iframeDomWrapper)) return false

      // Updating browser.
      that._setBrowserContext(iframeWindow, iframeBody, iframeDomWrapper)
      if(callback) callback()
    }, function(){
      if(callback) callback(new Error("can't load '" + url + "'!"))
    })
  }

  // Setting context for browser.
  bproto._setBrowserContext = function(window, element, domWrapper){
    if(!isDefined(window)) throw new Error("window required for creating browser context!")
    if(!isDefined(domWrapper)) throw new Error("dom wrapper required for creating browser context!")
    if(!isDefined(element)) throw new Error("element required for creating browser context!")

    this.window     = window
    this.element    = element
    this.domWrapper = domWrapper
  }
  bproto._clearBrowserContext = function(){
    this.window     = null
    this.element    = null
    this.domWrapper = null
  }

  // Adding methods of Context to Browser.
  eachOf(Context.prototype, function(fn, name){
    bproto[name] = fn
  })

  // Export.
  Browser.Context = Context
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = Browser
  } else {
    global.iBrowser = Browser
  }
})()