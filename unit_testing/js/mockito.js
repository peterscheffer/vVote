/* vi:ts=2 sw=2 expandtab
 *
 * JsMockito v1.0.4
 * http://github.com/chrisleishman/jsmockito
 *
 * Mockito port to JavaScript
 *
 * Copyright (c) 2009 Chris Leishman
 * Licensed under the BSD license
 */
JsMockito = {
  /**
   * Library version,
   */
  version: '1.0.4',

  _export: ['isMock', 'when', 'verify', 'verifyZeroInteractions',
            'verifyNoMoreInteractions', 'spy'],

  /**
   * Test if a given variable is a mock
   *
   * @param maybeMock An object
   * @return {boolean} true if the variable is a mock
   */
  isMock: function(maybeMock) {
    return typeof maybeMock._jsMockitoVerifier != 'undefined';
  },

  /**
   * Add a stub for a mock object method or mock function
   *
   * @param mock A mock object or mock anonymous function
   * @return {object or function} A stub builder on which the method or
   * function to be stubbed can be invoked
   */
  when: function(mock) {
    return mock._jsMockitoStubBuilder();
  },

  /**
   * Verify that a mock object method or mock function was invoked
   *
   * @param mock A mock object or mock anonymous function
   * @param verifier Optional JsMockito.Verifier instance (default: JsMockito.Verifiers.once())
   * @return {object or function} A verifier on which the method or function to
   * be verified can be invoked
   */
  verify: function(mock, verifier) {
    return (verifier || JsMockito.Verifiers.once()).verify(mock);
  },

  /**
   * Verify that no mock object methods or the mock function were ever invoked
   *
   * @param mock A mock object or mock anonymous function (multiple accepted)
   */
  verifyZeroInteractions: function() {
    JsMockito.each(arguments, function(mock) {
      JsMockito.Verifiers.zeroInteractions().verify(mock);
    });
  },

  /**
   * Verify that no mock object method or mock function invocations remain
   * unverified
   *
   * @param mock A mock object or mock anonymous function (multiple accepted)
   */
  verifyNoMoreInteractions: function() {
    JsMockito.each(arguments, function(mock) {
      JsMockito.Verifiers.noMoreInteractions().verify(mock);
    });
  },

  /**
   * Create a mock that proxies a real function or object.  All un-stubbed
   * invocations will be passed through to the real implementation, but can
   * still be verified.
   *
   * @param {object or function} delegate A 'real' (concrete) object or
   * function that the mock will delegate unstubbed invocations to
   * @return {object or function} A mock object (as per mock) or mock function
   * (as per mockFunction)
   */
  spy: function(delegate) {
    return (typeof delegate == 'function')?
      JsMockito.mockFunction(delegate) : JsMockito.mock(delegate);
  },

  contextCaptureFunction: function(defaultContext, handler) {
    // generate a function with overridden 'call' and 'apply' methods
    // and apply a default context when these are not used to supply
    // one explictly.
    var captureFunction = function() {
      return captureFunction.apply(defaultContext,
        Array.prototype.slice.call(arguments, 0));
    };
    captureFunction.call = function(context) {
      return captureFunction.apply(context,
        Array.prototype.slice.call(arguments, 1));
    };
    captureFunction.apply = function(context, args) {
      return handler.apply(this, [ context, args||[] ]);
    };
    return captureFunction;
  },

  matchArray: function(matchers, array) {
    if (matchers.length > array.length)
      return false;
    return !JsMockito.any(matchers, function(matcher, i) {
      return !matcher.matches(array[i]);
    });
  },

  toMatcher: function(obj) {
    return JsHamcrest.isMatcher(obj)? obj :
      JsHamcrest.Matchers.equalTo(obj);
  },

  mapToMatchers: function(srcArray) {
    return JsMockito.map(srcArray, function(obj) {
      return JsMockito.toMatcher(obj);
    });
  },

  verifier: function(name, proto) {
    JsMockito.Verifiers[name] = function() { JsMockito.Verifier.apply(this, arguments) };
    JsMockito.Verifiers[name].prototype = new JsMockito.Verifier;
    JsMockito.Verifiers[name].prototype.constructor = JsMockito.Verifiers[name];
    JsMockito.extend(JsMockito.Verifiers[name].prototype, proto);
  },

  each: function(srcArray, callback) {
    for (var i = 0; i < srcArray.length; i++)
      callback(srcArray[i], i);
  },

  eachObject: function(srcObject, callback) {
      for (var key in srcObject)
        callback(srcObject[key], key);
  },

  extend: function(dstObject, srcObject) {
    for (var prop in srcObject) {
      dstObject[prop] = srcObject[prop];
    }
    return dstObject;
  },

  objectKeys: function(srcObject) {
    var result = [];
    JsMockito.eachObject(srcObject, function(elem, key) {
      result.push(key);
    });
    return result;
  },

  objectValues: function(srcObject) {
    var result = [];
    JsMockito.eachObject(srcObject, function(elem, key) {
      result.push(elem);
    });
    return result;
  },

  map: function(srcArray, callback) {
    var result = [];
    JsMockito.each(srcArray, function(elem, key) {
      var val = callback(elem, key);
      if (val != null)
        result.push(val);
    });
    return result;
  },

  mapObject: function(srcObject, callback) {
    var result = {};
    JsMockito.eachObject(srcObject, function(elem, key) {
      var val = callback(elem, key);
      if (val != null)
        result[key] = val;
    });
    return result;
  },

  mapInto: function(dstObject, srcObject, callback) {
    return JsMockito.extend(dstObject,
      JsMockito.mapObject(srcObject, function(elem, key) {
        return callback(elem, key);
      })
    );
  },

  grep: function(srcArray, callback) {
    var result = [];
    JsMockito.each(srcArray, function(elem, key) {
      if (callback(elem, key))
        result.push(elem);
    });
    return result;
  },

  find: function(array, callback) {
    for (var i = 0; i < array.length; i++)
      if (callback(array[i], i))
        return array[i];
    return undefined;
  },

  any: function(array, callback) {
    return (this.find(array, callback) != undefined);
  }
};


