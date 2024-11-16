export function generateSongTopic(): string {
    const topics = [
      'Love and Relationships',
      'Adventure and Exploration',
      'Overcoming Challenges',
      'Friendship and Support',
      'Dreams and Ambitions',
      'Nature and Environment',
      'Celebration and Joy',
      'Sadness and Loss',
      'Inspirational Journeys',
    ];
    const randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
  }