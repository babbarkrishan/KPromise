#Objectives
Created a promise implementation according to Promises/A+ spec which should pass the Promises/A+ Compliance Test Suite. Language used is Javascript (Class Based) and ran on Node.

# KPromise
Promise Implementation as per spec https://github.com/promises-aplus/promises-spec

#Environment
Windows 10

#Steps to install/run
- Clone project code locally. You will see following files
  github.js
  README.md
  kpromise.js
  server.js
  
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
Result 872 passing (49s)

#Assumptions
- Node and NPM already installed and running
