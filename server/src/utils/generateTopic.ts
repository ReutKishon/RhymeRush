function generateSongTopic(): string {
  const topics = [
    "אהבה נכזבת",
    "געגוע לילדות",
    "פרידה כואבת",
    "שוויון ואחדות",
    "מערכת יחסים סוערת",
    "חיפוש משמעות בחיים",
    "התמודדות עם לחצי היום-יום",
    "הרצון לברוח משגרה אינטנסיבית",
    "התחלה חדשה",
    "געגוע לבן/בת הזוג הרחוק/ה",
    "בדידות"
  ];
  const randomIndex = Math.floor(Math.random() * topics.length);
  return topics[randomIndex];
}

// Function to check if two sentences rhyme
// module.exports = { generateSongTopic, sentencesRhyme };
export default generateSongTopic;

