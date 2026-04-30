// messages to display on the badge, based on how much of the channel's content you watched
const MESSAGES = {
  tier1: [
    // 0-20% watched
    "You and {channel} have never actually met, have you.",
    "You found {channel} once and then left forever.",
    "Your watch history has never heard of {channel}.",
    "{channel} is basically a stranger to you at this point.",
    "Bold of {channel} to think you'd actually watch.",
  ],
  tier2: [
    // 20-50% watched
    "The backlog is winning, and {channel} knows it.",
    "You meant to watch more {channel}. You always do.",
    "You sampled {channel} and moved on. Fair, honestly.",
    "{channel} uploads faster than you can pretend to keep up.",
    "The unwatched pile grows. You scroll anyway.",
  ],
  tier3: [
    // 50-70% watched
    "You watch {channel}. Just not, like, aggressively.",
    "A casual {channel} viewer. Respectable.",
    "Not obsessed, not estranged. Somewhere in the middle.",
    "Functional viewership. Doing fine.",
  ],
  tier4: [
    // 70-90% watched
    "Okay, you actually watch {channel}. That's real commitment.",
    "You're basically {channel}'s most reliable viewer.",
    "{channel} would be pleased, probably.",
    "{channel} has a fan. It's you.",
  ],
  tier5: [
    // 90-100% watched
    "You've seen almost everything {channel} has ever made.",
    "At this point you live here.",
    "Full completionist. {channel} has no secrets from you.",
    "{channel} uploaded it. You watched it. Every time.",
    "Chronically online, {channel} edition.",
    "If {channel} quit tomorrow, you'd feel it.",
    "You are the target audience and you take that seriously.",
  ],
};
