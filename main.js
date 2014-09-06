var OForm = (function(){

  function OForm(oformObj){
    //Bind the passed in config to the object instance
    for(var key in oformObj){
      this[key]=oformObj[key]; 
    }
    
    //cache the element for later use making the request...commented out because was running code in Node
    //this.elm = document.getElementById(this.selector);
    
    //Setup the default config from the OForm constructor if it wasn't specified
    for(var defConfig in arguments.callee.defaults){
      if(!this[defConfig]){
        this[defConfig] = arguments.callee.defaults[defConfig];
      }  
    }
    
    //Push the instance into the constructor function collection array for later retrieval, ex: OForm.delete('some instance name')
    arguments.callee.push(this);
    
    //Start the process, init should spawn the chain reaction that makes the request, handles the response, etc.
    this.init();
  }

  // These are object extensions of the OForm object constructor function -- potentially a hack :-P
  OForm.defaults = {
    errorMessage: 'error',
    anotherDefault: 'something-else'
  }

  OForm.collection = [];

  OForm.push = function(inst){
    this.collection.push(inst);
  }

  OForm.get = function(name){
    return this.collection.filter(function(inst){
      if(inst.name === name){
        return inst;
      }
    })[0];
  }

  // use the get function to retrieve the instance and then call the instance's prototype destroy method
  OForm.destroy = function(name){
    var inst = this.get(name);
    inst.destroy();
    this.collection.splice( this.collection[ this.indexOf(inst) ], 1  );
  }

  // Now extend the OForm prototype
  OForm.prototype.init = function(){
    var beforeData;
    if( this.hasOwnProperty('before') ){
      //this will call the before function override that was defined in the 'new' instance params
      beforeData = this.before();
    } else {
      //this will call the default prototype method on the instance
      beforeData = this.before();
    }
    
    this.makeRequest(beforeData);
  }

  OForm.prototype.before = function(){
    console.log('running the default before action for: ' + this.name);
  }

  OForm.prototype.makeRequest = function(){
    console.log('making the request for: ' + this.url);
  }

  OForm.prototype.destroy = function(){
    //do stuff to remove any listeners, etc
  }

  
  return OForm;
}());

new OForm({
  name: 'some-form-1',
  selector: '#some-form-1',
  url: '/data/form-1'
});

new OForm({
  name: 'some-form-2',
  selector: '#some-form-2',
  url: '/data/form-2',
  anotherDefault: 'overwrite-the-default',
  before: function(){
    console.log('overwrite of the before prototype function: ' + this.name);
  }
});

new OForm({
  name: 'some-form-3',
  selector: '#some-form-3',
  url: '/data/form-3',
  errorMessage: 'overwrite-default'
});

console.log(OForm.get('some-form-1'));
console.log(OForm.get('some-form-2'));
console.log(OForm.get('some-form-3'));
