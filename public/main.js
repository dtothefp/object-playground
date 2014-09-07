var OForm = window.OForm = (function(){
  'use strict';
  
  function OForm(oformObj){
    //Bind the passed in config to the object instance
    for(var key in oformObj){
      this[key]=oformObj[key]; 
    }
    
    //cache the element for later use making the request...commented out because was running code in Node
    this.elm = document.getElementById(this.selector);
    
    //Setup the default config from the OForm constructor if it wasn't specified
    for(var defConfig in OForm.defaults){
      if(!this[defConfig]){
        this[defConfig] = OForm.defaults[defConfig];
      }  
    }
    
    //Push the instance into the constructor function collection array for later retrieval, ex: OForm.delete('some instance name')
    OForm.push(this);
    
    this.elm.addEventListener('submit', this.init.bind(this));
  }

  // These are object extensions of the OForm object constructor function -- potentially a hack :-P
  OForm.defaults = {
    errorMessage: 'error',
    encode: 'uri'
  };

  OForm.collection = [];

  OForm.push = function(inst){
    this.collection.push(inst);
  };

  OForm.get = function(name){
    return this.collection.filter(function(inst){
      if(inst.name === name){
        return inst;
      }
    })[0];
  };

  // use the get function to retrieve the instance and then call the instance's prototype destroy method
  OForm.destroy = function(name){
    var inst = this.get(name);
    inst.destroy();
    this.collection.splice( this.collection[ this.indexOf(inst) ], 1  );
  };

  // Now extend the OForm prototype
  OForm.prototype.init = function(e){
    var beforeData;
    e.preventDefault();
    // this.hasOwnProperty('before') will be false if no before property is defined when initializing the instance
    // this.hasOwnProperty('before') will be true if instance is instantiated with a before option set
    // therefor calling this.before will appropriately call the prototype function or default option defined on OForm 
    beforeData = this.before();
    this.makeRequest(beforeData);
  };

  OForm.prototype.before = function(){
    var data;
    var inputs = this.elm.getElementsByTagName('input'); 
    inputs = Array.prototype.slice.call(inputs);
    if(this.encode === 'json'){
      data = {};
      inputs.forEach(function(input){
        data[ input.getAttribute('name') ] = input.value; 
      });
      data = JSON.stringify(data);
    } else if (this.encode === 'uri') {
      data = '';
      inputs.forEach(function(input, i){
        data += input.getAttribute('name') + '=' + input.value;
        if(i !== inputs.length - 1){
          data += '&';      
        }
      });
      data = encodeURI(data);
    } else if (this.encode === 'formData'){
      data = new FormData(this.elm);
    }
    return data;
  };

  OForm.prototype.makeRequest = function(data){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.url, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.onload = function(e) { 
      console.log('POST response: ', xhr.responseText); 
    };

    xhr.send(data);
  };

  OForm.prototype.destroy = function(){
    //do stuff to remove any listeners, etc
  };

  return OForm;
}());

new OForm({
  name: 'form-1',
  selector: 'form-1',
  url: '/api'
});

new OForm({
  name: 'form-2',
  selector: 'form-2',
  url: '/api',
  before: function(){
    return JSON.stringify({
      customStuff: 'My Stuff',
      moreThings: 'A lot more things here'
    });
  }
});

new OForm({
  name: 'form-3',
  selector: 'form-3',
  url: '/api',
  encode: 'formData'
});
