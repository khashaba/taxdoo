# Task for Taxdoo

This is a task for Taxdoo, it covers a simple -happy path- automation for one whole booking process. other paths are not covered for the simplicity and the time constrains.
My solution is "Keep it simple stupid" so please don't judge based on that as I'm on vacation :D

## Installation

Use the package manager yarn to install the project.

```bash
yarn cypress open
```
or you can use the run command to run it in the headless mode

```bash
yarn cypress run
```

To only run the web or api you can use this command 
```bash
 yarn cypress run --spec cypress/e2e/{api or web}/
```


## Organizing
The project is split into 2 folders e2e and API
through the command, cypress open you will be able to choose which folder to run.
