import axios from "axios";

async function main() {
  const url = "http://localhost:4000/api/publications/cmqd3mkxs006y4cbozkn3gycq";
  try {
    const res = await axios.get(url);
    const pub = res.data;
    console.log("PUBLICATION TITLE:", pub.title);
    if (pub.chapters) {
      console.log("CHAPTERS ARRAY LENGTH:", pub.chapters.length);
      pub.chapters.forEach((ch: any, i: number) => {
        console.log(`${i + 1}. ID: "${ch.id}", Title: "${ch.title}", SectionType: "${ch.sectionType}", Order: ${ch.order}`);
      });
    } else {
      console.log("No chapters array in API response.");
    }
  } catch (e: any) {
    console.error("API error:", e.message);
  }
}

main();
