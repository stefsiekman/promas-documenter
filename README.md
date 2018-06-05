# ProMAS Documenter

ProMAS Documenter is a tool for generating the documentation of static and
dynamic predicates written in the Prolog files for the ProMAS. This readme will
explain the usage of this tool as briefly as possible.

## Installation

- Download the latest release for your OS
- Move the file to the your project repository
- Maybe you want to rename the executable to remove the OS and archetype name
- Make sure you have the wiki repository cloned somewhere too

## Help

To view the help message, run one of the following commands (depends on your OS):

```bash
./promas-documenter --help
```

```bash
promas-documenter.exe --help
```

## Generating wiki pages

## Writing documentation

Documentation can easily be written in the form of a comment above the definition
of a predicate. The following information can be specified:

- A general description
- The predicate definition (a.k.a. call definition)*
- Argument descriptions*
- Users*

\* If these are left out, a warning will be given when analyzing the files.

### Dynamic predicate example

```prolog
% Copied from the starcraft connector.
%
% self(Id, Type)
%
% Id: Given to unit by environment.
% Type: Name of the type of unit.
%
% @user Building manager
% @user BuildingEx agent
self/2,
```

### Static predicate example

```prolog
% Used for calculating the average of two values.
%
% A: The first numeric value.
% B: The second numeric value.
% Average: The mean of the two numeric values.
%
% @user Resource manager
average(A, B, Average) :-
```

### Syntax

- Predicate definition
  - May appear anywhere in the comment
  - Should have the exact same name and variable count as the definition
  - Only taken into account for dynamic predicates
  - Won't appear in description
- Argument descriptions
  - Variable names must match exactly to avoid warnings
  - May span multiple lines
- Users
  - Line must start with `@user`
  - Preferably only with the characters `a-zA-Z` and _space_
- Description
  - Support markdown, but use minimally. Headers should start at `###` level.
  - End when the first argument is described

## Q&A

### What counts as a comment block?

Every line directly above a predicate definition that counts as a comment.
Empty lines interrupt a block, so be careful with that, as will an empty line
above the predicate definition.

### Why does the generation only work from master?

Generating the markdown files will remove all of the files that currently
exist. Maybe you're deleting some predicate in your branch, which would then
also remove the predicate from the wiki. That's why the wiki should only be
updated once a branch has been merged into master. I added the protection just
as extra security.
