;(function($) {
  
// miniMustache is a simple jquery plugin that allows you to embed object values in your page using a bracket style syntax.

$.fn.miniMustache = function(obj, options) {
  var opts = $.extend({}, $.fn.miniMustache.defaults, options);

  if (typeof(this) == "string") {
    return this.interpret(obj);
  }else{
    return this.each(function() {

      var $this = $(this);
      
      if (obj.length == undefined) {
        // not an array of objects
        $this.html($this.html().interpret(obj));
      }else{
        // it's an array of objects and we will need to create the collection as
        // necessary
        // ensure that the dom item is unique, so we can use it as a template
        var template = $this.children(opts.collectionClass);
        var templateId = randomId();
        template.attr('id',templateId);
        templateHtml = template.html();
        var limit = opts.collectionLimit == false ? obj.length : opts.collectionLimit;
        for (var i=0; i < limit; i++) {
          var _id = "#" + templateId;
          if (i==0) {
            $(_id).html(templateHtml.interpret(obj[i]));
            var parsedContent = $(_id).html().interpret(obj[i]);
          }else{
            var newItem = $(_id).clone().attr('id',randomId());
            newItem.html(templateHtml.interpret(obj[i])).appendTo($this);
          };
        };
      };
      
      // Support for the Metadata Plugin.
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

    });
  };
  
  function randomId () {
    var idName = opts.collectionClass.split(".")[1];
    return idName + "-" + Math.floor(Math.random()*9999999);
  }

  // private function for debugging
  function debug($obj) {
    if (window.console && window.console.log) {
      window.console.log($obj);
    }
  }
};

// default options
$.fn.miniMustache.defaults = {
  collectionClass: ".collection",
  collectionLimit: false
};

})(jQuery);

// Borrowed from : http://javascript.crockford.com/remedial.html
String.prototype.interpret = function (o) {
    return this.replace(/{{([^{}]*)}}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};