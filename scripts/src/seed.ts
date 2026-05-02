import { db, categoriesTable, lessonsTable, activitiesTable, profileTable, achievementsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(achievementsTable);
  await db.delete(activitiesTable);
  await db.delete(lessonsTable);
  await db.delete(categoriesTable);
  await db.delete(profileTable);

  // Seed profile
  await db.insert(profileTable).values({ name: "Explorer", avatarEmoji: "🦄", totalStars: 0, currentStreak: 0 });

  // Seed categories
  const [sightWords, spelling, rhyming, counting, letterMatch, patterns, reading, addition] = await db
    .insert(categoriesTable)
    .values([
      { slug: "sight-words", name: "Sight Words", description: "Learn the most common words by sight!", emoji: "👁️", colorHex: "#FF6B6B", sortOrder: 1 },
      { slug: "spelling", name: "Spelling", description: "Spell words letter by letter!", emoji: "✏️", colorHex: "#4ECDC4", sortOrder: 2 },
      { slug: "rhyming", name: "Rhyming", description: "Find words that sound alike!", emoji: "🎵", colorHex: "#45B7D1", sortOrder: 3 },
      { slug: "counting", name: "Counting", description: "Count objects and numbers!", emoji: "🔢", colorHex: "#96CEB4", sortOrder: 4 },
      { slug: "letter-match", name: "Letters", description: "Match uppercase and lowercase letters!", emoji: "🔤", colorHex: "#FFEAA7", sortOrder: 5 },
      { slug: "patterns", name: "Patterns", description: "Find and complete AB patterns!", emoji: "🔴🔵", colorHex: "#DDA0DD", sortOrder: 6 },
      { slug: "reading", name: "Reading", description: "Read sentences and short stories!", emoji: "📖", colorHex: "#98D8C8", sortOrder: 7 },
      { slug: "addition", name: "Addition", description: "Add numbers together!", emoji: "➕", colorHex: "#F7DC6F", sortOrder: 8 },
    ])
    .returning();

  // ─────────────────────────────────────────────
  // SIGHT WORDS — 8 weeks, 3 lessons/week
  // ─────────────────────────────────────────────
  const dolchPrePrimer = ["the","a","and","is","it","in","can","see","we","I","my","like","go","to","you","said","big","come","here","jump","up","run","not","help","one","two","look","play","me","make","where","yellow","blue","red"];
  const dolchPrimer = ["all","am","are","at","ate","be","black","brown","but","came","did","do","eat","four","get","good","have","he","into","new","no","now","on","our","out","please","pretty","ran","ride","saw","say","she","so","soon","that","there","they","this","too","under","want","was","well","went","what","white","who","will","with","yes"];
  
  const sightWordLessons = [
    // Week 1 – pre-primer basics
    { week: 1, day: 1, title: "First Words: the, a, and", difficulty: "beginner" as const, words: ["the","a","and"] },
    { week: 1, day: 2, title: "First Words: is, it, in", difficulty: "beginner" as const, words: ["is","it","in"] },
    { week: 1, day: 3, title: "First Words: can, see, we", difficulty: "beginner" as const, words: ["can","see","we"] },
    // Week 2
    { week: 2, day: 1, title: "Action Words: go, run, jump", difficulty: "beginner" as const, words: ["go","run","jump"] },
    { week: 2, day: 2, title: "My World: I, my, me", difficulty: "beginner" as const, words: ["I","my","me"] },
    { week: 2, day: 3, title: "Fun Words: like, up, big", difficulty: "beginner" as const, words: ["like","up","big"] },
    // Week 3
    { week: 3, day: 1, title: "More Words: you, said, come", difficulty: "beginner" as const, words: ["you","said","come"] },
    { week: 3, day: 2, title: "Numbers & Colors: one, two, blue", difficulty: "beginner" as const, words: ["one","two","blue"] },
    { week: 3, day: 3, title: "Action Words: look, play, help", difficulty: "beginner" as const, words: ["look","play","help"] },
    // Week 4
    { week: 4, day: 1, title: "Primer Start: all, am, are", difficulty: "intermediate" as const, words: ["all","am","are"] },
    { week: 4, day: 2, title: "Primer: be, do, did", difficulty: "intermediate" as const, words: ["be","do","did"] },
    { week: 4, day: 3, title: "Primer: eat, get, have", difficulty: "intermediate" as const, words: ["eat","get","have"] },
    // Week 5
    { week: 5, day: 1, title: "Primer: he, she, they", difficulty: "intermediate" as const, words: ["he","she","they"] },
    { week: 5, day: 2, title: "Primer: new, now, out", difficulty: "intermediate" as const, words: ["new","now","out"] },
    { week: 5, day: 3, title: "Primer: want, was, went", difficulty: "intermediate" as const, words: ["want","was","went"] },
    // Week 6
    { week: 6, day: 1, title: "Question Words: what, who, where", difficulty: "intermediate" as const, words: ["what","who","where"] },
    { week: 6, day: 2, title: "Primer: will, with, that", difficulty: "intermediate" as const, words: ["will","with","that"] },
    { week: 6, day: 3, title: "Primer: this, there, so", difficulty: "intermediate" as const, words: ["this","there","so"] },
    // Week 7
    { week: 7, day: 1, title: "Advanced: please, pretty, soon", difficulty: "advanced" as const, words: ["please","pretty","soon"] },
    { week: 7, day: 2, title: "Advanced: under, well, too", difficulty: "advanced" as const, words: ["under","well","too"] },
    { week: 7, day: 3, title: "Advanced: saw, ride, came", difficulty: "advanced" as const, words: ["saw","ride","came"] },
    // Week 8
    { week: 8, day: 1, title: "Colors Review: red, blue, yellow", difficulty: "advanced" as const, words: ["red","blue","yellow"] },
    { week: 8, day: 2, title: "Advanced: four, ate, into", difficulty: "advanced" as const, words: ["four","ate","into"] },
    { week: 8, day: 3, title: "Mixed Review Challenge", difficulty: "advanced" as const, words: ["our","brown","white"] },
  ];

  const sightWordImages: Record<string, string> = {
    "the":"📖","a":"🍎","and":"🤝","is":"✅","it":"👆","in":"📦","can":"🥫","see":"👁️","we":"👫","I":"🙋","my":"💎","like":"❤️","go":"🚦","to":"➡️","you":"👉","said":"💬","big":"🐘","come":"👋","here":"📍","jump":"🦘","up":"⬆️","run":"🏃","not":"❌","help":"🆘","one":"1️⃣","two":"2️⃣","look":"🔍","play":"🎮","me":"🪞","make":"🛠️","where":"❓","yellow":"🌟","blue":"🫐","red":"🍎","all":"🌈","am":"😊","are":"👥","at":"📌","ate":"😋","be":"🐝","black":"🖤","brown":"🐻","but":"🤔","came":"🚶","did":"✔️","do":"💪","eat":"🍽️","four":"4️⃣","get":"🎁","good":"👍","have":"🤲","he":"👦","into":"🚪","new":"✨","no":"🚫","now":"⏰","on":"💡","our":"🏠","out":"🚪","please":"🙏","pretty":"🌺","ran":"🏃","ride":"🚲","saw":"🔧","say":"📢","she":"👧","so":"🌟","soon":"⌛","that":"👆","there":"📍","they":"👥","this":"☝️","too":"➕","under":"⬇️","want":"💝","was":"📜","well":"💧","went":"🚶","what":"❓","white":"⬜","who":"🕵️","will":"🔮","with":"🤝","yes":"✅",
  };

  for (const l of sightWordLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: sightWords.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.words.length; i++) {
      const word = l.words[i];
      const wrongWords = dolchPrePrimer.concat(dolchPrimer).filter((w) => w !== word).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [word, ...wrongWords].sort(() => Math.random() - 0.5);
      await db.insert(activitiesTable).values({ lessonId, type: "sight_word_flash", orderIndex: i, contentJson: JSON.stringify({ word, emoji: sightWordImages[word] ?? "📖", hint: `This word is "${word}"`, options, correctAnswer: word }) });
    }
  }

  // ─────────────────────────────────────────────
  // SPELLING — 8 weeks
  // ─────────────────────────────────────────────
  const spellingLessons = [
    { week: 1, day: 1, title: "CVC Words: cat, dog, sun", difficulty: "beginner" as const, words: [{ word:"cat", emoji:"🐱", hint:"A furry pet that meows" }, { word:"dog", emoji:"🐶", hint:"A pet that barks" }, { word:"sun", emoji:"☀️", hint:"It shines in the sky" }] },
    { week: 1, day: 2, title: "CVC Words: hat, bed, cup", difficulty: "beginner" as const, words: [{ word:"hat", emoji:"🎩", hint:"Wear it on your head" }, { word:"bed", emoji:"🛏️", hint:"Sleep in this" }, { word:"cup", emoji:"☕", hint:"Drink from this" }] },
    { week: 1, day: 3, title: "CVC Words: bug, red, pig", difficulty: "beginner" as const, words: [{ word:"bug", emoji:"🐛", hint:"A small creepy crawly" }, { word:"red", emoji:"🍎", hint:"Color of an apple" }, { word:"pig", emoji:"🐷", hint:"Oink oink!" }] },
    { week: 2, day: 1, title: "Animal Words: fox, hen, cow", difficulty: "beginner" as const, words: [{ word:"fox", emoji:"🦊", hint:"Orange, bushy tail" }, { word:"hen", emoji:"🐔", hint:"A mother chicken" }, { word:"cow", emoji:"🐄", hint:"Says moo!" }] },
    { week: 2, day: 2, title: "Toy Words: top, doll, ball", difficulty: "beginner" as const, words: [{ word:"top", emoji:"🪀", hint:"A spinning toy" }, { word:"doll", emoji:"🪆", hint:"A toy to play with" }, { word:"ball", emoji:"⚽", hint:"Round and bouncy" }] },
    { week: 2, day: 3, title: "Food Words: jam, egg, ham", difficulty: "beginner" as const, words: [{ word:"jam", emoji:"🍓", hint:"Sweet spread for toast" }, { word:"egg", emoji:"🥚", hint:"Chickens lay these" }, { word:"ham", emoji:"🥩", hint:"Pink salty meat" }] },
    { week: 3, day: 1, title: "4-Letter Words: cake, bike, rose", difficulty: "intermediate" as const, words: [{ word:"cake", emoji:"🎂", hint:"Birthday treat!" }, { word:"bike", emoji:"🚲", hint:"Ride it with pedals" }, { word:"rose", emoji:"🌹", hint:"A beautiful flower" }] },
    { week: 3, day: 2, title: "4-Letter Words: frog, ship, flag", difficulty: "intermediate" as const, words: [{ word:"frog", emoji:"🐸", hint:"Jumps and says ribbit" }, { word:"ship", emoji:"🚢", hint:"Sails on the ocean" }, { word:"flag", emoji:"🚩", hint:"Flies in the wind" }] },
    { week: 3, day: 3, title: "4-Letter Words: drum, star, tree", difficulty: "intermediate" as const, words: [{ word:"drum", emoji:"🥁", hint:"Bang bang bang!" }, { word:"star", emoji:"⭐", hint:"Twinkles in the sky" }, { word:"tree", emoji:"🌳", hint:"Has leaves and branches" }] },
    { week: 4, day: 1, title: "5-Letter Words: sleep, brain, clown", difficulty: "intermediate" as const, words: [{ word:"sleep", emoji:"😴", hint:"Close your eyes at night" }, { word:"brain", emoji:"🧠", hint:"Think with this!" }, { word:"clown", emoji:"🤡", hint:"Funny circus performer" }] },
    { week: 4, day: 2, title: "5-Letter Words: grape, plant, swing", difficulty: "intermediate" as const, words: [{ word:"grape", emoji:"🍇", hint:"Purple or green fruit" }, { word:"plant", emoji:"🌿", hint:"Water it to grow" }, { word:"swing", emoji:"🏞️", hint:"Whoosh back and forth" }] },
    { week: 4, day: 3, title: "5-Letter Words: cloud, bunny, candy", difficulty: "intermediate" as const, words: [{ word:"cloud", emoji:"☁️", hint:"Floats in the sky" }, { word:"bunny", emoji:"🐰", hint:"Hops and has long ears" }, { word:"candy", emoji:"🍬", hint:"Sweet treat!" }] },
    { week: 5, day: 1, title: "Blends: blue, clap, glow", difficulty: "intermediate" as const, words: [{ word:"blue", emoji:"💙", hint:"Color of the sky" }, { word:"clap", emoji:"👏", hint:"Hands together!" }, { word:"glow", emoji:"✨", hint:"Shines in the dark" }] },
    { week: 5, day: 2, title: "Blends: snap, trip, glad", difficulty: "intermediate" as const, words: [{ word:"snap", emoji:"👌", hint:"Make it click!" }, { word:"trip", emoji:"✈️", hint:"Going somewhere new" }, { word:"glad", emoji:"😊", hint:"Very happy" }] },
    { week: 5, day: 3, title: "Blends: crab, drip, flan", difficulty: "advanced" as const, words: [{ word:"crab", emoji:"🦀", hint:"Has claws, lives in sea" }, { word:"drip", emoji:"💧", hint:"Drop by drop" }, { word:"sled", emoji:"🛷", hint:"Slide on snow!" }] },
    { week: 6, day: 1, title: "Magic-E: name, time, hope", difficulty: "advanced" as const, words: [{ word:"name", emoji:"🏷️", hint:"What people call you" }, { word:"time", emoji:"⏰", hint:"Tick tock!" }, { word:"hope", emoji:"🌈", hint:"Wish for good things" }] },
    { week: 6, day: 2, title: "Magic-E: cute, pine, bone", difficulty: "advanced" as const, words: [{ word:"cute", emoji:"🐱", hint:"Adorable and sweet" }, { word:"pine", emoji:"🌲", hint:"Evergreen tree" }, { word:"bone", emoji:"🦴", hint:"Dogs love to chew these" }] },
    { week: 6, day: 3, title: "Magic-E: wave, kite, mole", difficulty: "advanced" as const, words: [{ word:"wave", emoji:"🌊", hint:"Ocean moves like this" }, { word:"kite", emoji:"🪁", hint:"Flies on a string" }, { word:"mole", emoji:"🦔", hint:"Digs underground" }] },
    { week: 7, day: 1, title: "Digraphs: ship, chin, when", difficulty: "advanced" as const, words: [{ word:"ship", emoji:"🚢", hint:"Big ocean boat" }, { word:"chin", emoji:"🤏", hint:"Bottom of your face" }, { word:"when", emoji:"📅", hint:"Question about time" }] },
    { week: 7, day: 2, title: "Digraphs: this, chop, whip", difficulty: "advanced" as const, words: [{ word:"this", emoji:"☝️", hint:"Points to something close" }, { word:"chop", emoji:"🔪", hint:"Cut into pieces" }, { word:"whip", emoji:"🌀", hint:"Move fast in circles" }] },
    { week: 7, day: 3, title: "Digraphs: shut, each, itch", difficulty: "advanced" as const, words: [{ word:"shut", emoji:"🚪", hint:"Close it tight!" }, { word:"each", emoji:"🌟", hint:"Every single one" }, { word:"itch", emoji:"🖐️", hint:"Scratch scratch scratch" }] },
    { week: 8, day: 1, title: "Review CVC Challenge", difficulty: "advanced" as const, words: [{ word:"jump", emoji:"🦘", hint:"Leap into the air" }, { word:"skip", emoji:"⛷️", hint:"Hop on one foot" }, { word:"clap", emoji:"👏", hint:"Hands together!" }] },
    { week: 8, day: 2, title: "Review Blends Challenge", difficulty: "advanced" as const, words: [{ word:"brave", emoji:"🦁", hint:"Not scared of anything" }, { word:"sweet", emoji:"🍭", hint:"Like candy" }, { word:"fruit", emoji:"🍎", hint:"Grows on trees" }] },
    { week: 8, day: 3, title: "Super Speller Challenge", difficulty: "advanced" as const, words: [{ word:"friend", emoji:"🤝", hint:"Someone who cares about you" }, { word:"spring", emoji:"🌸", hint:"Season after winter" }, { word:"bright", emoji:"💡", hint:"Very shiny and light" }] },
  ];

  for (const l of spellingLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: spelling.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.words.length; i++) {
      const { word, emoji, hint } = l.words[i];
      const letters = word.toUpperCase().split("").sort(() => Math.random() - 0.5);
      await db.insert(activitiesTable).values({ lessonId, type: "spelling_drag", orderIndex: i, contentJson: JSON.stringify({ word, emoji, hint, letters }) });
    }
  }

  // ─────────────────────────────────────────────
  // RHYMING — 8 weeks
  // ─────────────────────────────────────────────
  const rhymingLessons = [
    { week:1, day:1, title:"Rhymes with -at", difficulty:"beginner" as const, pairs:[{ word:"cat", options:["hat","dog","sun","bed"], answer:"hat" },{ word:"bat", options:["mat","cup","pig","bus"], answer:"mat" },{ word:"rat", options:["fat","hop","win","cut"], answer:"fat" }] },
    { week:1, day:2, title:"Rhymes with -ig", difficulty:"beginner" as const, pairs:[{ word:"pig", options:["big","cat","sun","top"], answer:"big" },{ word:"dig", options:["wig","pet","map","cup"], answer:"wig" },{ word:"fig", options:["jig","bus","hop","red"], answer:"jig" }] },
    { week:1, day:3, title:"Rhymes with -op", difficulty:"beginner" as const, pairs:[{ word:"top", options:["hop","big","pet","sun"], answer:"hop" },{ word:"mop", options:["pop","cat","wig","bus"], answer:"pop" },{ word:"cop", options:["shop","red","mat","cup"], answer:"shop" }] },
    { week:2, day:1, title:"Rhymes with -un", difficulty:"beginner" as const, pairs:[{ word:"sun", options:["fun","cat","big","hop"], answer:"fun" },{ word:"bun", options:["run","pet","dog","mat"], answer:"run" },{ word:"gun", options:["pun","big","cup","rat"], answer:"pun" }] },
    { week:2, day:2, title:"Rhymes with -ed", difficulty:"beginner" as const, pairs:[{ word:"bed", options:["red","fun","top","pig"], answer:"red" },{ word:"wed", options:["fed","hop","sun","cat"], answer:"fed" },{ word:"led", options:["shed","big","mat","cup"], answer:"shed" }] },
    { week:2, day:3, title:"Rhymes with -ell", difficulty:"beginner" as const, pairs:[{ word:"bell", options:["shell","top","cat","big"], answer:"shell" },{ word:"well", options:["sell","hop","sun","pig"], answer:"sell" },{ word:"fell", options:["tell","cup","mat","red"], answer:"tell" }] },
    { week:3, day:1, title:"Rhymes with -ake", difficulty:"intermediate" as const, pairs:[{ word:"cake", options:["lake","pig","sun","top"], answer:"lake" },{ word:"bake", options:["make","cup","big","red"], answer:"make" },{ word:"lake", options:["fake","mat","hop","cat"], answer:"fake" }] },
    { week:3, day:2, title:"Rhymes with -ine", difficulty:"intermediate" as const, pairs:[{ word:"mine", options:["vine","top","cup","big"], answer:"vine" },{ word:"pine", options:["dine","cat","sun","mat"], answer:"dine" },{ word:"vine", options:["shine","hop","red","pig"], answer:"shine" }] },
    { week:3, day:3, title:"Rhymes with -ight", difficulty:"intermediate" as const, pairs:[{ word:"light", options:["night","sun","cat","big"], answer:"night" },{ word:"night", options:["right","cup","top","mat"], answer:"right" },{ word:"bright", options:["sight","pig","hop","red"], answer:"sight" }] },
    { week:4, day:1, title:"Rhymes with -ound", difficulty:"intermediate" as const, pairs:[{ word:"round", options:["sound","big","cat","top"], answer:"sound" },{ word:"found", options:["ground","cup","sun","mat"], answer:"ground" },{ word:"sound", options:["pound","pig","red","hop"], answer:"pound" }] },
    { week:4, day:2, title:"Rhymes with -oom", difficulty:"intermediate" as const, pairs:[{ word:"room", options:["bloom","cat","big","top"], answer:"bloom" },{ word:"moon", options:["spoon","cup","sun","mat"], answer:"spoon" },{ word:"boom", options:["zoom","pig","red","hop"], answer:"zoom" }] },
    { week:4, day:3, title:"Rhymes with -ack", difficulty:"intermediate" as const, pairs:[{ word:"back", options:["pack","fun","big","top"], answer:"pack" },{ word:"rack", options:["track","cup","sun","mat"], answer:"track" },{ word:"jack", options:["snack","pig","red","hop"], answer:"snack" }] },
    { week:5, day:1, title:"Rhymes with -ing", difficulty:"intermediate" as const, pairs:[{ word:"ring", options:["king","top","cat","big"], answer:"king" },{ word:"sing", options:["bring","cup","sun","mat"], answer:"bring" },{ word:"king", options:["spring","pig","red","hop"], answer:"spring" }] },
    { week:5, day:2, title:"Rhymes with -old", difficulty:"intermediate" as const, pairs:[{ word:"gold", options:["hold","big","cat","top"], answer:"hold" },{ word:"bold", options:["cold","cup","sun","mat"], answer:"cold" },{ word:"told", options:["fold","pig","red","hop"], answer:"fold" }] },
    { week:5, day:3, title:"Rhymes with -ish", difficulty:"advanced" as const, pairs:[{ word:"fish", options:["wish","top","cat","big"], answer:"wish" },{ word:"wish", options:["dish","cup","sun","mat"], answer:"dish" },{ word:"dish", options:["swish","pig","red","hop"], answer:"swish" }] },
    { week:6, day:1, title:"Rhymes with -ark", difficulty:"advanced" as const, pairs:[{ word:"dark", options:["park","big","cat","top"], answer:"park" },{ word:"park", options:["bark","cup","sun","mat"], answer:"bark" },{ word:"bark", options:["spark","pig","red","hop"], answer:"spark" }] },
    { week:6, day:2, title:"Rhymes with -ump", difficulty:"advanced" as const, pairs:[{ word:"jump", options:["pump","big","cat","top"], answer:"pump" },{ word:"bump", options:["dump","cup","sun","mat"], answer:"dump" },{ word:"hump", options:["trump","pig","red","hop"], answer:"trump" }] },
    { week:6, day:3, title:"Rhymes with -eat", difficulty:"advanced" as const, pairs:[{ word:"beat", options:["heat","big","cat","top"], answer:"heat" },{ word:"heat", options:["seat","cup","sun","mat"], answer:"seat" },{ word:"neat", options:["sweet","pig","red","hop"], answer:"sweet" }] },
    { week:7, day:1, title:"Rhymes with -own", difficulty:"advanced" as const, pairs:[{ word:"town", options:["brown","big","cat","top"], answer:"brown" },{ word:"crown", options:["down","cup","sun","mat"], answer:"down" },{ word:"gown", options:["clown","pig","red","hop"], answer:"clown" }] },
    { week:7, day:2, title:"Rhymes with -air", difficulty:"advanced" as const, pairs:[{ word:"hair", options:["bear","big","cat","top"], answer:"bear" },{ word:"chair", options:["share","cup","sun","mat"], answer:"share" },{ word:"fair", options:["stare","pig","red","hop"], answer:"stare" }] },
    { week:7, day:3, title:"Rhymes with -ail", difficulty:"advanced" as const, pairs:[{ word:"sail", options:["tail","big","cat","top"], answer:"tail" },{ word:"tail", options:["snail","cup","sun","mat"], answer:"snail" },{ word:"mail", options:["trail","pig","red","hop"], answer:"trail" }] },
    { week:8, day:1, title:"Mixed Rhyme Challenge 1", difficulty:"advanced" as const, pairs:[{ word:"bright", options:["night","cup","dog","map"], answer:"night" },{ word:"spring", options:["ring","hop","sun","cat"], answer:"ring" },{ word:"sound", options:["round","pig","bed","top"], answer:"round" }] },
    { week:8, day:2, title:"Mixed Rhyme Challenge 2", difficulty:"advanced" as const, pairs:[{ word:"sweet", options:["neat","big","cup","sun"], answer:"neat" },{ word:"clown", options:["town","cat","hop","pig"], answer:"town" },{ word:"spark", options:["dark","mat","red","cup"], answer:"dark" }] },
    { week:8, day:3, title:"Rhyme Master Challenge", difficulty:"advanced" as const, pairs:[{ word:"dragon", options:["wagon","pig","cup","sun"], answer:"wagon" },{ word:"flower", options:["tower","cat","hop","big"], answer:"tower" },{ word:"cheese", options:["sneeze","mat","top","red"], answer:"sneeze" }] },
  ];

  for (const l of rhymingLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: rhyming.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.pairs.length; i++) {
      const { word, options, answer } = l.pairs[i];
      await db.insert(activitiesTable).values({ lessonId, type: "rhyme_match", orderIndex: i, contentJson: JSON.stringify({ word, options, correctAnswer: answer }) });
    }
  }

  // ─────────────────────────────────────────────
  // COUNTING — 8 weeks
  // ─────────────────────────────────────────────
  const countingLessons = [
    { week:1, day:1, title:"Count to 5 with Stars", difficulty:"beginner" as const, sets:[{emoji:"⭐",count:2,options:[1,2,3,4]},{emoji:"🌙",count:4,options:[2,3,4,5]},{emoji:"☀️",count:3,options:[1,2,3,4]}] },
    { week:1, day:2, title:"Count Animals 1-5", difficulty:"beginner" as const, sets:[{emoji:"🐶",count:3,options:[1,2,3,4]},{emoji:"🐱",count:5,options:[3,4,5,6]},{emoji:"🐸",count:2,options:[1,2,3,4]}] },
    { week:1, day:3, title:"Count Fruits 1-5", difficulty:"beginner" as const, sets:[{emoji:"🍎",count:4,options:[2,3,4,5]},{emoji:"🍌",count:1,options:[1,2,3,4]},{emoji:"🍇",count:5,options:[3,4,5,6]}] },
    { week:2, day:1, title:"Count to 10", difficulty:"beginner" as const, sets:[{emoji:"🌟",count:6,options:[4,5,6,7]},{emoji:"❤️",count:8,options:[6,7,8,9]},{emoji:"🔵",count:10,options:[8,9,10,11]}] },
    { week:2, day:2, title:"Count Toys 6-10", difficulty:"beginner" as const, sets:[{emoji:"🎈",count:7,options:[5,6,7,8]},{emoji:"🏀",count:9,options:[7,8,9,10]},{emoji:"🎀",count:6,options:[4,5,6,7]}] },
    { week:2, day:3, title:"Count Vehicles 6-10", difficulty:"beginner" as const, sets:[{emoji:"🚗",count:8,options:[6,7,8,9]},{emoji:"✈️",count:10,options:[8,9,10,11]},{emoji:"🚢",count:7,options:[5,6,7,8]}] },
    { week:3, day:1, title:"Count to 15", difficulty:"intermediate" as const, sets:[{emoji:"🌸",count:11,options:[9,10,11,12]},{emoji:"🦋",count:13,options:[11,12,13,14]},{emoji:"🌻",count:15,options:[13,14,15,16]}] },
    { week:3, day:2, title:"Count to 20", difficulty:"intermediate" as const, sets:[{emoji:"⚽",count:12,options:[10,11,12,13]},{emoji:"🍭",count:16,options:[14,15,16,17]},{emoji:"🎃",count:20,options:[18,19,20,21]}] },
    { week:3, day:3, title:"Mixed Count 11-20", difficulty:"intermediate" as const, sets:[{emoji:"🦄",count:14,options:[12,13,14,15]},{emoji:"🌈",count:17,options:[15,16,17,18]},{emoji:"⭐",count:19,options:[17,18,19,20]}] },
    { week:4, day:1, title:"Count to 25", difficulty:"intermediate" as const, sets:[{emoji:"🍀",count:21,options:[19,20,21,22]},{emoji:"🌊",count:23,options:[21,22,23,24]},{emoji:"🎵",count:25,options:[23,24,25,26]}] },
    { week:4, day:2, title:"Count to 30", difficulty:"intermediate" as const, sets:[{emoji:"🔴",count:22,options:[20,21,22,23]},{emoji:"💛",count:27,options:[25,26,27,28]},{emoji:"💚",count:30,options:[28,29,30,31]}] },
    { week:4, day:3, title:"Skip Counting by 2s", difficulty:"intermediate" as const, sets:[{emoji:"👟",count:4,options:[2,4,6,8]},{emoji:"🧦",count:6,options:[2,4,6,8]},{emoji:"🐾",count:8,options:[4,6,8,10]}] },
    { week:5, day:1, title:"Skip Count by 2s Challenge", difficulty:"intermediate" as const, sets:[{emoji:"🍒",count:10,options:[6,8,10,12]},{emoji:"🌺",count:12,options:[8,10,12,14]},{emoji:"🦋",count:14,options:[10,12,14,16]}] },
    { week:5, day:2, title:"Count by 5s", difficulty:"intermediate" as const, sets:[{emoji:"🖐️",count:5,options:[3,4,5,6]},{emoji:"⭐",count:10,options:[8,10,12,15]},{emoji:"🌟",count:15,options:[12,15,18,20]}] },
    { week:5, day:3, title:"Count by 10s", difficulty:"advanced" as const, sets:[{emoji:"💰",count:10,options:[5,10,15,20]},{emoji:"🎉",count:20,options:[10,20,25,30]},{emoji:"🏆",count:30,options:[20,25,30,35]}] },
    { week:6, day:1, title:"Ordinal Numbers", difficulty:"advanced" as const, sets:[{emoji:"🥇",count:1,options:[1,2,3,4]},{emoji:"🥈",count:2,options:[1,2,3,4]},{emoji:"🥉",count:3,options:[1,2,3,4]}] },
    { week:6, day:2, title:"Count Mixed Objects", difficulty:"advanced" as const, sets:[{emoji:"🍎",count:15,options:[13,14,15,16]},{emoji:"🌟",count:18,options:[16,17,18,19]},{emoji:"🎈",count:22,options:[20,21,22,23]}] },
    { week:6, day:3, title:"Number Comparison", difficulty:"advanced" as const, sets:[{emoji:"🐠",count:11,options:[9,10,11,12]},{emoji:"🌸",count:24,options:[22,23,24,25]},{emoji:"🦊",count:28,options:[26,27,28,29]}] },
    { week:7, day:1, title:"Count Groups", difficulty:"advanced" as const, sets:[{emoji:"🍌",count:17,options:[15,16,17,18]},{emoji:"🎸",count:13,options:[11,12,13,14]},{emoji:"🌙",count:26,options:[24,25,26,27]}] },
    { week:7, day:2, title:"Big Numbers 21-30", difficulty:"advanced" as const, sets:[{emoji:"🔮",count:25,options:[23,24,25,26]},{emoji:"💎",count:29,options:[27,28,29,30]},{emoji:"🎯",count:23,options:[21,22,23,24]}] },
    { week:7, day:3, title:"Count to 30 Challenge", difficulty:"advanced" as const, sets:[{emoji:"🦁",count:30,options:[28,29,30,31]},{emoji:"🐯",count:27,options:[25,26,27,28]},{emoji:"🐻",count:19,options:[17,18,19,20]}] },
    { week:8, day:1, title:"Number Word Match 1-10", difficulty:"advanced" as const, sets:[{emoji:"🌈",count:7,options:[5,6,7,8]},{emoji:"🎠",count:9,options:[7,8,9,10]},{emoji:"🏖️",count:6,options:[4,5,6,7]}] },
    { week:8, day:2, title:"Super Counter Challenge", difficulty:"advanced" as const, sets:[{emoji:"🧁",count:16,options:[14,15,16,17]},{emoji:"🌴",count:21,options:[19,20,21,22]},{emoji:"🦜",count:28,options:[26,27,28,29]}] },
    { week:8, day:3, title:"Counting Master!", difficulty:"advanced" as const, sets:[{emoji:"⭐",count:30,options:[28,29,30,31]},{emoji:"🎆",count:25,options:[23,24,25,26]},{emoji:"🎇",count:20,options:[18,19,20,21]}] },
  ];

  for (const l of countingLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: counting.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.sets.length; i++) {
      const { emoji, count, options } = l.sets[i];
      const objects = Array(count).fill(emoji);
      await db.insert(activitiesTable).values({ lessonId, type: "counting_tap", orderIndex: i, contentJson: JSON.stringify({ objects, count, options, correctAnswer: count }) });
    }
  }

  // ─────────────────────────────────────────────
  // LETTER MATCH — 8 weeks
  // ─────────────────────────────────────────────
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letterGroups = [
    { week:1, day:1, letters:["A","B","C","D"], title:"Letters A-D" },
    { week:1, day:2, letters:["E","F","G","H"], title:"Letters E-H" },
    { week:1, day:3, letters:["I","J","K","L"], title:"Letters I-L" },
    { week:2, day:1, letters:["M","N","O","P"], title:"Letters M-P" },
    { week:2, day:2, letters:["Q","R","S","T"], title:"Letters Q-T" },
    { week:2, day:3, letters:["U","V","W","X","Y","Z"], title:"Letters U-Z" },
    { week:3, day:1, letters:["A","E","I","O","U"], title:"Vowels!" },
    { week:3, day:2, letters:["B","C","D","F","G"], title:"Consonants B-G" },
    { week:3, day:3, letters:["H","J","K","L","M"], title:"Consonants H-M" },
    { week:4, day:1, letters:["N","P","Q","R","S"], title:"Consonants N-S" },
    { week:4, day:2, letters:["T","V","W","X","Y","Z"], title:"Consonants T-Z" },
    { week:4, day:3, letters:["A","B","C","D","E","F"], title:"Mixed Review A-F" },
    { week:5, day:1, letters:["G","H","I","J","K","L"], title:"Mixed Review G-L" },
    { week:5, day:2, letters:["M","N","O","P","Q","R"], title:"Mixed Review M-R" },
    { week:5, day:3, letters:["S","T","U","V","W","X","Y","Z"], title:"Mixed Review S-Z" },
    { week:6, day:1, letters:["A","B","C","D","E","F","G"], title:"Speed Match A-G" },
    { week:6, day:2, letters:["H","I","J","K","L","M","N"], title:"Speed Match H-N" },
    { week:6, day:3, letters:["O","P","Q","R","S","T","U","V","W","X","Y","Z"], title:"Speed Match O-Z" },
    { week:7, day:1, letters:["A","E","I","O","U","B","D"], title:"Vowel Power!" },
    { week:7, day:2, letters:["C","G","P","T","S","M","N"], title:"Common Consonants" },
    { week:7, day:3, letters:["F","H","J","K","L","Q","R","V","W","X","Y","Z"], title:"Tricky Letters" },
    { week:8, day:1, letters:["A","B","C","D","E","F","G","H","I","J"], title:"Alphabet Sprint A-J" },
    { week:8, day:2, letters:["K","L","M","N","O","P","Q","R","S","T"], title:"Alphabet Sprint K-T" },
    { week:8, day:3, letters:["U","V","W","X","Y","Z","A","E","I","O"], title:"Alphabet Master!" },
  ];

  const letterEmojis: Record<string, string> = { A:"🍎",B:"🐝",C:"🐱",D:"🐶",E:"🐘",F:"🐸",G:"🦒",H:"🐴",I:"🍦",J:"🦘",K:"🦁",L:"🦁",M:"🐒",N:"🦁",O:"🦭",P:"🐼",Q:"👸",R:"🐰",S:"🐍",T:"🐢",U:"☂️",V:"🌋",W:"🐋",X:"🦊",Y:"🍋",Z:"🦓" };

  for (const g of letterGroups) {
    const difficulty = g.week <= 2 ? "beginner" : g.week <= 5 ? "intermediate" : "advanced";
    const lesson = await db.insert(lessonsTable).values({ categoryId: letterMatch.id, title: g.title, week: g.week, dayOrder: g.day, difficulty, isUnlocked: g.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < g.letters.length; i++) {
      const upper = g.letters[i];
      const lower = upper.toLowerCase();
      const otherLetters = alphabet.replace(upper, "").split("").sort(() => Math.random() - 0.5).slice(0, 3).map((l) => l.toLowerCase());
      const options = [lower, ...otherLetters].sort(() => Math.random() - 0.5);
      await db.insert(activitiesTable).values({ lessonId, type: "letter_match", orderIndex: i, contentJson: JSON.stringify({ uppercase: upper, options, correctAnswer: lower, emoji: letterEmojis[upper] ?? "🔤" }) });
    }
  }

  // ─────────────────────────────────────────────
  // AB PATTERNS — 8 weeks
  // ─────────────────────────────────────────────
  const patternLessons = [
    { week:1, day:1, title:"AB Patterns: Shapes", difficulty:"beginner" as const, patterns:[{ sequence:["🔴","🔵","🔴","🔵","❓"], options:["🔴","🔵","🟡","🟢"], answer:"🔴" },{ sequence:["⭐","🌙","⭐","🌙","❓"], options:["⭐","🌙","☀️","🌟"], answer:"⭐" },{ sequence:["🟡","🟢","🟡","🟢","❓"], options:["🟡","🟢","🔴","🔵"], answer:"🟡" }] },
    { week:1, day:2, title:"AB Patterns: Animals", difficulty:"beginner" as const, patterns:[{ sequence:["🐱","🐶","🐱","🐶","❓"], options:["🐱","🐶","🐸","🐻"], answer:"🐱" },{ sequence:["🐸","🐰","🐸","🐰","❓"], options:["🐸","🐰","🐶","🐱"], answer:"🐸" },{ sequence:["🦊","🐻","🦊","🐻","❓"], options:["🦊","🐻","🐱","🐶"], answer:"🦊" }] },
    { week:1, day:3, title:"AB Patterns: Food", difficulty:"beginner" as const, patterns:[{ sequence:["🍎","🍌","🍎","🍌","❓"], options:["🍎","🍌","🍇","🍓"], answer:"🍎" },{ sequence:["🍕","🌮","🍕","🌮","❓"], options:["🍕","🌮","🍔","🍟"], answer:"🍕" },{ sequence:["🍰","🍩","🍰","🍩","❓"], options:["🍰","🍩","🍦","🍪"], answer:"🍰" }] },
    { week:2, day:1, title:"ABB Patterns", difficulty:"beginner" as const, patterns:[{ sequence:["🔴","🔵","🔵","🔴","❓"], options:["🔵","🔴","🟡","🟢"], answer:"🔵" },{ sequence:["⭐","🌙","🌙","⭐","❓"], options:["🌙","⭐","☀️","🌟"], answer:"🌙" },{ sequence:["🐱","🐶","🐶","🐱","❓"], options:["🐶","🐱","🐸","🐻"], answer:"🐶" }] },
    { week:2, day:2, title:"AAB Patterns", difficulty:"beginner" as const, patterns:[{ sequence:["🔴","🔴","🔵","🔴","❓"], options:["🔴","🔵","🟡","🟢"], answer:"🔴" },{ sequence:["🍎","🍎","🍌","🍎","❓"], options:["🍎","🍌","🍇","🍓"], answer:"🍎" },{ sequence:["⭐","⭐","🌙","⭐","❓"], options:["⭐","🌙","☀️","🌟"], answer:"⭐" }] },
    { week:2, day:3, title:"AABB Patterns", difficulty:"beginner" as const, patterns:[{ sequence:["🔴","🔴","🔵","🔵","❓"], options:["🔵","🔴","🟡","🟢"], answer:"🔵" },{ sequence:["🐱","🐱","🐶","🐶","❓"], options:["🐱","🐶","🐸","🐻"], answer:"🐱" },{ sequence:["🍎","🍎","🍌","🍌","❓"], options:["🍌","🍎","🍇","🍓"], answer:"🍌" }] },
    { week:3, day:1, title:"ABC Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["🔴","🔵","🟡","🔴","❓"], options:["🔵","🔴","🟡","🟢"], answer:"🔵" },{ sequence:["⭐","🌙","☀️","⭐","❓"], options:["🌙","⭐","☀️","🌟"], answer:"🌙" },{ sequence:["🐱","🐶","🐸","🐱","❓"], options:["🐶","🐱","🐸","🐻"], answer:"🐶" }] },
    { week:3, day:2, title:"ABAB Growing Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["1️⃣","2️⃣","1️⃣","2️⃣","❓"], options:["1️⃣","2️⃣","3️⃣","4️⃣"], answer:"1️⃣" },{ sequence:["🔺","🔻","🔺","🔻","❓"], options:["🔺","🔻","🔷","🔸"], answer:"🔺" },{ sequence:["🌸","🌺","🌸","🌺","❓"], options:["🌸","🌺","🌻","🌹"], answer:"🌸" }] },
    { week:3, day:3, title:"Color Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["🟣","🟠","🟣","🟠","❓"], options:["🟣","🟠","🟡","🔵"], answer:"🟣" },{ sequence:["🟤","⬛","🟤","⬛","❓"], options:["🟤","⬛","⬜","🟥"], answer:"🟤" },{ sequence:["🟥","🟧","🟩","🟥","❓"], options:["🟧","🟥","🟩","🟦"], answer:"🟧" }] },
    { week:4, day:1, title:"Number Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["1️⃣","2️⃣","3️⃣","1️⃣","❓"], options:["2️⃣","1️⃣","3️⃣","4️⃣"], answer:"2️⃣" },{ sequence:["2️⃣","4️⃣","2️⃣","4️⃣","❓"], options:["2️⃣","4️⃣","6️⃣","8️⃣"], answer:"2️⃣" },{ sequence:["5️⃣","0️⃣","5️⃣","0️⃣","❓"], options:["5️⃣","0️⃣","1️⃣","2️⃣"], answer:"5️⃣" }] },
    { week:4, day:2, title:"Size Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["🔴","🔵","🔴","🔵","❓"], options:["🔴","🔵","🟡","🟢"], answer:"🔴" },{ sequence:["🐭","🐘","🐭","🐘","❓"], options:["🐭","🐘","🦊","🐻"], answer:"🐭" },{ sequence:["🌱","🌲","🌱","🌲","❓"], options:["🌱","🌲","🌳","🌴"], answer:"🌱" }] },
    { week:4, day:3, title:"Weather Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["☀️","🌧️","☀️","🌧️","❓"], options:["☀️","🌧️","⛅","🌈"], answer:"☀️" },{ sequence:["❄️","💨","❄️","💨","❓"], options:["❄️","💨","🌊","⚡"], answer:"❄️" },{ sequence:["🌈","⛅","🌈","⛅","❓"], options:["🌈","⛅","☀️","🌧️"], answer:"🌈" }] },
    { week:5, day:1, title:"ABCABC Patterns", difficulty:"intermediate" as const, patterns:[{ sequence:["🟣","🟠","🟡","🟣","❓"], options:["🟠","🟣","🟡","🔵"], answer:"🟠" },{ sequence:["🐱","🐶","🐸","🐱","❓"], options:["🐶","🐱","🐸","🐻"], answer:"🐶" },{ sequence:["🌙","⭐","☀️","🌙","❓"], options:["⭐","🌙","☀️","🌟"], answer:"⭐" }] },
    { week:5, day:2, title:"Tricky Mixed Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["🔴","🔴","🔵","🔴","❓"], options:["🔴","🔵","🟡","🟢"], answer:"🔴" },{ sequence:["🍎","🍌","🍇","🍎","❓"], options:["🍌","🍎","🍇","🍓"], answer:"🍌" },{ sequence:["🐻","🐯","🦊","🐻","❓"], options:["🐯","🐻","🦊","🐱"], answer:"🐯" }] },
    { week:5, day:3, title:"Season Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["🌸","☀️","🍂","❄️","❓"], options:["🌸","☀️","🍂","❄️"], answer:"🌸" },{ sequence:["☀️","🌸","☀️","🌸","❓"], options:["☀️","🌸","🍂","❄️"], answer:"☀️" },{ sequence:["❄️","🌸","☀️","🍂","❓"], options:["❄️","🌸","☀️","🍂"], answer:"❄️" }] },
    { week:6, day:1, title:"Instrument Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["🎸","🥁","🎸","🥁","❓"], options:["🎸","🥁","🎺","🎻"], answer:"🎸" },{ sequence:["🎺","🎻","🎺","🎻","❓"], options:["🎺","🎻","🥁","🎸"], answer:"🎺" },{ sequence:["🎹","🎵","🎹","🎵","❓"], options:["🎹","🎵","🎸","🥁"], answer:"🎹" }] },
    { week:6, day:2, title:"Sport Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["⚽","🏀","⚽","🏀","❓"], options:["⚽","🏀","🎾","⚾"], answer:"⚽" },{ sequence:["🏈","🎾","🏈","🎾","❓"], options:["🏈","🎾","⚽","🏀"], answer:"🏈" },{ sequence:["⚾","🎱","⚾","🎱","❓"], options:["⚾","🎱","⚽","🏀"], answer:"⚾" }] },
    { week:6, day:3, title:"Transportation Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["🚗","✈️","🚗","✈️","❓"], options:["🚗","✈️","🚢","🚂"], answer:"🚗" },{ sequence:["🚂","🚢","🚂","🚢","❓"], options:["🚂","🚢","🚗","✈️"], answer:"🚂" },{ sequence:["🚲","🛵","🚲","🛵","❓"], options:["🚲","🛵","🚗","✈️"], answer:"🚲" }] },
    { week:7, day:1, title:"Face Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["😀","😢","😀","😢","❓"], options:["😀","😢","😡","😴"], answer:"😀" },{ sequence:["😴","😡","😴","😡","❓"], options:["😴","😡","😀","😢"], answer:"😴" },{ sequence:["🤩","😊","🤩","😊","❓"], options:["🤩","😊","😀","😢"], answer:"🤩" }] },
    { week:7, day:2, title:"Holiday Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["🎄","🎃","🎄","🎃","❓"], options:["🎄","🎃","🎂","🎁"], answer:"🎄" },{ sequence:["🎁","🎂","🎁","🎂","❓"], options:["🎁","🎂","🎄","🎃"], answer:"🎁" },{ sequence:["🎆","🧧","🎆","🧧","❓"], options:["🎆","🧧","🎁","🎂"], answer:"🎆" }] },
    { week:7, day:3, title:"Planet Patterns", difficulty:"advanced" as const, patterns:[{ sequence:["🌍","🌕","🌍","🌕","❓"], options:["🌍","🌕","⭐","☀️"], answer:"🌍" },{ sequence:["⭐","☀️","⭐","☀️","❓"], options:["⭐","☀️","🌍","🌕"], answer:"⭐" },{ sequence:["🪐","🌑","🪐","🌑","❓"], options:["🪐","🌑","🌍","🌕"], answer:"🪐" }] },
    { week:8, day:1, title:"Pattern Master Challenge 1", difficulty:"advanced" as const, patterns:[{ sequence:["🔴","🔵","🟡","🔴","❓"], options:["🔵","🔴","🟡","🟢"], answer:"🔵" },{ sequence:["🐱","🐶","🐸","🐱","❓"], options:["🐶","🐱","🐸","🐻"], answer:"🐶" },{ sequence:["🍎","🍌","🍇","🍎","❓"], options:["🍌","🍎","🍇","🍓"], answer:"🍌" }] },
    { week:8, day:2, title:"Pattern Master Challenge 2", difficulty:"advanced" as const, patterns:[{ sequence:["🎸","🥁","🎺","🎸","❓"], options:["🥁","🎸","🎺","🎻"], answer:"🥁" },{ sequence:["🌙","⭐","☀️","🌙","❓"], options:["⭐","🌙","☀️","🌟"], answer:"⭐" },{ sequence:["⚽","🏀","🎾","⚽","❓"], options:["🏀","⚽","🎾","⚾"], answer:"🏀" }] },
    { week:8, day:3, title:"Ultimate Pattern Master!", difficulty:"advanced" as const, patterns:[{ sequence:["🌸","☀️","🍂","❄️","❓"], options:["🌸","☀️","🍂","❄️"], answer:"🌸" },{ sequence:["😀","😢","😡","😀","❓"], options:["😢","😀","😡","😴"], answer:"😢" },{ sequence:["🎄","🎃","🎁","🎄","❓"], options:["🎃","🎄","🎁","🎂"], answer:"🎃" }] },
  ];

  for (const l of patternLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: patterns.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.patterns.length; i++) {
      const { sequence, options, answer } = l.patterns[i];
      await db.insert(activitiesTable).values({ lessonId, type: "pattern_fill", orderIndex: i, contentJson: JSON.stringify({ sequence, options, correctAnswer: answer }) });
    }
  }

  // ─────────────────────────────────────────────
  // READING PASSAGES — 8 weeks
  // ─────────────────────────────────────────────
  const readingLessons = [
    { week:1, day:1, title:"The Big Red Dog", difficulty:"beginner" as const, passages:[{ text:"The dog is big. The dog is red. The dog can run fast.", question:"What color is the dog?", options:["Red","Blue","Green","Yellow"], answer:"Red" },{ text:"The dog likes to play. The dog plays in the sun.", question:"Where does the dog play?", options:["In the sun","In the rain","In the snow","Inside"], answer:"In the sun" },{ text:"The big red dog is happy. He wags his tail.", question:"How does the dog feel?", options:["Happy","Sad","Angry","Sleepy"], answer:"Happy" }] },
    { week:1, day:2, title:"My Cat Sam", difficulty:"beginner" as const, passages:[{ text:"I have a cat. My cat is Sam. Sam is black and white.", question:"What is the cat's name?", options:["Sam","Max","Leo","Mittens"], answer:"Sam" },{ text:"Sam likes to sleep. Sam sleeps on my bed.", question:"Where does Sam sleep?", options:["On the bed","On the floor","On a chair","Outside"], answer:"On the bed" },{ text:"I love my cat Sam. Sam loves me too.", question:"Who loves Sam?", options:["I do","Sam's mom","The dog","Nobody"], answer:"I do" }] },
    { week:1, day:3, title:"A Walk in the Park", difficulty:"beginner" as const, passages:[{ text:"I go for a walk. I walk in the park. I see the trees.", question:"Where does the child walk?", options:["In the park","At home","At school","In the store"], answer:"In the park" },{ text:"I see a blue bird. The bird can fly up high.", question:"What color is the bird?", options:["Blue","Red","Yellow","Green"], answer:"Blue" },{ text:"I like the park. It is fun to walk here.", question:"How does the child feel about the park?", options:["They like it","They hate it","They are scared","They are bored"], answer:"They like it" }] },
    { week:2, day:1, title:"The Little Seed", difficulty:"beginner" as const, passages:[{ text:"A little seed went into the ground. The rain came down.", question:"Where did the seed go?", options:["Into the ground","Into the sky","Into the water","Into a pot"], answer:"Into the ground" },{ text:"The sun came out. The seed began to grow up.", question:"What helped the seed grow?", options:["The sun","The snow","The wind","The dark"], answer:"The sun" },{ text:"A little green plant came up. It had two small leaves.", question:"What came up from the ground?", options:["A green plant","A red flower","A big tree","A small bug"], answer:"A green plant" }] },
    { week:2, day:2, title:"Rainy Day Fun", difficulty:"beginner" as const, passages:[{ text:"It is raining today. I cannot go outside to play.", question:"Why can't the child go outside?", options:["It is raining","It is too hot","It is dark","Mom said no"], answer:"It is raining" },{ text:"I can read a book inside. Books are so much fun!", question:"What will the child do inside?", options:["Read a book","Watch TV","Take a nap","Eat lunch"], answer:"Read a book" },{ text:"I like rainy days. They are cozy and warm inside.", question:"How does the child feel about rainy days?", options:["They like them","They hate them","They are scared","They feel sick"], answer:"They like them" }] },
    { week:2, day:3, title:"Baby Bear's Honey", difficulty:"beginner" as const, passages:[{ text:"Baby Bear loves honey. Honey is sweet and good.", question:"What does Baby Bear love?", options:["Honey","Fish","Berries","Apples"], answer:"Honey" },{ text:"Baby Bear looks for honey in the woods. He looks in the trees.", question:"Where does Baby Bear look for honey?", options:["In the trees","In the river","In a cave","At home"], answer:"In the trees" },{ text:"Baby Bear finds a big pot of honey. He is so happy!", question:"How does Baby Bear feel when he finds honey?", options:["Happy","Sad","Angry","Scared"], answer:"Happy" }] },
    { week:3, day:1, title:"The Space Explorer", difficulty:"intermediate" as const, passages:[{ text:"Zara is an explorer. She flies in a rocket to outer space.", question:"Where does Zara fly?", options:["Outer space","The ocean","The mountains","The jungle"], answer:"Outer space" },{ text:"Zara sees many planets. The planets are big and round.", question:"What does Zara see in space?", options:["Planets","Fish","Trees","Houses"], answer:"Planets" },{ text:"Zara visits a red planet. It is called Mars. Zara waves hello!", question:"What color is the planet Zara visits?", options:["Red","Blue","Green","Yellow"], answer:"Red" }] },
    { week:3, day:2, title:"The Helpful Robot", difficulty:"intermediate" as const, passages:[{ text:"Bolt is a little robot. Bolt likes to help people.", question:"What does Bolt like to do?", options:["Help people","Sleep all day","Eat candy","Play games"], answer:"Help people" },{ text:"Bolt can clean up toys. Bolt can water the plants.", question:"What can Bolt do? (Pick one)", options:["Water the plants","Cook dinner","Drive a car","Read books"], answer:"Water the plants" },{ text:"Everyone loves Bolt. Bolt makes everyone smile!", question:"How do people feel about Bolt?", options:["They love Bolt","They hate Bolt","They fear Bolt","They ignore Bolt"], answer:"They love Bolt" }] },
    { week:3, day:3, title:"The Magic Paintbrush", difficulty:"intermediate" as const, passages:[{ text:"Maya has a magic paintbrush. Everything she paints comes to life!", question:"What is special about Maya's paintbrush?", options:["It's magic","It's gold","It's very big","It talks"], answer:"It's magic" },{ text:"Maya paints a butterfly. The butterfly flies away into the sky.", question:"What did Maya paint first?", options:["A butterfly","A flower","A rainbow","A star"], answer:"A butterfly" },{ text:"Maya paints a rainbow. Red, orange, yellow, green, blue, and purple!", question:"What did Maya paint that had many colors?", options:["A rainbow","A flower","A butterfly","A cloud"], answer:"A rainbow" }] },
    { week:4, day:1, title:"Ocean Friends", difficulty:"intermediate" as const, passages:[{ text:"Deep in the ocean live many fish. Some are tiny, some are huge!", question:"Where do the fish live?", options:["In the ocean","In a pond","In a river","In a lake"], answer:"In the ocean" },{ text:"A dolphin leaps out of the water. Dolphins love to jump and play.", question:"What does the dolphin love to do?", options:["Jump and play","Sleep all day","Eat seaweed","Hide in caves"], answer:"Jump and play" },{ text:"An octopus has eight arms. It can change colors to hide!", question:"How many arms does an octopus have?", options:["Eight","Four","Two","Six"], answer:"Eight" }] },
    { week:4, day:2, title:"Growing a Garden", difficulty:"intermediate" as const, passages:[{ text:"Lily plants seeds in the garden. She digs small holes with a shovel.", question:"What does Lily use to dig holes?", options:["A shovel","Her hands","A stick","A spoon"], answer:"A shovel" },{ text:"Every day, Lily waters the seeds. She sings to them too!", question:"What does Lily do every day?", options:["Waters the seeds","Eats the seeds","Moves the seeds","Forgets the seeds"], answer:"Waters the seeds" },{ text:"Weeks later, colorful flowers bloom! Lily is so proud of her garden.", question:"What grew in Lily's garden?", options:["Colorful flowers","Big trees","Vegetables","Weeds"], answer:"Colorful flowers" }] },
    { week:4, day:3, title:"The Brave Little Tugboat", difficulty:"intermediate" as const, passages:[{ text:"Tommy is a little tugboat. He lives in a busy harbor.", question:"Where does Tommy live?", options:["A harbor","A pond","A river","The ocean"], answer:"A harbor" },{ text:"Big ships cannot steer well near shore. Tommy helps push them safely.", question:"What does Tommy help with?", options:["Pushing big ships","Catching fish","Carrying cargo","Painting boats"], answer:"Pushing big ships" },{ text:"One stormy night, Tommy rescues a sailboat in danger. Everyone cheers!", question:"What did Tommy rescue?", options:["A sailboat","A big ship","A raft","A canoe"], answer:"A sailboat" }] },
    { week:5, day:1, title:"Dinosaur Days", difficulty:"intermediate" as const, passages:[{ text:"Long ago, dinosaurs roamed the Earth. Some were as big as houses!", question:"How big were some dinosaurs?", options:["As big as houses","As big as cats","As big as people","As big as dogs"], answer:"As big as houses" },{ text:"T. rex was a meat-eater. It had very tiny arms but huge teeth.", question:"What was special about T. rex's teeth?", options:["They were huge","They were tiny","They were blue","They fell out"], answer:"They were huge" },{ text:"Triceratops had three horns on its head. It ate only plants.", question:"How many horns did Triceratops have?", options:["Three","One","Two","Four"], answer:"Three" }] },
    { week:5, day:2, title:"The Cloud Maker", difficulty:"intermediate" as const, passages:[{ text:"High up in the sky, Clara makes clouds. She puffs them out like cotton candy.", question:"What does Clara make?", options:["Clouds","Rain","Snow","Wind"], answer:"Clouds" },{ text:"When Clara blows hard, the clouds make rain. The flowers drink it up.", question:"What do the flowers do with rain?", options:["Drink it up","Float in it","Play in it","Ignore it"], answer:"Drink it up" },{ text:"Sometimes Clara makes tiny clouds that look like animals. Can you see the bunny?", question:"What shape does Clara sometimes make the clouds?", options:["Animals","Stars","Hearts","Letters"], answer:"Animals" }] },
    { week:5, day:3, title:"A Trip to the Library", difficulty:"advanced" as const, passages:[{ text:"Emma loves the library. There are thousands of books on every topic!", question:"Why does Emma love the library?", options:["Thousands of books","Free candy","Toy room","Swimming pool"], answer:"Thousands of books" },{ text:"Emma picks a book about volcanoes. She learns they shoot out hot lava.", question:"What does Emma's book teach her about?", options:["Volcanoes","Dinosaurs","Space","Animals"], answer:"Volcanoes" },{ text:"The librarian helps Emma find more books. Together they build a reading list.", question:"Who helps Emma find more books?", options:["The librarian","Her friend","Her mom","Her teacher"], answer:"The librarian" }] },
    { week:6, day:1, title:"Building a Sandcastle", difficulty:"advanced" as const, passages:[{ text:"At the beach, Sam and Mia build a huge sandcastle. They use buckets and shovels.", question:"What do Sam and Mia use to build the sandcastle?", options:["Buckets and shovels","Spoons and cups","Hands only","Sticks and leaves"], answer:"Buckets and shovels" },{ text:"The castle has three towers and a moat filled with water from the sea.", question:"How many towers does the castle have?", options:["Three","Two","Four","Five"], answer:"Three" },{ text:"A wave washes over the castle. They laugh and start building again!", question:"What happens to the castle?", options:["A wave washes over it","The sun melts it","Birds eat it","It gets too big"], answer:"A wave washes over it" }] },
    { week:6, day:2, title:"The Penguin's Party", difficulty:"advanced" as const, passages:[{ text:"Pedro the penguin was turning five! He sent invitations to all his friends on the ice.", question:"What was Pedro celebrating?", options:["His birthday","His graduation","A new home","A new friend"], answer:"His birthday" },{ text:"His friends brought fish, snowballs, and icy treats. They danced and slid on the ice.", question:"What did they do at the party?", options:["Danced and slid on ice","Watched movies","Went swimming","Flew south"], answer:"Danced and slid on ice" },{ text:"At the end, Pedro blew out five candles. Everyone sang Happy Birthday!", question:"How many candles did Pedro blow out?", options:["Five","Three","Two","Ten"], answer:"Five" }] },
    { week:6, day:3, title:"The Scientist's Lab", difficulty:"advanced" as const, passages:[{ text:"Dr. Rosa loves science. Her lab is full of colorful liquids and bubbling tubes.", question:"What is Dr. Rosa's lab full of?", options:["Colorful liquids and tubes","Books and papers","Toys and games","Plants and flowers"], answer:"Colorful liquids and tubes" },{ text:"Today she mixes red and blue. The mixture turns purple! Science is amazing.", question:"What color does red and blue make?", options:["Purple","Green","Orange","Yellow"], answer:"Purple" },{ text:"Dr. Rosa writes notes in her journal. She never forgets her discoveries.", question:"What does Dr. Rosa write in?", options:["Her journal","A book","Her hand","A computer"], answer:"Her journal" }] },
    { week:7, day:1, title:"The Rainbow Fish", difficulty:"advanced" as const, passages:[{ text:"A fish with rainbow scales lived in the deep blue sea. Everyone admired her sparkle.", question:"Where did the rainbow fish live?", options:["In the deep blue sea","In a pond","In a stream","In a fish tank"], answer:"In the deep blue sea" },{ text:"A little fish asked for one of her shiny scales. She felt sad to give it away.", question:"How did the rainbow fish feel about giving away a scale?", options:["Sad","Happy","Excited","Confused"], answer:"Sad" },{ text:"But when she shared, all the fish became friends. Sharing made her heart glow.", question:"What happened when she shared?", options:["All fish became friends","She lost all her scales","She swam away","She felt worse"], answer:"All fish became friends" }] },
    { week:7, day:2, title:"The Girl Who Talked to Trees", difficulty:"advanced" as const, passages:[{ text:"Nila could whisper to trees, and the trees would whisper back. Their voices sounded like rustling leaves.", question:"What did the trees' voices sound like?", options:["Rustling leaves","Thunder","Singing birds","Running water"], answer:"Rustling leaves" },{ text:"One day a tree said it was thirsty. Nila carried buckets of water all afternoon.", question:"What did Nila do when the tree was thirsty?", options:["Carried buckets of water","Planted new trees","Called for help","Did nothing"], answer:"Carried buckets of water" },{ text:"The grateful tree dropped golden apples at Nila's feet. Friendship is worth its weight in gold.", question:"What did the tree give Nila?", options:["Golden apples","Silver leaves","A bird's nest","Honey"], answer:"Golden apples" }] },
    { week:7, day:3, title:"A Letter from Camp", difficulty:"advanced" as const, passages:[{ text:"Dear Mom, I am at Camp Pine Tree. I swim in the lake every morning. It is cold but fun!", question:"What does the child do every morning at camp?", options:["Swim in the lake","Eat breakfast","Go hiking","Sleep in"], answer:"Swim in the lake" },{ text:"Yesterday we went on a hike. We saw a deer and two rabbits! I took pictures.", question:"What animals did they see on the hike?", options:["A deer and two rabbits","A bear and a fox","Three owls","Birds only"], answer:"A deer and two rabbits" },{ text:"I miss you, but I am having the best summer ever. Love, Jamie", question:"How does Jamie feel about the summer?", options:["It's the best ever","It's boring","It's scary","It's too cold"], answer:"It's the best ever" }] },
    { week:8, day:1, title:"The Dragon Who Was Afraid of Fire", difficulty:"advanced" as const, passages:[{ text:"Ember the dragon had a problem — she sneezed fire, and it scared everyone away.", question:"What happened when Ember sneezed?", options:["She sneezed fire","She turned green","She flew away","She cried"], answer:"She sneezed fire" },{ text:"A clever princess didn't run away. She gave Ember a pepper-proof nose shield.", question:"What did the princess give Ember?", options:["A nose shield","A hat","A blanket","A potion"], answer:"A nose shield" },{ text:"Now Ember can sneeze safely. She and the princess go on adventures together.", question:"What do Ember and the princess do together?", options:["Go on adventures","Stay inside","Read books","Sleep all day"], answer:"Go on adventures" }] },
    { week:8, day:2, title:"The Girl Who Invented Wheels", difficulty:"advanced" as const, passages:[{ text:"Long ago, a girl named Ivy was tired of carrying heavy rocks. She thought there must be a better way.", question:"Why was Ivy tired?", options:["Carrying heavy rocks","Walking far","Climbing trees","Building walls"], answer:"Carrying heavy rocks" },{ text:"Ivy rolled a log under a rock and pushed. The rock moved much more easily!", question:"What did Ivy use to move the rock more easily?", options:["A log","A rope","A stick","Her feet"], answer:"A log" },{ text:"Ivy's idea became the wheel! She changed the world with one big thought.", question:"What did Ivy invent?", options:["The wheel","A bridge","A boat","A ladder"], answer:"The wheel" }] },
    { week:8, day:3, title:"Reading Champion", difficulty:"advanced" as const, passages:[{ text:"You have been reading all summer long. Every page you read grew your brain bigger!", question:"What grew bigger when you read?", options:["Your brain","Your arms","Your eyes","Your feet"], answer:"Your brain" },{ text:"Words are like superpowers. The more words you know, the stronger you become.", question:"What are words compared to?", options:["Superpowers","Food","Toys","Games"], answer:"Superpowers" },{ text:"Keep reading every day. Every book is a new adventure waiting just for you!", question:"What is every book like?", options:["A new adventure","A nap","A chore","A test"], answer:"A new adventure" }] },
  ];

  for (const l of readingLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: reading.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.passages.length; i++) {
      const { text, question, options, answer } = l.passages[i];
      await db.insert(activitiesTable).values({ lessonId, type: "reading_passage", orderIndex: i, contentJson: JSON.stringify({ passage: text, question, options, correctAnswer: answer }) });
    }
  }

  // ─────────────────────────────────────────────
  // ADDITION — 8 weeks
  // ─────────────────────────────────────────────
  const additionLessons = [
    { week:1, day:1, title:"Adding 1 to numbers 1-5", difficulty:"beginner" as const, problems:[{a:1,b:1,e:"🍎"},{a:2,b:1,e:"🌟"},{a:3,b:1,e:"🐶"}] },
    { week:1, day:2, title:"Adding 2 to numbers 1-5", difficulty:"beginner" as const, problems:[{a:1,b:2,e:"🍌"},{a:2,b:2,e:"🐱"},{a:3,b:2,e:"⭐"}] },
    { week:1, day:3, title:"Adding 0 (identity)", difficulty:"beginner" as const, problems:[{a:3,b:0,e:"🎈"},{a:5,b:0,e:"🌈"},{a:4,b:0,e:"🎀"}] },
    { week:2, day:1, title:"Sums to 5", difficulty:"beginner" as const, problems:[{a:2,b:3,e:"🍪"},{a:4,b:1,e:"🌸"},{a:3,b:2,e:"🦋"}] },
    { week:2, day:2, title:"Doubles 1+1 to 3+3", difficulty:"beginner" as const, problems:[{a:1,b:1,e:"🐠"},{a:2,b:2,e:"🌻"},{a:3,b:3,e:"🎵"}] },
    { week:2, day:3, title:"Mixed Sums to 5 Review", difficulty:"beginner" as const, problems:[{a:1,b:3,e:"🍓"},{a:0,b:4,e:"🦄"},{a:2,b:2,e:"🌟"}] },
    { week:3, day:1, title:"Adding to 6 and 7", difficulty:"intermediate" as const, problems:[{a:4,b:2,e:"🎸"},{a:3,b:4,e:"🌙"},{a:5,b:2,e:"🍊"}] },
    { week:3, day:2, title:"Adding to 8 and 9", difficulty:"intermediate" as const, problems:[{a:5,b:3,e:"🐸"},{a:4,b:4,e:"🦊"},{a:6,b:3,e:"🌺"}] },
    { week:3, day:3, title:"Sums to 10", difficulty:"intermediate" as const, problems:[{a:7,b:2,e:"⚽"},{a:5,b:5,e:"🍭"},{a:8,b:2,e:"🎂"}] },
    { week:4, day:1, title:"Doubles to 5+5", difficulty:"intermediate" as const, problems:[{a:4,b:4,e:"🍇"},{a:5,b:5,e:"🌊"},{a:3,b:3,e:"🎃"}] },
    { week:4, day:2, title:"Adding 10", difficulty:"intermediate" as const, problems:[{a:10,b:1,e:"🔮"},{a:10,b:2,e:"💎"},{a:10,b:3,e:"🏆"}] },
    { week:4, day:3, title:"Mixed Sums to 10 Review", difficulty:"intermediate" as const, problems:[{a:6,b:4,e:"🐙"},{a:7,b:3,e:"🦁"},{a:9,b:1,e:"🌝"}] },
    { week:5, day:1, title:"Sums to 12", difficulty:"intermediate" as const, problems:[{a:7,b:5,e:"🎯"},{a:8,b:4,e:"🌏"},{a:6,b:6,e:"🎠"}] },
    { week:5, day:2, title:"Sums to 15", difficulty:"intermediate" as const, problems:[{a:9,b:6,e:"🦅"},{a:8,b:7,e:"🌴"},{a:10,b:5,e:"🎪"}] },
    { week:5, day:3, title:"Adding 3 numbers (easy)", difficulty:"advanced" as const, problems:[{a:1,b:2,c:3,e:"🌟"},{a:2,b:2,c:2,e:"🍀"},{a:3,b:1,c:2,e:"🦋"}] },
    { week:6, day:1, title:"Sums to 20", difficulty:"advanced" as const, problems:[{a:11,b:9,e:"🌠"},{a:12,b:8,e:"🎆"},{a:15,b:5,e:"🏖️"}] },
    { week:6, day:2, title:"Adding teens", difficulty:"advanced" as const, problems:[{a:10,b:6,e:"🧊"},{a:10,b:9,e:"🌋"},{a:10,b:7,e:"🗺️"}] },
    { week:6, day:3, title:"Mixed Sums to 20", difficulty:"advanced" as const, problems:[{a:13,b:7,e:"🏅"},{a:14,b:6,e:"🎖️"},{a:16,b:4,e:"🏆"}] },
    { week:7, day:1, title:"Adding to 25", difficulty:"advanced" as const, problems:[{a:15,b:8,e:"🌞"},{a:12,b:10,e:"🌝"},{a:20,b:5,e:"⚡"}] },
    { week:7, day:2, title:"Story Problems (easy)", difficulty:"advanced" as const, problems:[{a:3,b:4,story:"3 birds + 4 birds = ? birds",e:"🐦"},{a:5,b:5,story:"5 fish + 5 fish = ? fish",e:"🐟"},{a:4,b:6,story:"4 frogs + 6 frogs = ? frogs",e:"🐸"}] },
    { week:7, day:3, title:"Story Problems (medium)", difficulty:"advanced" as const, problems:[{a:7,b:8,story:"7 stars + 8 stars = ? stars",e:"⭐"},{a:9,b:9,story:"9 hearts + 9 hearts = ? hearts",e:"❤️"},{a:6,b:7,story:"6 moons + 7 moons = ? moons",e:"🌙"}] },
    { week:8, day:1, title:"Addition Champion 1-10", difficulty:"advanced" as const, problems:[{a:4,b:7,e:"🎖️"},{a:8,b:6,e:"🏆"},{a:9,b:4,e:"🥇"}] },
    { week:8, day:2, title:"Addition Champion 10-20", difficulty:"advanced" as const, problems:[{a:11,b:8,e:"💫"},{a:13,b:9,e:"✨"},{a:16,b:7,e:"🌟"}] },
    { week:8, day:3, title:"Math Master Challenge!", difficulty:"advanced" as const, problems:[{a:10,b:10,e:"🎉"},{a:15,b:8,e:"🎊"},{a:12,b:12,e:"🎈"}] },
  ];

  for (const l of additionLessons) {
    const lesson = await db.insert(lessonsTable).values({ categoryId: addition.id, title: l.title, week: l.week, dayOrder: l.day, difficulty: l.difficulty, isUnlocked: l.week <= 2 }).returning();
    const lessonId = lesson[0].id;
    for (let i = 0; i < l.problems.length; i++) {
      const prob = l.problems[i] as { a: number; b: number; c?: number; e: string; story?: string };
      const total = prob.c != null ? prob.a + prob.b + prob.c : prob.a + prob.b;
      const wrongAnswers = [total - 1, total + 1, total + 2].filter((n) => n >= 0 && n !== total);
      const options = [total, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);
      const objects = prob.c != null
        ? [Array(prob.a).fill(prob.e), "➕", Array(prob.b).fill(prob.e), "➕", Array(prob.c).fill(prob.e)]
        : [Array(prob.a).fill(prob.e), "➕", Array(prob.b).fill(prob.e)];
      await db.insert(activitiesTable).values({
        lessonId, type: "addition_basic", orderIndex: i,
        contentJson: JSON.stringify({ a: prob.a, b: prob.b, c: prob.c, emoji: prob.e, story: (prob as { story?: string }).story ?? null, objects: objects.flat(), correctAnswer: total, options })
      });
    }
  }

  // ─────────────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────────────
  await db.insert(achievementsTable).values([
    { slug:"first-star", name:"First Star!", description:"Complete your very first activity", emoji:"⭐", isUnlocked:false },
    { slug:"first-lesson", name:"Lesson Explorer", description:"Complete your first full lesson", emoji:"🎯", isUnlocked:false },
    { slug:"10-stars", name:"Star Collector", description:"Earn 10 stars total", emoji:"🌟", isUnlocked:false },
    { slug:"50-stars", name:"Star Champion", description:"Earn 50 stars total", emoji:"💫", isUnlocked:false },
    { slug:"100-stars", name:"Star Master", description:"Earn 100 stars total", emoji:"✨", isUnlocked:false },
    { slug:"sight-words-start", name:"Word Watcher", description:"Complete a sight words lesson", emoji:"👁️", isUnlocked:false },
    { slug:"spelling-start", name:"Super Speller", description:"Complete a spelling lesson", emoji:"✏️", isUnlocked:false },
    { slug:"rhyme-time", name:"Rhyme Time!", description:"Complete a rhyming lesson", emoji:"🎵", isUnlocked:false },
    { slug:"counting-start", name:"Number Ninja", description:"Complete a counting lesson", emoji:"🔢", isUnlocked:false },
    { slug:"letter-start", name:"Letter Legend", description:"Complete a letter matching lesson", emoji:"🔤", isUnlocked:false },
    { slug:"pattern-start", name:"Pattern Pro", description:"Complete a patterns lesson", emoji:"🔵", isUnlocked:false },
    { slug:"reading-start", name:"Bookworm", description:"Complete a reading lesson", emoji:"📖", isUnlocked:false },
    { slug:"addition-start", name:"Math Whiz", description:"Complete an addition lesson", emoji:"➕", isUnlocked:false },
    { slug:"week-1-done", name:"Week 1 Hero!", description:"Complete all Week 1 lessons in any subject", emoji:"🏅", isUnlocked:false },
    { slug:"week-3-done", name:"Halfway There!", description:"Complete 3 full weeks of learning", emoji:"🎖️", isUnlocked:false },
    { slug:"week-6-done", name:"Summer Scholar", description:"Complete 6 full weeks of learning", emoji:"🏆", isUnlocked:false },
    { slug:"all-categories", name:"Explorer Supreme", description:"Try every learning subject", emoji:"🌈", isUnlocked:false },
    { slug:"5-in-a-row", name:"On a Roll!", description:"Complete 5 activities in a row", emoji:"🔥", isUnlocked:false },
    { slug:"perfect-lesson", name:"Perfect Lesson!", description:"Get 3 stars on every activity in a lesson", emoji:"👑", isUnlocked:false },
    { slug:"summer-complete", name:"Summer Learning Champion!", description:"Complete all 8 weeks of learning", emoji:"🎉", isUnlocked:false },
  ]);

  console.log("Seed complete!");
}

seed().catch((err) => { console.error(err); process.exit(1); });