/**
 * Create a mockable and stubbable anonymous function.
 *
 * <p>Once created, the function can be invoked and will return undefined for
 * any interactions that do not match stub declarations.</p>
 *
 * <pre>
 * var mockFunc = JsMockito.mockFunction();
 * JsMockito.when(mockFunc).call(anything(), 1, 5).thenReturn(6);
 * mockFunc(1, 5); // result is 6
 * JsMockito.verify(mockFunc)(1, greaterThan(2));
 * </pre>
 *
 * @param funcName {string} The name of the mock function to use in messages
 *   (defaults to 'func')
 * @param delegate {function} The function to delegate unstubbed calls to
 *   (optional)
 * @return {function} an anonymous function
 */
JsMockito.mockFunction = function(funcName, delegate) {
  if (typeof funcName == 'function') {
    delegate = funcName;
    funcName = undefined;
  }
  funcName = funcName || 'func';
  delegate = delegate || function() { };

  var stubMatchers = []
  var interactions = [];

  var mockFunc = function() {
    var args = [this];
    args.push.apply(args, arguments);
    interactions.push({args: args});

    var stubMatcher = JsMockito.find(stubMatchers, function(stubMatcher) {
      return JsMockito.matchArray(stubMatcher[0], args);
    });
    if (stubMatcher == undefined)
      return delegate.apply(this, arguments);
    var stubs = stubMatcher[1];
    if (stubs.length == 0)
      return undefined;
    var stub = stubs[0];
    if (stubs.length > 1)
      stubs.shift();
    return stub.apply(this, arguments);
  };

  mockFunc.prototype = delegate.prototype;

  mockFunc._jsMockitoStubBuilder = function(contextMatcher) {
    var contextMatcher = contextMatcher || JsHamcrest.Matchers.anything();
    return matcherCaptureFunction(contextMatcher, function(matchers) {
      var stubMatch = [matchers, []];
      stubMatchers.unshift(stubMatch);
      return {
        then: function() {
          stubMatch[1].push.apply(stubMatch[1], arguments);
          return this;
        },
        thenReturn: function() {
          return this.then.apply(this,JsMockito.map(arguments, function(value) {
            return function() { return value };
          }));
        },
        thenThrow: function(exception) {
          return this.then.apply(this,JsMockito.map(arguments, function(value) {
            return function() { throw value };
          }));
        }
      };
    });
  };

  mockFunc._jsMockitoVerifier = function(verifier, contextMatcher) {
    var contextMatcher = contextMatcher || JsHamcrest.Matchers.anything();
    return matcherCaptureFunction(contextMatcher, function(matchers) {
      return verifier(funcName, interactions, matchers, matchers[0] != contextMatcher);
    });
  };

  mockFunc._jsMockitoMockFunctions = function() {
    return [ mockFunc ];
  };

  return mockFunc;

  function matcherCaptureFunction(contextMatcher, handler) {
    return JsMockito.contextCaptureFunction(contextMatcher,
      function(context, args) {
        var matchers = JsMockito.mapToMatchers([context].concat(args || []));
        return handler(matchers);
      }
    );
  };
};
JsMockito._export.push('mockFunction');


