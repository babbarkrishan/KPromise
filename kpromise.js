const PENDING = 1
const FULFILLED = 2
const REJECTED = 3

const callLater = (fn) => setTimeout(fn, 0)

module.exports = class KPromise {
	
	constructor(executor) {
		console.log("KPromise Constructor");
		if (typeof executor !== 'function') {
			throw new Error('Executor must be a function');
		}
		this._state = PENDING;
		this._value = undefined;
		this._thenners = [];
		
		this._resolve = this._resolve.bind(this);
		this._reject = this._reject.bind(this);
		
		executor(this._resolve, this._reject);
	}
	
	_resolve(result) {
		try {
			if (this._state === PENDING) {
				this._state = FULFILLED;
				this._value = result;
				while (this._thenners.length > 0) {
					this._handleThenner(this._thenners.pop())
				}
			}
		}
		catch(ex) {
			this._reject(ex);
		}
	}
	
	_reject(reason) {
		try {
			if (this._state === PENDING) {
				this._state = REJECTED;
				this._value = reason;
				while (this._thenners.length > 0) {
					this._handleThenner(this._thenners.pop())
				}
			}
		}
		catch(ex) {
			this._reject(ex);
		}
	}
	
	_handleThenner(thenner) {
		if (this._state === FULFILLED) {
			thenner.onResolved && callLater(() => thenner.onResolved(this._value))
		} else if (this._state === REJECTED) {
			thenner.onRejected && callLater(() => thenner.onRejected(this._value))
		} else {
			this._thenners.push(thenner)
		}
	}	
	
	then(onResolved, onRejected) {
		console.log("KPromise then");
		return new Promise((resolve, reject) => {
		  const thenner = {
			onResolved: (value) => {
			  let nextValue = value
			  if (onResolved) {
				try {
				  nextValue = onResolved(value)
				  if (nextValue && nextValue.then) {
					return nextValue.then(resolve, reject)
				  }
				} catch (err) {
				  return reject(err)
				}
			  }
			  resolve(nextValue)
			},
			onRejected: (value) =>  {
			  let nextValue = value
			  if (onRejected) {
				try {
				  nextValue = onRejected(value)
				  if (nextValue && nextValue.then) {
					return nextValue.then(resolve, reject)
				  }
				} catch (err) {
				  return reject(err)
				}
			  }
			  resolve(nextValue)
			}
		  }
		  this._handleThenner(thenner)
		})
	}
	
	static deferred() {
		return new Promise((resolve, reject) => reject(value))
	}
	done(onResolved) {
		return this.then(onResolved)
	}

	catch(onRejected) {
		return this.then(undefined, onRejected)
	}

	static resolve(value) {
		return new Promise((resolve) => resolve(value))
	}

	static reject(value) {
		return new Promise((resolve, reject) => reject(value))
	}	
}