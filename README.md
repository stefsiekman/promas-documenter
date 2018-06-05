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

To generate the wiki pages, you will need both repositories (i.e. the project
and wiki). Assuming you have the executable in your project repository
directory, you can run the following command to generate a report.

```shell
./promas-documenter --report
```

This will show you a list of warnings, so you know where documentation is still
missing. (Tip: use the `--silent` option if there are too many warnings, and
only check is the count is going down)

If you want to create wiki pages from the predicates in the master branch, you
can run the following command. The `--wiki` argument indicates in which
directory you have the wiki repository. __Make sure this is pulled from the
remote first.__

```shell
./promas-documenter --generate --wiki ../promas.wiki
```

After this is done, don't forget you still have to __commit__ the changes to
the wiki repository.

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

### What happens if a predicate is defined multiple times?

In that case, the application picks the definition with the highest score. The
score is intended to decide which documentation is of a better quality. The
quality is considered to improve most when using the syntax features (such as
argument descriptions). If none of these features are present, the length of
the description is used.