/**
 * Create a mockable and stubbable objects.
 *
 * <p>A mock is created with the constructor for an object as an argument.
 * Once created, the mock object will have all the same methods as the source
 * object which, when invoked, will return undefined by default.</p>
 *
 * <p>Stub declarations may then be made for these methods to have them return
 * useful values or perform actions when invoked.</p>
 *
 * <pre>
 * MyObject = function() {
 *   this.add = function(a, b) { return a + b }
 * };
 *
 * var mockObj = JsMockito.mock(MyObject);
 * mockObj.add(5, 4); // result is undefined
 *
 * JsMockito.when(mockFunc).add(1, 2).thenReturn(6);
 * mockObj.add(1, 2); // result is 6
 *
 * JsMockito.verify(mockObj).add(1, greaterThan(2)); // ok
 * JsMockito.verify(mockObj).add(1, equalTo(2)); // ok
 * JsMockito.verify(mockObj).add(1, 4); // will throw an exception
 * </pre>
 *
 * @param Obj {function} the constructor for the object to be mocked
 * @return {object} a mock object
 */
JsMockito.mock = function(Obj) {
  var delegate = {};
  if (typeof Obj != "function") {
    delegate = Obj;
    Obj = function() { };
    Obj.prototype = delegate; 
    Obj.prototype.constructor = Obj;
  }
  var MockObject = function() { };
  MockObject.prototype = new Obj;
  MockObject.prototype.constructor = MockObject;

  var mockObject = new MockObject();
  var stubBuilders = {};
  var verifiers = {};
  
  var contextMatcher = JsHamcrest.Matchers.sameAs(mockObject);

  var addMockMethod = function(name) {
    var delegateMethod;
    if (delegate[name] != undefined) {
      delegateMethod = function() {
        var context = (this == mockObject)? delegate : this;
        return delegate[name].apply(context, arguments);
      };
    }
    mockObject[name] = JsMockito.mockFunction('obj.' + name, delegateMethod);
    stubBuilders[name] = mockObject[name]._jsMockitoStubBuilder;
    verifiers[name] = mockObject[name]._jsMockitoVerifier;
  };

  for (var methodName in mockObject) {
    if (methodName != 'constructor')
      addMockMethod(methodName);
  }

  for (var typeName in JsMockito.nativeTypes) {
    if (mockObject instanceof JsMockito.nativeTypes[typeName].type) {
      JsMockito.each(JsMockito.nativeTypes[typeName].methods, function(method) {
        addMockMethod(method);
      });
    }
  }

  mockObject._jsMockitoStubBuilder = function() {
    return JsMockito.mapInto(new MockObject(), stubBuilders, function(method) {
      return method.call(this, contextMatcher);
    });
  };

  mockObject._jsMockitoVerifier = function(verifier) {
    return JsMockito.mapInto(new MockObject(), verifiers, function(method) {
      return method.call(this, verifier, contextMatcher);
    });
  };

  mockObject._jsMockitoMockFunctions = function() {
    return JsMockito.objectValues(
      JsMockito.mapObject(mockObject, function(func) {
        return JsMockito.isMock(func)? func : null;
      })
    );
  };

  return mockObject;
};
JsMockito._export.push('mock');

