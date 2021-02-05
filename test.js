(function () {
  main();

  function main() {
    var arr = ["a", "b", "c"];
    forEach(arr, function (item, index) {
      log(index, "=", item);
    });
$.alert('Done')
  }

  function dir(o) {
    log(o);
    for (var key in o) {
      log("→", key, "=", o[key]);
    }
  }

  function log() {
    $.writeln(toArray(arguments).join(" "));
  }

  function toArray(o) {
    return Array.prototype.slice.call(o);
  }

  function forEach(arr, fn) {
    for (var i = 0, n = arr.length; i < n; i++) {
      fn(arr[i], i, arr);
    }
  }

  function map(arr, fn) {
    for (var i = 0, n = arr.length; i < n; i++) {
      arr[i] = fn(arr[i], i, arr);
    }
  }

  function keys(o) {
    var result = [];
    for (var key in o) {
      if (o.hasOwnProperty(key)) {
        result.push(key);
      }
    }
    return result;
  }
})();
