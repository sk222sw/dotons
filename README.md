# dotons

[wiki](https://github.com/sk222sw/dotons/wiki)

## Instructions

### Development

1. `npm install` to install dependencies
 
2. `npm install -g supervisor` to install supervisor globally

3. `npm start` to start expressjs backend. node supervisor will auto-restart on save

4. `npm run watch` in a new terminal and webpack will bundle client side code and update on save


### Production

1. `npm install` to install dependencies

2. `npm install -g supervisor` to install supervisor globally

3. `webpack -p` to make webpack bundle and minify client side code

4. `npm run deploy` for unix systems or `npm run deploy-windows` on windows to run express in production mode

***

### Contributing
We have at least 2 branches at all times, *Master* and *Develop*.  
* **Master** - only has production-ready code that works and is tested(heh) and is the branch that is pushed to deployment on Digital Ocean. **NEVER** work against this branch.   
* **Develop** - the branch that contains code that works but may not be ready for production yet. **AVOID** working against this branch. 

**Daily workflow**

1. `git checkout -b new-branch` create a new local branch that you will work against  

2. `git pull origin develop` make sure you have the latest changes from develop  

3. Make changes, code and stuf. Drink some coffee, eat a burger.  

4. `git add . ` or `git add filename` to stage the changes for a commit  

5. `git commit -am "This is a meaningful commit message that explains what I've done`

6. `git pull --rebase origin develop` to get the latest changes if someone else has been working.

7. Solve possible conflicts

8. `git checkout develop` to switch branch

9. `git merge --no-ff new-branch` to merge your changes with develop

10. `git push origin develop` finally push your changes to github

11. `git branch -d new-branch` if you want to delete the local branch. Or keep it to work in it again.


**Push to production**

1. Make sure you are on the develop branch and no files are unstaged (else follow Daily Workflow first)

2. `git pull origin develop` to get the latest changes

3. `git checkout master` 

4. `git merge --no-ff develop` merge develop into master

5. `git push origin master` - update remote master branch

6. `git push live master` - push to the live branch (DigitalOcean droplet) 







