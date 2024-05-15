# YAML Cards

Configure a deck's cards using YAML. Follows the format

```yaml
cards:
  card-name-1:
    count: integrer
    frontTemplate: path/to/template
    backTemplate: path/to/back
    custom1: 'custom value'
  card-name-2:
    count: integrer
    frontTemplate: path/to/template
    backTemplate: path/to/back
    custom1: 'other custom value'
```

These values are used by the pipeline, and not provided to the template:

- The card key (e.g `card-name-1`) will be used as the prefix file name of the card
- `count` is how many copies of the card there should be in the deck.
- `frontTemplate` is a path to the template for generating the front of the card.
- `backTemplate` (optional) is a path to the template for generating the back of the card.
