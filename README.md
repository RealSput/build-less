# build-less
Write C/C++ bindings for Node.js, but with less building

# Installation
```
npm i -g @diegab/build-less
```

# Purpose
"build-less" is a tool designed to compile NAPI bindings to plain JavaScript code. 
In my opinion, this might not be useful. This is just a toy project I made. But if you do end up finding a use for it, knock yourself out.

# Usage
Let's start by initiating our project:
```
build-less init my-first-project
cd my-first-project
```
This will create our directory where we will work in, then change into that directory.

Now let's compile our NAPI bindings to JavaScript:
```
build-less build
```
We now have our JavaScript files. But if someone installs our package, their machine will still build our code.

We can fix this by cleaning up our directory, using the "cleanup" command:
```
build-less cleanup
```
This should ONLY be used when you are ABSOLUTELY done with the project's version. But let's say we want to modify the NAPI module. We can then use the `dirty` subcommand:
```
build-less dirty
```
We can now modify our code and build it again. Just don't forget to clean up the code.
Now let's run our program. Run `node .`, and you should see this:
```
Hello, world!
```
If you saw this, it means "build-less" works!
If you didn't, then you might have the wrong/insufficient tools, followed the steps incorrectly, etc.
