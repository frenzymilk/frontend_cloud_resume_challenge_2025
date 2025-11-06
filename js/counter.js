// Getting current counter
async function getCounter() {
  const url = "https://ugf110a275.execute-api.us-east-2.amazonaws.com/visitorsCounter";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return error.message;
  }
}

// Updating current counter
async function incrementCounter() {
  const url = "https://ugf110a275.execute-api.us-east-2.amazonaws.com/visitorsCounter";
  try {
    const response = await fetch(url, {
       method: "POST"
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return error.message;
  }
}



(function ($) {
  
  $.fn.countTo = function (options) {
    options = options || {};
    return $(this).each(function () {

      getCounter().then((response) => { // getting current counter, then do the following:
          // set options for current element
          var settings = $.extend({}, $.fn.countTo.defaults, {
            from:            $(this).data('from'),
            to:              response, // setting value to current counter
            speed:           $(this).data('speed'),
            refreshInterval: $(this).data('refresh-interval'),
            decimals:        $(this).data('decimals')
          }, options);
          
          // how many times to update the value, and how much to increment the value on each update
          var loops = Math.ceil(settings.speed / settings.refreshInterval),
            increment = (settings.to - settings.from) / loops;
          
          // references & variables that will change with each update
          var self = this,
            $self = $(this),
            loopCount = 0,
            value = settings.from,
            data = $self.data('countTo') || {};
          
          $self.data('countTo', data);
          
          // if an existing interval can be found, clear it first
          if (data.interval) {
            clearInterval(data.interval);
          }
          data.interval = setInterval(updateTimer, settings.refreshInterval);
          
          // initialize the element with the starting value
          render(value);

          //incrementing counter
          incrementCounter();
          
          function updateTimer() {
            value += increment;
            loopCount++;
            
            render(value);
            
            if (typeof(settings.onUpdate) == 'function') {
              settings.onUpdate.call(self, value);
            }
            
            if (loopCount >= loops) {
              // remove the interval
              $self.removeData('countTo');
              clearInterval(data.interval);
              value = settings.to;
              
              if (typeof(settings.onComplete) == 'function') {
                settings.onComplete.call(self, value);
              }
            }
          }
          
          function render(value) {
            var formattedValue = settings.formatter.call(self, value, settings);
            $self.html(formattedValue);
          }
        });
      });
      
  };
  
  $.fn.countTo.defaults = {
    from: 0,               // the number the element should start at
    to: 0,                 // the number the element should end at
    speed: 1000,           // how long it should take to count between the target numbers
    refreshInterval: 100,  // how often the element should be updated
    decimals: 0,           // the number of decimal places to show
    formatter: formatter,  // handler for formatting the value before rendering
    onUpdate: null,        // callback method for every time the element is updated
    onComplete: null       // callback method for when the element finishes updating
  };
  
  function formatter(value, settings) {
    return value.toFixed(settings.decimals);
  }
}(jQuery));



jQuery(function ($) {
  // custom formatting example
  $('.count-number').data('countToOptions', {
  formatter: function (value, options) {
    return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
  }
  });
  
  // start all the timers
  $('.timer').each(count);  
  
  function count(options) {
  var $this = $(this);
  options = $.extend({}, options || {}, $this.data('countToOptions') || {});
  $this.countTo(options);
  }
});
