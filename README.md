# dotons
Trying some sheeet

Testing git workflow

## Instructions

### Development

1. `npm install` to install dependencies
 
2. `npm install -g supervisor` to install supervisor globally

3. `npm start` to start expressjs backend. node supervisor will auto-restart on save

4. `npm run watch` and webpack will bundle client side code and update on save


### Production

1. `npm install` to install dependencies

2. `npm install -g supervisor` to install supervisor globally

3. `npm run build` to make webpack bundle and minify client side code

4. `npm run deploy` or `npm run deploy-windows` to run express in production mode

### Contributing
We have a master-branch that is used in production, and a develop-branch in development. Never make changes directly to master
To start working on a new feature, follow this workflow:   
1. Make sure the latest changes are fetched from master by typing git pull origin master  
2. Create a new branch with git checkout -b new-feature-name  
3. Make changes to code.  
4. Add the changed files and commit with a good messages  
5. Push to the new-feature-name branch with git push origin/new-feature-branch  
6. Go to the repository on github and create a pull-request from new-feature-name branch to develop branch.  
7. If the feature is tested and works, make a pull-request from develop to master.  
8. Remove the branch with the following steps  
9. git checkout develop  
10. git branch -D new-feature-branch to delete the local branch  
11. git push origin :new-feature-branch to delete the remote branch  


[wiki](https://github.com/sk222sw/dotons/wiki)
