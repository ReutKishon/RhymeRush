function generateSongTopic(): string {
  const topics = [
    "Love and Relationships",
    "Adventure and Exploration",
    "Overcoming Challenges",
    "Friendship and Support",
    "Dreams and Ambitions",
    "Nature and Environment",
    "Celebration and Joy",
    "Sadness and Loss",
    "Inspirational Journeys",
  ];
  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics[randomIndex];
}

// Function to check if two sentences rhyme
// module.exports = { generateSongTopic, sentencesRhyme };
export default generateSongTopic;