JsMockito.nativeTypes = {
  'Array': {
    type: Array,
    methods: [
      'concat', 'join', 'pop', 'push', 'reverse', 'shift', 'slice', 'sort',
      'splice', 'toString', 'unshift', 'valueOf'
    ]
  },
  'Boolean': {
    type: Boolean,
    methods: [
      'toString', 'valueOf'
    ]
  },
  'Date': {
    type: Date,
    methods: [
      'getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds',
      'getMinutes', 'getMonth', 'getSeconds', 'getTime', 'getTimezoneOffset',
      'getUTCDate', 'getUTCDay', 'getUTCMonth', 'getUTCFullYear',
      'getUTCHours', 'getUTCMinutes', 'getUTCSeconds', 'getUTCMilliseconds',
      'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate',
      'setUTCMonth', 'setUTCFullYear', 'setUTCHours', 'setUTCMinutes',
      'setUTCSeconds', 'setUTCMilliseconds', 'setYear', 'toDateString',
      'toGMTString', 'toLocaleDateString', 'toLocaleTimeString',
      'toLocaleString', 'toString', 'toTimeString', 'toUTCString',
      'valueOf'
    ]
  },
  'Number': {
    type: Number,
    methods: [
      'toExponential', 'toFixed', 'toLocaleString', 'toPrecision', 'toString',
      'valueOf'
    ]
  },
  'String': {
    type: String,
    methods: [
      'anchor', 'big', 'blink', 'bold', 'charAt', 'charCodeAt', 'concat',
      'fixed', 'fontcolor', 'fontsize', 'indexOf', 'italics',
      'lastIndexOf', 'link', 'match', 'replace', 'search', 'slice', 'small',
      'split', 'strike', 'sub', 'substr', 'substring', 'sup', 'toLowerCase',
      'toUpperCase', 'valueOf'
    ]
  },
  'RegExp': {
    type: RegExp,
    methods: [
      'compile', 'exec', 'test'
    ]
  }
};


/**
 * Verifiers
 * @namespace
 */
JsMockito.Verifiers = {
  _export: ['never', 'zeroInteractions', 'noMoreInteractions', 'times', 'once'],

  /**
   * Test that a invocation never occurred. For example:
   * <pre>
   * verify(mock, never()).method();
   * </pre>
   * @see JsMockito.Verifiers.times(0)
   */
  never: function() {
    return new JsMockito.Verifiers.Times(0);
  },

  /** Test that no interaction were made on the mock.  For example:
   * <pre>
   * verify(mock, zeroInteractions());
   * </pre>
   * @see JsMockito.verifyZeroInteractions()
   */
  zeroInteractions: function() {
    return new JsMockito.Verifiers.ZeroInteractions();
  },

  /** Test that no further interactions remain unverified on the mock.  For
   * example:
   * <pre>
   * verify(mock, noMoreInteractions());
   * </pre>
   * @see JsMockito.verifyNoMoreInteractions()
   */
  noMoreInteractions: function() {
    return new JsMockito.Verifiers.NoMoreInteractions();
  },

  /**
   * Test that an invocation occurred a specific number of times. For example:
   * <pre>
   * verify(mock, times(2)).method();
   * </pre>
   *
   * @param wanted The number of desired invocations
   */
  times: function(wanted) { 
    return new JsMockito.Verifiers.Times(wanted);
  },

  /**
   * Test that an invocation occurred exactly once. For example:
   * <pre>
   * verify(mock, once()).method();
   * </pre>
   * This is the default verifier.
   * @see JsMockito.Verifiers.times(1)
   */
  once: function() { 
    return new JsMockito.Verifiers.Times(1);
  }
};

JsMockito.Verifier = function() { this.init.apply(this, arguments) };
JsMockito.Verifier.prototype = {
  init: function() { },

  verify: function(mock) {
    var self = this;
    return mock._jsMockitoVerifier(function() {
      self.verifyInteractions.apply(self, arguments);
    });
  },

  verifyInteractions: function(funcName, interactions, matchers, describeContext) {
  },

  updateVerifiedInteractions: function(interactions) {
    JsMockito.each(interactions, function(interaction) {
      interaction.verified = true;
    });
  },

  buildDescription: function(message, funcName, matchers, describeContext) {
    var description = new JsHamcrest.Description();
    description.append(message + ': ' + funcName + '(');
    JsMockito.each(matchers.slice(1), function(matcher, i) {
      if (i > 0)
        description.append(', ');
      description.append('<');
      matcher.describeTo(description);
      description.append('>');
    });
    description.append(")");
    if (describeContext) {
      description.append(", 'this' being ");
      matchers[0].describeTo(description);
    }
    return description;
  }
};

