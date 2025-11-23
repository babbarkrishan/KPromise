# KPromise
Promise Implementation as per spec https://github.com/promises-aplus/promises-spec

#Objectives
Created a promise implementation according to Promises/A+ spec which should pass the Promises/A+ Compliance Test Suite. Language used is Javascript (Class Based) and ran on Node.

#Environment 
I used following setup
- Windows 10
- NodeJS Version - v11.2.0
- NPM Version - 6.4.1
- Java Version - 1.8.0_171

Also tested on following versions (On another system)
- Windows 8
- NodeJS Version - v4.2.3
- NPM Version - 2.14.7
- Java Version - 1.8.0_25

#Steps to install/run
- Clone project code locally. You will see following files
  - github.js
  - README.md
  - kpromise.js
  - server.js
  
Run following commands on command prompt (In you cloned folder) e.g. for me folder is - D:\Projects\KPromise
- npm install express
- npm install request
- node server.js

Run following URL In Browser
- http://127.0.0.1:8000/github

You will see GitHub profile for user "babbarkrishan"


#Test Cases
This project is passing all the 872 test cases of Promises/A+ Compliance Test Suite. 
To install test suite, run following command in command prompt.
- npm install promises-aplus-tests -g

Then run the test cases using following command
- promises-aplus-tests KPromise.js

For me following was the result
- Result 872 passing (49s)

#Assumptions
- Node and NPM already installed and running
#References
- https://stackoverflow.com/questions/23772801/basic-javascript-promise-implementation-attempt/
- https://gist.github.com/ronkot/5ca27289a3795651f19f78c2b1f7ab16
- https://thecodebarbarian.com/write-your-own-node-js-promise-library-from-scratch.html
- https://gist.github.com/etyumentcev/4dd09c95b1d3cc090b432762eb4b8be1