'use strict';
const PENDING = 1
const FULFILLED = 2
const REJECTED = 3

module.exports = class KPromise {
	constructor(executor) {
		//console.log("Executor: " + executor);
		if (typeof executor !== 'function') {
			throw new Error('Executor must be a function');
		}
		
		this.state = PENDING;
		this.value = undefined;
		this.consumers = [];
		
		executor(this.resolve.bind(this), this.reject.bind(this));
		
		this.promise = Object.create(KPromise.prototype, {
			then: { value: this.then.bind(this) }
		});
	}
	
	static deferred() {
		var promiseObj = new KPromise(function () {});
		return promiseObj;
	}

	fulfill(value) {		
		//console.log("Fulfilled");
		if (this.state != PENDING) return;
		this.state = FULFILLED;
		this.value = value;
		this.broadcast();		
	}
	
	reject(reason) {		
		//console.log("reject: " + reason);
		if (this.state != PENDING) return;			
		this.state = REJECTED;
		this.value = reason;
		this.broadcast();		
	}
	
	then(onFulfilled, onRejected) {
		//console.log("Then: "  + onFulfilled);
		//console.log("Then: "  + onRejected);
		//console.log("KPromise Then");
		 var consumer = new KPromise(function () {});
		// Ignore onFulfilled if not a function
		consumer.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		// Ignore onRejected if not a function
		consumer.onRejected = typeof onRejected === 'function' ? onRejected : null;
		// .then() may be called multiple times on the same promise
		this.consumers.push(consumer);
		// It might be that the promise was already resolved... 
		this.broadcast();
		// .then() must return a promise
		return consumer;
	}
	
	broadcast() {
		//console.log("BroadCast");
		var promise = this;
		// Called after promise is resolved
		if (this.state === PENDING) return;
		// All respective callbacks must execute
		var callbackName = this.state == FULFILLED ? 'onFulfilled' : 'onRejected';
		var resolver = this.state == FULFILLED ? 'resolve' : 'reject';
		// onFulfilled/onRejected must be called asynchronously
		setTimeout(function() {
			// Traverse in order, Called only once
			promise.consumers.splice(0).forEach(function(consumer) {
				try {
					//console.log("Slice");
					var callback = consumer[callbackName];
					//console.log("callback: " + callback);
					//console.log("promise.value: " + promise.value);
					// Ignore callback if not a function, else
					// call callback as plain function without context
					if (callback) {
						// Execute the Promise Resolution Procedure:
						consumer.resolve(callback(promise.value)); 
					} else {
						// Resolve in same way as current promise
						consumer[resolver](promise.value);
					}
				} catch (e) {
					consumer.reject(e);
				};
			})
		});
	};
	
	// The Promise Resolution Procedure: will treat values that are thenables/promises
	// and will eventually call either fulfill or reject/throw.
	resolve(x) {
		//console.log("Resolve: " + x);
		var wasCalled, then;
		if (this === x) {
			throw new TypeError('Circular reference: promise value is promise itself');
		}
		if (x instanceof KPromise) {
			x.then(this.resolve.bind(this), this.reject.bind(this));
		} else if (x === Object(x)) {
			try {
				then = x.then;
				if (typeof then === 'function') {
					then.call(x, function resolve(y) {
						// Don't allow multiple calls
						if (wasCalled) return;
						wasCalled = true;
						// Recurse
						this.resolve(y);
					}.bind(this), function reject(reasonY) {
						// Don't allow multiple calls
						if (wasCalled) return;
						wasCalled = true;
						this.reject(reasonY);
					}.bind(this));
				} else {
					this.fulfill(x);
				}
			} catch(e) {
				// Ignore if call was made
				if (wasCalled) return;
				this.reject(e);
			}
		} else {
			this.fulfill(x);
		}
	}
}