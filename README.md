# ProMAS Documenter

ProMAS Documenter is a tool for generating the documentation of static and
dynamic predicates written in the Prolog files for the ProMAS. This readme will
explain the usage of this tool as briefly as possible.

## Installation

- Download the latest release for your OS
- Move the file to the your project repository
- Maybe you want to rename the executable to remove the OS and archetype name
- Make sure you have the wiki repository cloned somewhere too

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
     % …
```
