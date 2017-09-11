## Compilation
In order to compile the extension from sources you need to type the next command in console:
```
npm run dev
```
It will put the extension into `./dist` folder.


### Problems to solve for successful project
In the process of work on the automatic sign in task I've outlined 3 general sign in scenarios for myself:

#### 1. Continuous signup process
Like we've in WebEx or Gmail. A user need to enter login or ID in the first form. 
Then he will be redirected into another form where he need to enter his password. 

**Problem:** these two forms can be located on the different domains. The extension 
should recognize them as the parts of the same process. 

**Solutions:**
1. There are not so much sites which supports a such type of sign in process. We can have some config file 
like it was implemented in the extension which describes whole process.

    **Pros**: 
    - easy to implement.

    **Cons**: 
    - Most likely we will need to care about HTML markdown of the specific sites. So, if HTML will be 
    changed on the target web site, then we will need to update our version too.
    - We will always have some sites which are not described in our config. They will not work properly until we add 
    them directly.
    
2. We can think about fully automated process. In order to do that we need to teach the extension to recognize a 
such processes. It is necessary to analyze as much sites with a such sign in type as possible. 

    **Pros**: 
    - it will work on any web sites out of the box.

    **Cons**: 
    - Complex implementation. We don't have any clear rules to recognize and handle a such process. For example, 
    we will need to handle a such tasks: 
        * Detect login form
        * Handle redirects (if necessary) to another domain
        * Handle problems with wrong credentials.
    - A such sign up implementations are very cusom. There is always a chance that our algorithm will not work for 
    some specific cases.

#### 2. Handling old FRAME-based web sites
There are some old web sites where sign in form and main content area are located in the different 
frames. Possibly on the different domains. The extension should handle a such cases correctly.
  
#### 3. Sign in forms detection algorithm
Right now the extension use very basic sign in forms detection algorithm. See `FormDetector` class 
in `./js/content/forms.js`. I assumed that sign in form has maximum 4 visible inputs: `username`, `password`, `stay logged in checkbox`, `submit button`.
This assumption works for for the most of web sites, but not for all. We will need to implement much more complex 
logic in order to handle the rest of sites. 

#### 4. Emulate user input
For the sample sites it was enough to initialize form fields with basic jQuery code: `$('#username').val('user@mail.com')`.
But this solution will not work in the 100% of cases. Some sites can have tricky JS code for form validation or some 
kind of protection from automated sign up. For example, to avoid hacking of a user's accounts.  

#### 5. CAPTCHA handling
We can think about automatic CAPTCHA handling. There are some services which allows to recognize CAPTCHA. We can evaluate
them and include in the project. For example, like additional paid feature.

#### 6. Different tasks
There are also some other not very obvious cases which need to be handled. For example:
1. We need to think about the case when a user trying to log in with wrong credentials. In the most of cases he will be redirected to the page with sign in 
form. The extension should not start sign in process again.

2. We don't need to sing in a user again once he has signed out manually. But after some time a user should be able to 
sign in again. However, we need to think about sign out by session timeout too. It seems that in this case we don't 
need to have timeout here.

I've started to implement the these two points, but not finished them properly due to lack of time.

## Test task implementation
I've tried to create real architecture for the project. For example, it will be easy to add backend support, 
encryption and etc without any serious modifications.

Some parts of code was taken form my old projects. They're not adopted for ES6 and whole code can look a bit messy. 

I've removed my real passwords for all sites but WebEx. So, you need to modify `./src/js/test-logins.js` and 
recompile it in order to get all things working. You can also try to play with the different web sites by editing entry 
for `extensiondev.com` or adding new one.   

For WebEx and Gmail I've selected config-based approach. It is not enough information to analyze and create flexible 
solution. In addition, it is much more time consuming task. The demo just demonstrates that it is possible to handle a 
such cases.

**Gmail restrictions:** I've handled the case when a user need to enter his login and password. The case when he needs 
to select his identity from the list is trivial.

**WebEx restrictions:** I've implemented support of `WebEx Products` only. It works in some other cases too, but not for 
all products availavle on WebEx web site.

**Optional web site:** it was selected admin panel for WordPress-based site. I've implemented automatic sign in forms 
detection here. As WordPress says, they powers 28% of the internet. So, it is good point to support them all :-). Joke. 

