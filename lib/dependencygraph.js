var DependencyGraph = require('dependencygraph');
var extend = require('lodash').extend;
var inherits = require('util').inherits;

module.exports = StealDependencyGraph;

function StealDependencyGraph() {
  if(!(this instanceof StealDependencyGraph)) {
    return new StealDependencyGraph();
  }

  DependencyGraph.call(this);
}

inherits(StealDependencyGraph, DependencyGraph);

extend(StealDependencyGraph.prototype, {

  setup: function() {
    this.originalSteal = global.steal;
    this.originalSystem = global.System;
    var steal = this.steal = require('steal');

    this.localSteal = clone(steal);
    this.buildSteal = clone(steal);
    this.localSteal.System.systemName = 'local';
    this.buildSteal.System.systemName = 'build';

    return {
      localSystem: this.localSteal.System,
      buildSystem: this.buildSteal.System
    };
  },

  teardown: function() {
    global.System = this.originalSystem;
    global.steal = this.originalSteal;
  },

  preBuild: function() {
    global.steal = this.buildSteal;
    global.System = this.buildSteal.System;
  },

  preLocal: function() {
    global.steal = this.localSteal;
    global.System = this.localSteal.System;
  }

});

function clone(steal) {
  return steal.clone(steal.addSteal(steal.System.clone()));
}
