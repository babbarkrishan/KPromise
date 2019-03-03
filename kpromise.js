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
		// 2.2.1.1 ignore onFulfilled if not a function
		consumer.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		// 2.2.1.2 ignore onRejected if not a function
		consumer.onRejected = typeof onRejected === 'function' ? onRejected : null;
		// 2.2.6.1, 2.2.6.2: .then() may be called multiple times on the same promise
		this.consumers.push(consumer);
		// It might be that the promise was already resolved... 
		this.broadcast();
		// 2.2.7: .then() must return a promise
		return consumer;
	}
	
	broadcast() {
		//console.log("BroadCast");
		var promise = this;
		// 2.2.2.1, 2.2.2.2, 2.2.3.1, 2.2.3.2 called after promise is resolved
		if (this.state === PENDING) return;
		// 2.2.6.1, 2.2.6.2 all respective callbacks must execute
		var callbackName = this.state == FULFILLED ? 'onFulfilled' : 'onRejected';
		var resolver = this.state == FULFILLED ? 'resolve' : 'reject';
		// 2.2.4 onFulfilled/onRejected must be called asynchronously
		setTimeout(function() {
			// 2.2.6.1, 2.2.6.2 traverse in order, 2.2.2.3, 2.2.3.3 called only once
			promise.consumers.splice(0).forEach(function(consumer) {
				try {
					//console.log("Slice");
					var callback = consumer[callbackName];
					//console.log("callback: " + callback);
					//console.log("promise.value: " + promise.value);
					// 2.2.1.1, 2.2.1.2 ignore callback if not a function, else
					// 2.2.5 call callback as plain function without context
					if (callback) {
						// 2.2.7.1. execute the Promise Resolution Procedure:
						consumer.resolve(callback(promise.value)); 
					} else {
						// 2.2.7.3 resolve in same way as current promise
						consumer[resolver](promise.value);
					}
				} catch (e) {
					// 2.2.7.2
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
		// 2.3.1
		if (this === x) {
			throw new TypeError('Circular reference: promise value is promise itself');
		}
		// 2.3.2
		if (x instanceof KPromise) {
			// 2.3.2.1, 2.3.2.2, 2.3.2.3
			x.then(this.resolve.bind(this), this.reject.bind(this));
		} else if (x === Object(x)) { // 2.3.3
			try {
				// 2.3.3.1
				then = x.then;
				if (typeof then === 'function') {
					// 2.3.3.3
					then.call(x, function resolve(y) {
						// 2.3.3.3.3 don't allow multiple calls
						if (wasCalled) return;
						wasCalled = true;
						// 2.3.3.3.1 recurse
						this.resolve(y);
					}.bind(this), function reject(reasonY) {
						// 2.3.3.3.3 don't allow multiple calls
						if (wasCalled) return;
						wasCalled = true;
						// 2.3.3.3.2
						this.reject(reasonY);
					}.bind(this));
				} else {
					// 2.3.3.4
					this.fulfill(x);
				}
			} catch(e) {
				// 2.3.3.3.4.1 ignore if call was made
				if (wasCalled) return;
				// 2.3.3.2 or 2.3.3.3.4.2
				this.reject(e);
			}
		} else {
			// 2.3.4
			this.fulfill(x);
		}
	}
}