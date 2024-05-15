# CSV Cards

Configure a deck's cards using CSV. It assumes these columns are provided:

- `name` will be used as the prefix file name of the card.
- `count` is how many copies of the card there should be in the deck.
- `frontTemplate` is a path to the template for generating the front of the card.
- `backTemplate` (optional) is a path to the template for generating the back of the card.

These values will not be provided to the template during generation. All other columns will be available during template generation as strings.

Example:

```csv
name,count,frontTemplate,customOption
card-1,1,path/to/front-1,"custom value"
card-2,2,path/to/front-1,"other custom value"
```
