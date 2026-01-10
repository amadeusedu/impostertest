export interface QuestionPair {
  id: string;
  category: string;
  main: string;
  alt: string;
}

export const questionPairs: QuestionPair[] = [
  {
    id: 'food-1',
    category: 'Food',
    main: 'What dish could you eat every week?',
    alt: 'What snack could you eat every week?'
  },
  {
    id: 'food-2',
    category: 'Food',
    main: 'What food feels like a special treat?',
    alt: 'What dessert feels like a special treat?'
  },
  {
    id: 'food-3',
    category: 'Food',
    main: 'Which flavor combo is underrated?',
    alt: 'Which spice is underrated?'
  },
  {
    id: 'food-4',
    category: 'Food',
    main: 'What is your go-to comfort meal?',
    alt: 'What is your go-to comfort drink?'
  },
  {
    id: 'food-5',
    category: 'Food',
    main: 'What is the best breakfast for a weekend?',
    alt: 'What is the best brunch for a weekend?'
  },
  {
    id: 'travel-1',
    category: 'Travel',
    main: 'What country would you move to for a year?',
    alt: 'What city would you move to for a year?'
  },
  {
    id: 'travel-2',
    category: 'Travel',
    main: 'What is your dream road trip?',
    alt: 'What is your dream train trip?'
  },
  {
    id: 'travel-3',
    category: 'Travel',
    main: 'Which place felt most relaxing?',
    alt: 'Which place felt most exciting?'
  },
  {
    id: 'travel-4',
    category: 'Travel',
    main: 'What travel souvenir do you always pick?',
    alt: 'What travel photo do you always take?'
  },
  {
    id: 'travel-5',
    category: 'Travel',
    main: 'Where would you go for a surprise weekend?',
    alt: 'What would you do on a surprise weekend?'
  },
  {
    id: 'school-1',
    category: 'School',
    main: 'What subject was secretly fun?',
    alt: 'What subject was surprisingly hard?'
  },
  {
    id: 'school-2',
    category: 'School',
    main: 'What was your favorite class project?',
    alt: 'What was your favorite class field trip?'
  },
  {
    id: 'school-3',
    category: 'School',
    main: 'What school rule felt unnecessary?',
    alt: 'What school rule felt helpful?'
  },
  {
    id: 'school-4',
    category: 'School',
    main: 'What is your most vivid school memory?',
    alt: 'What is your funniest school memory?'
  },
  {
    id: 'school-5',
    category: 'School',
    main: 'Which club would you join now?',
    alt: 'Which club would you start now?'
  },
  {
    id: 'dating-1',
    category: 'Dating',
    main: 'What makes a first date great?',
    alt: 'What makes a first date awkward?'
  },
  {
    id: 'dating-2',
    category: 'Dating',
    main: 'What is a green flag in someone?',
    alt: 'What is a yellow flag in someone?'
  },
  {
    id: 'dating-3',
    category: 'Dating',
    main: 'What is your favorite date setting?',
    alt: 'What is your favorite date activity?'
  },
  {
    id: 'dating-4',
    category: 'Dating',
    main: 'What is a cute small gesture?',
    alt: 'What is a cute big gesture?'
  },
  {
    id: 'dating-5',
    category: 'Dating',
    main: 'What is an ideal weekend together?',
    alt: 'What is an ideal weeknight together?'
  },
  {
    id: 'pop-1',
    category: 'Pop Culture',
    main: 'What trend should make a comeback?',
    alt: 'What trend should disappear forever?'
  },
  {
    id: 'pop-2',
    category: 'Pop Culture',
    main: 'What kind of show do you binge?',
    alt: 'What kind of podcast do you binge?'
  },
  {
    id: 'pop-3',
    category: 'Pop Culture',
    main: 'What type of game night is best?',
    alt: 'What type of movie night is best?'
  },
  {
    id: 'pop-4',
    category: 'Pop Culture',
    main: 'What live event would you attend?',
    alt: 'What live event would you host?'
  },
  {
    id: 'pop-5',
    category: 'Pop Culture',
    main: 'What app do you open the most?',
    alt: 'What app do you wish you used less?'
  },
  {
    id: 'would-1',
    category: 'Would You Rather',
    main: 'Would you rather travel by train or by plane?',
    alt: 'Would you rather travel by car or by boat?'
  },
  {
    id: 'would-2',
    category: 'Would You Rather',
    main: 'Would you rather be early or exactly on time?',
    alt: 'Would you rather be on time or slightly late?'
  },
  {
    id: 'would-3',
    category: 'Would You Rather',
    main: 'Would you rather cook or order in?',
    alt: 'Would you rather bake or buy dessert?'
  },
  {
    id: 'would-4',
    category: 'Would You Rather',
    main: 'Would you rather read a book or watch a series?',
    alt: 'Would you rather read a book or play a game?'
  },
  {
    id: 'would-5',
    category: 'Would You Rather',
    main: 'Would you rather wake up early or stay up late?',
    alt: 'Would you rather take a nap or sleep in?'
  },
  {
    id: 'hot-1',
    category: 'Hot Takes',
    main: 'What food is overrated?',
    alt: 'What food is underrated?'
  },
  {
    id: 'hot-2',
    category: 'Hot Takes',
    main: 'What habit should be more normal?',
    alt: 'What habit should be less normal?'
  },
  {
    id: 'hot-3',
    category: 'Hot Takes',
    main: 'What is the best season of the year?',
    alt: 'What is the most underrated season of the year?'
  },
  {
    id: 'hot-4',
    category: 'Hot Takes',
    main: 'What is the best way to spend a day off?',
    alt: 'What is the worst way to spend a day off?'
  },
  {
    id: 'hot-5',
    category: 'Hot Takes',
    main: 'What is the most useful skill everyone should have?',
    alt: 'What is the most fun skill everyone should have?'
  },
  {
    id: 'social-1',
    category: 'Social',
    main: 'What is your favorite way to catch up with friends?',
    alt: 'What is your favorite way to meet new people?'
  },
  {
    id: 'social-2',
    category: 'Social',
    main: 'What is the best group activity?',
    alt: 'What is the best solo activity?'
  },
  {
    id: 'social-3',
    category: 'Social',
    main: 'What is a perfect game night snack?',
    alt: 'What is a perfect movie night snack?'
  },
  {
    id: 'social-4',
    category: 'Social',
    main: 'What is a great way to celebrate a win?',
    alt: 'What is a great way to recover from a loss?'
  },
  {
    id: 'social-5',
    category: 'Social',
    main: 'What is a hobby you want to try with friends?',
    alt: 'What is a hobby you want to try alone?'
  },
  {
    id: 'work-1',
    category: 'Work',
    main: 'What is your ideal workspace?',
    alt: 'What is your ideal work schedule?'
  },
  {
    id: 'work-2',
    category: 'Work',
    main: 'What makes a meeting productive?',
    alt: 'What makes a meeting draining?'
  },
  {
    id: 'work-3',
    category: 'Work',
    main: 'What is the best team tradition?',
    alt: 'What is the best team tool?'
  },
  {
    id: 'work-4',
    category: 'Work',
    main: 'What kind of project energizes you?',
    alt: 'What kind of project drains you?'
  },
  {
    id: 'work-5',
    category: 'Work',
    main: 'What is your favorite productivity trick?',
    alt: 'What is your favorite focus playlist vibe?'
  },
  {
    id: 'life-1',
    category: 'Lifestyle',
    main: 'What is your perfect morning routine?',
    alt: 'What is your perfect evening routine?'
  },
  {
    id: 'life-2',
    category: 'Lifestyle',
    main: 'What purchase improved your daily life?',
    alt: 'What purchase added fun to your life?'
  },
  {
    id: 'life-3',
    category: 'Lifestyle',
    main: 'What helps you recharge after a long day?',
    alt: 'What helps you focus during a long day?'
  },
  {
    id: 'life-4',
    category: 'Lifestyle',
    main: 'What is your go-to weekend ritual?',
    alt: 'What is your go-to weekday ritual?'
  },
  {
    id: 'life-5',
    category: 'Lifestyle',
    main: 'What kind of space feels cozy?',
    alt: 'What kind of space feels inspiring?'
  },
  {
    id: 'fun-1',
    category: 'Fun',
    main: 'What board game never gets old?',
    alt: 'What card game never gets old?'
  },
  {
    id: 'fun-2',
    category: 'Fun',
    main: 'What is your favorite rainy day activity?',
    alt: 'What is your favorite sunny day activity?'
  },
  {
    id: 'fun-3',
    category: 'Fun',
    main: 'What is your ideal party vibe?',
    alt: 'What is your ideal chill hangout vibe?'
  },
  {
    id: 'fun-4',
    category: 'Fun',
    main: 'What is a skill you want to learn for fun?',
    alt: 'What is a skill you want to learn for work?'
  },
  {
    id: 'fun-5',
    category: 'Fun',
    main: 'What is the best kind of surprise?',
    alt: 'What is the best kind of gift?'
  },
  {
    id: 'dream-1',
    category: 'Dreams',
    main: 'What is a dream trip you have?',
    alt: 'What is a dream home you have?'
  },
  {
    id: 'dream-2',
    category: 'Dreams',
    main: 'What is your dream weekend?',
    alt: 'What is your dream weekday?'
  },
  {
    id: 'dream-3',
    category: 'Dreams',
    main: 'What would you do with a free afternoon?',
    alt: 'What would you do with a free night?'
  },
  {
    id: 'dream-4',
    category: 'Dreams',
    main: 'What is your dream creative project?',
    alt: 'What is your dream skill to master?'
  },
  {
    id: 'dream-5',
    category: 'Dreams',
    main: 'What would you do if you had a bonus day off?',
    alt: 'What would you do if you had a bonus hour off?'
  },
  {
    id: 'random-1',
    category: 'Random',
    main: 'What is the best smell?',
    alt: 'What is the best sound?'
  },
  {
    id: 'random-2',
    category: 'Random',
    main: 'What is your favorite way to learn something new?',
    alt: 'What is your favorite way to teach something new?'
  },
  {
    id: 'random-3',
    category: 'Random',
    main: 'What is a small habit that brings joy?',
    alt: 'What is a small habit that saves time?'
  },
  {
    id: 'random-4',
    category: 'Random',
    main: 'What is a comfort show genre?',
    alt: 'What is a comfort movie genre?'
  },
  {
    id: 'random-5',
    category: 'Random',
    main: 'What is your favorite type of weather?',
    alt: 'What is your favorite time of day?'
  }
];
