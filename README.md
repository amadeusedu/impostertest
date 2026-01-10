# Imposter – Question Game

Pass-and-play party game where one player receives a subtly different question and the group votes on who it is.

## Getting Started

```bash
npm install
npx expo start
```

## Gameplay Flow

1. Edit player names and game settings.
2. Each player privately answers their question.
3. Review answers together.
4. Vote privately on the imposter.
5. Reveal results and play again.

## Adding Question Pairs

Question pairs live in `src/data/questions.ts`.

Each entry follows this shape:

```ts
{
  id: 'unique-id',
  category: 'Category Name',
  main: 'Main question shown to most players',
  alt: 'Alternate question shown to imposters'
}
```

Keep `main` and `alt` similar enough that the imposter is not obvious.