JsMockito.verifier('Times', {
  init: function(wanted) {
    this.wanted = wanted;
  },

  verifyInteractions: function(funcName, allInteractions, matchers, describeContext) {
    var interactions = JsMockito.grep(allInteractions, function(interaction) {
      return JsMockito.matchArray(matchers, interaction.args);
    });
    if (interactions.length == this.wanted) {
      this.updateVerifiedInteractions(interactions);
      return;
    }

    var message;
    if (interactions.length == 0) {
      message = 'Wanted but not invoked';
    } else if (this.wanted == 0) {
      message = 'Never wanted but invoked';
    } else if (this.wanted == 1) {
      message = 'Wanted 1 invocation but got ' + interactions.length;
    } else {
      message = 'Wanted ' + this.wanted + ' invocations but got ' + interactions.length;
    }

    var description = this.buildDescription(message, funcName, matchers, describeContext);
    throw description.get();
  }
});

JsMockito.verifier('ZeroInteractions', {
  verify: function(mock) {
    var neverVerifier = JsMockito.Verifiers.never();
    JsMockito.each(mock._jsMockitoMockFunctions(), function(mockFunc) {
      neverVerifier.verify(mockFunc)();
    });
  }
});

JsMockito.verifier('NoMoreInteractions', {
  verify: function(mock) {
    var self = this;
    JsMockito.each(mock._jsMockitoMockFunctions(), function(mockFunc) {
      JsMockito.Verifier.prototype.verify.call(self, mockFunc)();
    });
  },

  verifyInteractions: function(funcName, allInteractions, matchers, describeContext) {
    var interactions = JsMockito.grep(allInteractions, function(interaction) {
      return interaction.verified != true;
    });
    if (interactions.length == 0)
      return;
    
    var description = this.buildDescription(
      "No interactions wanted, but " + interactions.length + " remains",
      funcName, matchers, describeContext);
    throw description.get();
  }
});


/**
 * Verifiers
 * @namespace
 */
JsMockito.Integration = {
  /**
   * Import the public JsMockito API into the specified object (namespace)
   *
   * @param {object} target An object (namespace) that will be populated with
   * the functions from the public JsMockito API
   */
  importTo: function(target) {
    JsMockito.each(JsMockito._export, function(exported) {
      target[exported] = JsMockito[exported];
    });

    JsMockito.each(JsMockito.Verifiers._export, function(exported) {
      target[exported] = JsMockito.Verifiers[exported];
    });
  },

  /**
   * Make the public JsMockito API available in Screw.Unit
   * @see JsMockito.Integration.importTo(Screw.Matchers)
   */
  screwunit: function() {
    JsMockito.Integration.importTo(Screw.Matchers);
  },

  /**
   * Make the public JsMockito API available to JsTestDriver
   * @see JsMockito.Integration.importTo(window)
   */
  JsTestDriver: function() {
    JsMockito.Integration.importTo(window);
  },

  /**
   * Make the public JsMockito API available to JsUnitTest
   * @see JsMockito.Integration.importTo(JsUnitTest.Unit.Testcase.prototype)
   */
  JsUnitTest: function() {
    JsMockito.Integration.importTo(JsUnitTest.Unit.Testcase.prototype);
  },

  /**
   * Make the public JsMockito API available to YUITest
   * @see JsMockito.Integration.importTo(window)
   */
  YUITest: function() {
    JsMockito.Integration.importTo(window);
  },

  /**
   * Make the public JsMockito API available to QUnit
   * @see JsMockito.Integration.importTo(window)
   */
  QUnit: function() {
    JsMockito.Integration.importTo(window);
  },

  /**
   * Make the public JsMockito API available to jsUnity
   * @see JsMockito.Integration.importTo(jsUnity.env.defaultScope)
   */
  jsUnity: function() {
    JsMockito.Integration.importTo(jsUnity.env.defaultScope);
  },

  /**
   * Make the public JsMockito API available to jSpec
   * @see JsMockito.Integration.importTo(jSpec.defaultContext)
   */
  jSpec: function() {
    JsMockito.Integration.importTo(jSpec.defaultContext);
  }
};