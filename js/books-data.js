/*
  BOOKS DATA
  ----------
  This array is the entire "database" for the site right now.
  Each object = one audiobook. To add a new one by hand, copy an
  entry, change the values, and add a comma between entries.

  videoId = the part of a YouTube URL after "v=" or after "youtu.be/"
  e.g. https://youtu.be/75daycmqz88?si=xyz  ->  videoId: "75daycmqz88"

  The admin.html page will generate one of these blocks for you
  automatically so you don't have to edit this by hand later.
*/

const BOOKS = [
  {
    id: "b1",
    title: "The Ledger of Vaughn Street",
    author: "Miriam Cole",
    category: "Thriller",
    narrator: "Daniel Pierce",
    runtime: "9h 42m",
    year: "2021",
    blurb: "A forensic accountant uncovers a decade-old fraud that someone is willing to kill to keep buried.",
    videoId: "75daycmqz88"
  },
  {
    id: "b2",
    title: "Kingdom of Ash and Salt",
    author: "Idris Katan",
    category: "History",
    narrator: "Helena Ross",
    runtime: "12h 05m",
    year: "2019",
    blurb: "A sweeping account of the trade empires that rose and fell along the salt roads of the ancient world.",
    videoId: "JtTvCOWfqxo"
  },
  {
    id: "b3",
    title: "The Orchard at Windmere",
    author: "Priya Nandan",
    category: "Novel",
    narrator: "Priya Nandan",
    runtime: "8h 18m",
    year: "2023",
    blurb: "Three sisters return to their family's dying orchard and confront the inheritance they never wanted.",
    videoId: "yOh8YmHHB2g"
  },
  {
    id: "b4",
    title: "Case File 47",
    author: "Daniel Cho",
    category: "Mystery",
    narrator: "Marcus Webb",
    runtime: "7h 51m",
    year: "2022",
    blurb: "A cold-case detective reopens a file that was never supposed to see daylight again.",
    videoId: "oHJjOnRoGrU"
  },
  {
    id: "b5",
    title: "Winds Over Kashan",
    author: "Farah Amiri",
    category: "Novel",
    narrator: "Sara Nazari",
    runtime: "10h 27m",
    year: "2020",
    blurb: "A love story stretched across two decades, told against the backdrop of a changing city.",
    videoId: "p8wEiWrIx6w"
  },
  {
    id: "b_mtew945v",
    title: "নরওয়েজিয়ান উড । Norwegian Wood",
    author: "haruki murakami",
    category: "love",
    narrator: "haruki murakami",
    runtime: "1h 39min",
    year: "",
    blurb: "",
    videoId: "qwZ7UzCUvOs"
  }
];
