# Didiactic demo app with overuse of AOP

This is a TODO App with time boxed tasks, as a demo of a paper on Aspect Oriented Programming

## How to play with it

### Install

> yarn

### Run

> yarn dev

### Modify configuration

Based mainly on two files `src/features.json` and `src/perms.json`
- "features.json" : contains features configuration; feature flipping state, associated actions with perms and quota limitations;
- "perms.json" : describe role/perms associations.

> By default you have a "Contributor" role.

If you want to assign a task to others for exemple, you can add perm "Theta" to the perms list of "Contributor" ...

If you want to clear all your task list, you can use the "nuke button" if you have perms "Phi".

Explore all actions / perms by reading `src\features.json`

### Learn

Aspect oriented programming base on Proxies and Decorators

Aspect (Proxies + Decorators) are describes into `src/helpers/AOP.js`

Proxies are disabled by default, can be toggle in `src/App.vue`, line 9 & 10. (Logging and Profiling "aspect")
Proxies are explain in the 2nd Medium paper.

Decorators are used in `src/services/TaskManager.js`, which is the main business class to run this App.

## Room for improvement

Obviously, there is room for improvment;

Some components should be refactor;

Design/UX is creepy at this stage;

Functionnaly, it will be great to spread task into different list: Upgrade `src/services/TaskManager.js` and `src/pages/TaskViewer.vue` to display; one column by user task list.

Show to the user number of tasks visualy hidden in his task list when overflowed.

Feel free to make a pull request.

## Licence

[CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
