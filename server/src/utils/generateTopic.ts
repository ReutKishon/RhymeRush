function generateSongTopic(): string {
  const topics = [
    "breakup",
    "colors",
    "death",
    "disability",
    "dreams",
    "encounters with past lovers",
    "friendship",
    "money",
    "war",
    "time",
    "revenge",
    "party",
    "family",
    "social issues",
    "religion",
    "loyality",
    "work",
    "school",
    "holiday",
  ];
  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics[randomIndex];
}

// Function to check if two sentences rhyme
// module.exports = { generateSongTopic, sentencesRhyme };
export default generateSongTopic;
