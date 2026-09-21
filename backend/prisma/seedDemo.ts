import { CanonicalEntityType, LifecycleStatus, VisibilityStatus } from '@prisma/client';
import { allMasters, allIssues } from '../../frontend/src/app/(main)/master-artisans/data';
import { prisma } from '../src/config/db';

async function main() {
  console.log('Seeding Master Artisans Demo Data...');

  // 1. Seed Artisans
  for (const master of allMasters) {
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug: master.slug } });
    if (!existing) {
      const entity = await prisma.canonicalEntity.create({
        data: {
          slug: master.slug,
          title: master.name,
          summary: master.bio,
          entityType: CanonicalEntityType.HUMAN_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          displayPriority: 10,
          metadata: {
            craft: master.craft,
            loc: master.loc,
            award: master.award,
            img: master.img,
            stage: master.stage,
            desc: master.desc,
            years: master.years,
            sig: master.sig
          },
          artisan: {
            create: {
              activeRegion: master.loc,
              biography: master.bio
            }
          }
        }
      });
      console.log(`Created artisan demo: ${entity.title}`);
    }
  }

  // 2. Seed Issues / Editorial
  for (const issue of allIssues) {
    const slug = `issue-${issue.slug}`;
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug } });
    if (!existing) {
      const entity = await prisma.canonicalEntity.create({
        data: {
          slug: slug,
          title: issue.title,
          summary: issue.desc,
          entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          displayPriority: 10,
          metadata: {
            num: issue.num,
            season: issue.season,
            year: issue.year,
            img: issue.img
          }
        }
      });
      console.log(`Created issue demo: ${entity.title}`);
    }
  }

  // 3. Seed Studio Videos
  const allVids = [
    // --- Documentary Films (12) ---
    { slug: "threads-of-eternity", title: "Threads of Eternity: The Story of Kashmir Shawls", type: "Documentary", dur: "45 Min", tag: "Pashmina heritage", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop", desc: "A cinematic documentary exploring the historical journey and cultural significance of hand-woven Pashmina shawls.", featured: true },
    { slug: "last-carpet-looms", title: "The Last Carpet Looms of Srinagar", type: "Documentary", dur: "52 Min", tag: "Hand-knotted carpet weaving", img: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop", desc: "Chronicling the lives of Srinagar's master carpet weavers and the intricate geometry of Safavid-inspired designs.", featured: false },
    { slug: "walnut-wood-carving", title: "Walnut Wood: Carving Time", type: "Documentary", dur: "30 Min", tag: "Walnut wood carving traditions", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop", desc: "Tracing the ancient traditions of woodcrafting and structural wood carvings across the valley.", featured: false },
    { slug: "soul-of-papier-mache", title: "The Soul of Papier-Mâché", type: "Documentary", dur: "35 Min", tag: "Papier Mâché artisans", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop", desc: "Unlocking the painting techniques, lacquer processes, and stories of traditional qalamdan artisans.", featured: false },
    { slug: "living-with-loom", title: "Living with the Loom", type: "Documentary", dur: "40 Min", tag: "Handloom weaving communities", img: "https://images.unsplash.com/photo-1598418037929-e8bf68e6e5f2?w=600&auto=format&fit=crop", desc: "An inside look at the weaving neighborhoods preserving community traditions around the looms.", featured: false },
    { slug: "art-of-sozni", title: "The Art of Sozni", type: "Documentary", dur: "32 Min", tag: "Sozni embroidery masters", img: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop", desc: "Following the incredibly fine stitchwork of master craftsmen embellishing premium wool fabrics.", featured: false },
    { slug: "copper-and-fire", title: "Copper & Fire", type: "Documentary", dur: "48 Min", tag: "Copperware craftsmen", img: "https://images.unsplash.com/photo-1595273670150-bd0c3c6ca68e?w=600&auto=format&fit=crop", desc: "Detailing the hammering, engraving, and social history of Srinagar's metalware district.", featured: false },
    { slug: "kani-weaving-legacy", title: "Kani: Weaving a Legacy", type: "Documentary", dur: "42 Min", tag: "Kani shawl production", img: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop", desc: "Explaining the creation of historic Kani shawls woven strictly using written Talim code charts.", featured: false },
    { slug: "namda-felted-heritage", title: "Namda: Felted Heritage", type: "Documentary", dur: "30 Min", tag: "Namda revival", img: "https://images.unsplash.com/photo-1565192647048-f997ded87958?w=600&auto=format&fit=crop", desc: "Highlighting standard felting processes and modern interventions bringing Namda rugs to global attention.", featured: false },
    { slug: "hands-behind-crewel", title: "The Hands Behind Crewel", type: "Documentary", dur: "28 Min", tag: "Crewel embroidery", img: "https://images.unsplash.com/photo-1463171359979-300c46279931?w=600&auto=format&fit=crop", desc: "Exploring the wood-blocked motifs and hook embroidery of Kashmiri crewel drapers.", featured: false },
    { slug: "floating-workshops", title: "Voices from the Floating Workshops", type: "Documentary", dur: "36 Min", tag: "Dal Lake artisans", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop", desc: "Investigating the water-based workshops and trades along Srinagar's Dal Lake.", featured: false },
    { slug: "keeping-heritage-alive", title: "Keeping Heritage Alive", type: "Documentary", dur: "50 Min", tag: "Multi-craft documentary", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop", desc: "A comprehensive documentary showing the interconnected network of dye, weave, and carving workshops.", featured: false },

    // --- Oral Histories (12) ---
    { slug: "memories-old-bazaars", title: "Memories of the Old Srinagar Bazaars", type: "Oral History", dur: "15 Min", tag: "Elder artisan recollections", img: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop", desc: "Recollections of trading, bargaining, and community interactions in historic town markets.", featured: false },
    { slug: "my-first-loom", title: "My First Loom", type: "Oral History", dur: "18 Min", tag: "Lifetime weaving memories", img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop", desc: "An elder weaver shares his personal story of learning the craft during childhood.", featured: false },
    { slug: "lessons-grandfather", title: "Lessons from My Grandfather", type: "Oral History", dur: "20 Min", tag: "Family craft lineage", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop", desc: "Exploring the apprenticeship and oral transmission of design patterns down generations.", featured: false },
    { slug: "women-preserved-craft", title: "Women Who Preserved the Craft", type: "Oral History", dur: "22 Min", tag: "Women artisans", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop", desc: "Interviews highlighting the crucial role of women in spinning, cleaning, and painting.", featured: false },
    { slug: "before-tourism-changed", title: "Before Tourism Changed Kashmir", type: "Oral History", dur: "25 Min", tag: "Traditional markets", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop", desc: "A narrative on how local consumption and royal patrons once guided craft design.", featured: false },
    { slug: "forty-winters", title: "Forty Winters at the Loom", type: "Oral History", dur: "30 Min", tag: "Carpet master", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop", desc: "Reflections on a lifetime spent knotting grand rugs in Srinagar karkhanas.", featured: false },
    { slug: "our-village-craft", title: "Our Village, Our Craft", type: "Oral History", dur: "14 Min", tag: "Rural craft identity", img: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=600&auto=format&fit=crop", desc: "The shared memory of a village specialized in wool spinning and Namda production.", featured: false },
    { slug: "learning-without-schools", title: "Learning Without Schools", type: "Oral History", dur: "17 Min", tag: "Apprenticeship tradition", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop", desc: "How the Ustad-Shagird (master-disciple) relationship defines the spirit of craft learning.", featured: false },
    { slug: "story-every-pattern", title: "The Story Behind Every Pattern", type: "Oral History", dur: "19 Min", tag: "Symbolism", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop", desc: "Deciphering standard floral, bird, and geometric symbolism in Kashmiri art.", featured: false },
    { slug: "life-in-papier-mache", title: "A Life in Papier-Mâché", type: "Oral History", dur: "21 Min", tag: "Personal narrative", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop", desc: "A heartfelt story of a master painter who lost his sight but remembers the patterns.", featured: false },
    { slug: "craft-through-conflict", title: "Craft Through Conflict", type: "Oral History", dur: "24 Min", tag: "Preserving heritage", img: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=600&auto=format&fit=crop", desc: "Artisans describe the challenges of keeping the workshops open during times of instability.", featured: false },
    { slug: "passing-needle", title: "Passing the Needle", type: "Oral History", dur: "16 Min", tag: "Embroidery generations", img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop", desc: "Mother and daughter talk about training in Sozni work at home.", featured: false },

    // --- Video Interviews (15) ---
    { slug: "master-weaver-speaks", title: "Master Pashmina Weaver Speaks", type: "Video Interview", dur: "20 Min", tag: "Master artisan", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop", desc: "Discussing technical details of loom setups, fiber grades, and weaving speed.", featured: false },
    { slug: "young-artisan-challenges", title: "Young Artisan, New Challenges", type: "Video Interview", dur: "18 Min", tag: "Emerging artisan", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop", desc: "The perspectives of young people entering craft lanes and demands for fair wages.", featured: false },
    { slug: "why-gi-matters", title: "Why GI Matters", type: "Video Interview", dur: "15 Min", tag: "GI expert", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop", desc: "An administrative expert explains the role of Geographical Indication tags in protection.", featured: false },
    { slug: "inside-craft-economy", title: "Inside Kashmir's Craft Economy", type: "Video Interview", dur: "25 Min", tag: "Economist", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop", desc: "An economic review of export policies, wages, and trade channels.", featured: false },
    { slug: "future-craft-education", title: "The Future of Craft Education", type: "Video Interview", dur: "22 Min", tag: "Academic", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop", desc: "Proposing formal school curriculums that include artisanal design principles.", featured: false },
    { slug: "women-leading-enterprises", title: "Women Leading Craft Enterprises", type: "Video Interview", dur: "24 Min", tag: "Entrepreneur", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop", desc: "Interviews with women building cooperatives to sell craft products directly.", featured: false },
    { slug: "conserving-traditional-dyes", title: "Conserving Traditional Dyes", type: "Video Interview", dur: "17 Min", tag: "Researcher", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop", desc: "A researcher documents the chemical and ecological benefits of natural dye processes.", featured: false },
    { slug: "museum-perspectives", title: "Museum Perspectives on Kashmir Crafts", type: "Video Interview", dur: "19 Min", tag: "Curator", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop", desc: "How global museums catalog and value historic Kashmiri shawls and wood paneling.", featured: false },
    { slug: "digital-markets", title: "Digital Markets for Artisans", type: "Video Interview", dur: "21 Min", tag: "Export expert", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop", desc: "Bypassing intermediate traders using e-commerce platforms.", featured: false },
    { slug: "apprenticeship-21st-century", title: "Apprenticeship in the 21st Century", type: "Video Interview", dur: "16 Min", tag: "Master artisan", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&auto=format&fit=crop", desc: "Attracting younger apprentices in the modern digital age.", featured: false },
    { slug: "saving-rare-techniques", title: "Saving Rare Techniques", type: "Video Interview", dur: "23 Min", tag: "Conservationist", img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop", desc: "Documenting almost extinct wood joints and embroidery stitches.", featured: false },
    { slug: "authenticity-vs-counterfeits", title: "Authenticity vs Counterfeits", type: "Video Interview", dur: "26 Min", tag: "Industry expert", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop", desc: "Identifying machine-made fakes in the shawl and carpet trades.", featured: false },
    { slug: "craft-tourism-opportunities", title: "Craft Tourism Opportunities", type: "Video Interview", dur: "14 Min", tag: "Tourism expert", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop", desc: "Inviting tourists directly into traditional downtown workshops.", featured: false },
    { slug: "voices-from-workshop", title: "Voices from the Workshop", type: "Video Interview", dur: "28 Min", tag: "Artisan collective", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&auto=format&fit=crop", desc: "A panel debate among downtown weavers about cooperative goals.", featured: false },
    { slug: "hcrf-conversation-series", title: "HCRF Conversation Series", type: "Video Interview", dur: "30 Min", tag: "Foundation interview", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop", desc: "Discussing our research findings on structural changes in artisan lineages.", featured: false },

    // --- Audio Stories (15) ---
    { slug: "audio-sound-loom", title: "The Sound of the Loom", type: "Audio Story", dur: "24 Min", tag: "Ambient workshop", img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop", desc: "An immersive audio experience capturing the rhythmic beats of the Kani loom.", featured: false },
    { slug: "audio-morning-papier", title: "Morning in a Papier-Mâché Studio", type: "Audio Story", dur: "15 Min", tag: "Daily life", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop", desc: "Ambient tea pouring, brush washing, and soft Kashmiri conversation.", featured: false },
    { slug: "audio-carpet-begins", title: "A Carpet Begins", type: "Audio Story", dur: "18 Min", tag: "Production journey", img: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=600&auto=format&fit=crop", desc: "Tracing the early soundscapes of yarn winding and loom setup.", featured: false },
    { slug: "audio-voices-downtown", title: "Voices from Downtown Srinagar", type: "Audio Story", dur: "20 Min", tag: "Craft market", img: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&auto=format&fit=crop", desc: "Audio snippets of historical lanes, wholesale markets, and artisan shops.", featured: false },
    { slug: "audio-apprentice-first-day", title: "The Apprentice", type: "Audio Story", dur: "12 Min", tag: "First day", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop", desc: "Reflections of a young apprentice adjusting to sitting at the loom.", featured: false },
    { slug: "audio-hands-remember", title: "Hands That Remember", type: "Audio Story", dur: "22 Min", tag: "Elder artisan", img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=600&auto=format&fit=crop", desc: "The story of an elder craftsman whose hands know the patterns automatically.", featured: false },
    { slug: "audio-threads-memory", title: "Threads of Memory", type: "Audio Story", dur: "19 Min", tag: "Family heritage", img: "https://images.unsplash.com/photo-1583795128727-6ec36d240d60?w=600&auto=format&fit=crop", desc: "Audio recollections of family weaving secrets.", featured: false },
    { slug: "audio-winter-workshop", title: "Winter Workshop Diaries", type: "Audio Story", dur: "21 Min", tag: "Seasonal work", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop", desc: "How freezing temperatures affect dye setups and hand mobility.", featured: false },
    { slug: "audio-copper-hammer", title: "The Copper Hammer", type: "Audio Story", dur: "14 Min", tag: "Copperware sounds", img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&auto=format&fit=crop", desc: "The metallic symphony of Zaina Kadal workshops.", featured: false },
    { slug: "audio-colours-nature", title: "Colours from Nature", type: "Audio Story", dur: "16 Min", tag: "Natural dye process", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop", desc: "The bubbling of dye pots and stories of wild walnut shells.", featured: false },
    { slug: "audio-women-needle", title: "Women Behind the Needle", type: "Audio Story", dur: "23 Min", tag: "Women artisans", img: "https://images.unsplash.com/photo-1513829096999-4978602294fc?w=600&auto=format&fit=crop", desc: "Soft conversations among women embroiders in their living rooms.", featured: false },
    { slug: "audio-markets-borders", title: "Markets Beyond Borders", type: "Audio Story", dur: "26 Min", tag: "Export stories", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop", desc: "The journey of a single shawl from Srinagar to a gallery in Paris.", featured: false },
    { slug: "audio-knot-story", title: "Every Knot Has a Story", type: "Audio Story", dur: "17 Min", tag: "Carpet weaving", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop", desc: "Understanding the philosophy of knotting as meditation.", featured: false },
    { slug: "audio-living-heritage", title: "Living Heritage", type: "Audio Story", dur: "28 Min", tag: "Cultural reflection", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop", desc: "Art historians discuss the visual legacy of Kashmir valley crafts.", featured: false },
    { slug: "audio-echoes-craft", title: "Echoes of Kashmir Craft", type: "Audio Story", dur: "30 Min", tag: "Collection", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop", desc: "An archive recording compilation of old master artisan songs.", featured: false },

    // --- Workshop Diaries (15) ---
    { slug: "diary-carpet-loom", title: "A Day at a Carpet Loom", type: "Workshop Diary", dur: "5 Min", tag: "Daily production", img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&auto=format&fit=crop", desc: "Raw, unfiltered clips of weavers working on a high-density silk rug.", featured: false },
    { slug: "diary-pashmina-yarn", title: "Preparing Pashmina Yarn", type: "Workshop Diary", dur: "6 Min", tag: "Raw material", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop", desc: "Footage of sorting, combing, and hand-spinning fine Changthangi wool.", featured: false },
    { slug: "diary-carving-walnut", title: "Carving Walnut Wood", type: "Workshop Diary", dur: "4 Min", tag: "Wood workshop", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop", desc: "Close-up of chiseling leaves and dragons on a massive screen.", featured: false },
    { slug: "diary-dyeing-naturally", title: "Dyeing Wool Naturally", type: "Workshop Diary", dur: "7 Min", tag: "Dye preparation", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop", desc: "Preparing walnut shells and madder roots in copper vats.", featured: false },
    { slug: "diary-embroidery-sozni", title: "Embroidery in Progress", type: "Workshop Diary", dur: "5 Min", tag: "Sozni", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop", desc: "Watching an artisan sew tiny rows of flower buds on a border.", featured: false },
    { slug: "diary-copper-engraving", title: "Copper Engraving Session", type: "Workshop Diary", dur: "4 Min", tag: "Metal workshop", img: "https://images.unsplash.com/photo-1422026276085-c7ff20f6ac95?w=600&auto=format&fit=crop", desc: "Footage of drawing patterns on a copper plate before hammering.", featured: false },
    { slug: "diary-papier-painting", title: "Papier-Mâché Painting Day", type: "Workshop Diary", dur: "6 Min", tag: "Decorative phase", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop", desc: "Applying gold leaf and base lacquer to dry papier-mâché boxes.", featured: false },
    { slug: "diary-apprentice-week-one", title: "Apprentice Journal: Week One", type: "Workshop Diary", dur: "8 Min", tag: "Training", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop", desc: "Unedited interview with a first-week weaving trainee.", featured: false },
    { slug: "diary-restoring-shawls", title: "Restoring Antique Shawls", type: "Workshop Diary", dur: "10 Min", tag: "Conservation", img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop", desc: "A delicate process of cleaning and darning a 150-year-old shawl.", featured: false },
    { slug: "diary-designing-motifs", title: "Designing New Motifs", type: "Workshop Diary", dur: "7 Min", tag: "Creative process", img: "https://images.unsplash.com/photo-1552581230-c01374138857?w=600&auto=format&fit=crop", desc: "Artisans drawing and refining new design concepts on paper templates.", featured: false },
    { slug: "diary-winter-cycle", title: "Winter Production Cycle", type: "Workshop Diary", dur: "9 Min", tag: "Seasonal diary", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop", desc: "A seasonal look at winter work conditions and adjustments inside workshops.", featured: false },
    { slug: "diary-coop-visit", title: "Artisan Cooperative Visit", type: "Workshop Diary", dur: "8 Min", tag: "Community", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop", desc: "A group meeting with community members to discuss pricing and export models.", featured: false },
    { slug: "diary-quality-inspection", title: "Quality Inspection Day", type: "Workshop Diary", dur: "6 Min", tag: "Quality control", img: "https://images.unsplash.com/photo-1556761175-b81465844566?w=600&auto=format&fit=crop", desc: "Strict verification and inspection processes for GI tagging applications.", featured: false },
    { slug: "diary-packing-export", title: "Packing for Export", type: "Workshop Diary", dur: "5 Min", tag: "Final stage", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop", desc: "Wrapping, labeling, and boxing finished pieces for global shipments.", featured: false },
    { slug: "diary-tool-restore", title: "Restoring Traditional Tools", type: "Workshop Diary", dur: "7 Min", tag: "Tool conservation", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop", desc: "Sharpening, oiling, and fixing heirloom chisels, hammers, and weaving tools.", featured: false },

    // --- Craft Demonstrations (24) ---
    // Weaving (5)
    { slug: "demo-pashmina-spin", title: "Pashmina Hand Spinning", type: "Demonstration", dur: "15 Min", tag: "Masterclass", img: "/assets/images/studio_demo_pashmina.jpg", desc: "Spinning raw cashmere wool into fine yarn on a traditional spinning wheel.", featured: false, craft: "Weaving", level: "Beginner", artisan: "Zareena Begum", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-kani-loom", title: "Kani Loom Demonstration", type: "Demonstration", dur: "45 Min", tag: "Masterclass", img: "/assets/images/kani-masterclass-video.jpg", desc: "Weaving raw shawls on a Kani handloom using written Talim code bobbins.", featured: false, craft: "Weaving", level: "Expert", artisan: "Mohammad Maqbool", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Kanihama" },
    { slug: "demo-carpet-knot", title: "Carpet Knotting Techniques", type: "Demonstration", dur: "30 Min", tag: "Masterclass", img: "/assets/images/safavid-carpet.jpg", desc: "Demonstrating high-density Persian and local knotting styles on a vertical loom.", featured: false, craft: "Weaving", level: "Advanced", artisan: "Ali Mohammad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-warp-prep", title: "Warp Preparation", type: "Demonstration", dur: "20 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop", desc: "Stretching and sorting long warps in the courtyard prior to loom loading.", featured: false, craft: "Weaving", level: "Intermediate", artisan: "Fayaz Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Safa Kadal" },
    { slug: "demo-loom-setup", title: "Loom Setup Basics", type: "Demonstration", dur: "25 Min", tag: "Masterclass", img: "/assets/images/talim-code.jpg", desc: "Adjusting warp tensions and threading threads through the heddles.", featured: false, craft: "Weaving", level: "Beginner", artisan: "Bashir Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Kanihama" },

    // Embroidery (5)
    { slug: "demo-sozni-stitch", title: "Sozni Stitch Techniques", type: "Demonstration", dur: "18 Min", tag: "Masterclass", img: "/assets/images/studio_demo_sozni.jpg", desc: "Extreme close-up of executing the traditional double stitch on shawls.", featured: false, craft: "Embroidery", level: "Advanced", artisan: "Ghulam Rasool", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-crewel-emb", title: "Crewel Embroidery", type: "Demonstration", dur: "22 Min", tag: "Masterclass", img: "/assets/images/master-artisans-hero.jpg", desc: "Applying thick wool threads onto heavy cotton using wood-block motifs.", featured: false, craft: "Embroidery", level: "Intermediate", artisan: "Halima Begum", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Anantnag" },
    { slug: "demo-aari-needle", title: "Aari Needle Demonstration", type: "Demonstration", dur: "28 Min", tag: "Masterclass", img: "/assets/images/master_artisans_intro.jpg", desc: "Fast-paced chain stitch hook embroidery on traditional drapes.", featured: false, craft: "Embroidery", level: "Intermediate", artisan: "Shabir Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-tilla-emb", title: "Tilla Embroidery", type: "Demonstration", dur: "35 Min", tag: "Masterclass", img: "/assets/images/artisan-portrait.jpg", desc: "Embroidery using fine metallic gold and silver threads on velvet.", featured: false, craft: "Embroidery", level: "Advanced", artisan: "Naseema Akhtar", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Downtown Srinagar" },
    { slug: "demo-finish-shawl", title: "Finishing a Shawl", type: "Demonstration", dur: "16 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop", desc: "Trimming warp threads, washing, and soft ironing embroidered shawls.", featured: false, craft: "Embroidery", level: "Intermediate", artisan: "Abdur Rashid", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Downtown Srinagar" },

    // Wood (3)
    { slug: "demo-wood-basics", title: "Walnut Wood Carving Basics", type: "Demonstration", dur: "30 Min", tag: "Masterclass", img: "/assets/images/studio_demo_walnut.jpg", desc: "Understanding the grain, moisture, and layout lines on walnut wood.", featured: false, craft: "Woodwork", level: "Beginner", artisan: "Ali Mohammad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-chisel-tech", title: "Chisel Techniques", type: "Demonstration", dur: "24 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop", desc: "Handling and striking various steel gouges to carve deep reliefs.", featured: false, craft: "Woodwork", level: "Advanced", artisan: "Showkat Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-floral-motifs", title: "Traditional Floral Motifs", type: "Demonstration", dur: "20 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1463171359979-300c46279931?w=600&auto=format&fit=crop", desc: "Carving chinar leaves and grape clusters on wooden boxes.", featured: false, craft: "Woodwork", level: "Intermediate", artisan: "Manzoor Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },

    // Papier-Mache (4)
    { slug: "demo-mould-prep", title: "Mould Preparation", type: "Demonstration", dur: "18 Min", tag: "Masterclass", img: "/assets/images/antique-qalamdan.jpg", desc: "Layering paper pulp over wooden or clay moulds to make boxes.", featured: false, craft: "Papier-Mâché", level: "Beginner", artisan: "Fayaz Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Eidgah" },
    { slug: "demo-surf-smooth", title: "Surface Smoothing", type: "Demonstration", dur: "15 Min", tag: "Masterclass", img: "/assets/images/studio_demo_papier.jpg", desc: "Rubbing dry paper pulp boxes with stone tools to create smooth surfaces.", featured: false, craft: "Papier-Mâché", level: "Intermediate", artisan: "Hilal Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Eidgah" },
    { slug: "demo-naqashi-paint", title: "Naqashi Painting", type: "Demonstration", dur: "40 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop", desc: "Freehand painting of classic flowers using mineral pigments.", featured: false, craft: "Papier-Mâché", level: "Advanced", artisan: "Mohammad Yusuf", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Eidgah" },
    { slug: "demo-gold-detail", title: "Gold Detailing", type: "Demonstration", dur: "25 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop", desc: "Applying gold leaf borders on lacquered boxes using fine brushes.", featured: false, craft: "Papier-Mâché", level: "Expert", artisan: "Farooq Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Eidgah" },

    // Metal (3)
    { slug: "demo-copper-engrave", title: "Copper Engraving", type: "Demonstration", dur: "35 Min", tag: "Masterclass", img: "/assets/images/studio_demo_copper.jpg", desc: "Hammering floral layouts directly onto samovars and trays.", featured: false, craft: "Metalwork", level: "Advanced", artisan: "Abdul Rehman", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Zaina Kadal" },
    { slug: "demo-trad-hammer", title: "Traditional Hammering", type: "Demonstration", dur: "28 Min", tag: "Masterclass", img: "/assets/images/copper-smiths-video.jpg", desc: "Shaping raw copper sheets into samovars using heavy iron mallets.", featured: false, craft: "Metalwork", level: "Intermediate", artisan: "Ghulam Nabi", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Zaina Kadal" },
    { slug: "demo-tin-coating", title: "Tin Coating Process", type: "Demonstration", dur: "20 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1595273670150-bd0c3c6ca68e?w=600&auto=format&fit=crop", desc: "Applying traditional tin layer (Qalai) inside copper samovars.", featured: false, craft: "Metalwork", level: "Beginner", artisan: "Mohammad Sultan", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Zaina Kadal" },

    // Others (4)
    { slug: "demo-nat-dye", title: "Natural Dye Preparation", type: "Demonstration", dur: "30 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=600&auto=format&fit=crop", desc: "Boiling wild walnut hulls and madder roots for organic coloring.", featured: false, craft: "Others", level: "Intermediate", artisan: "Habibullah", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },
    { slug: "demo-namda-felt", title: "Namda Felting Process", type: "Demonstration", dur: "22 Min", tag: "Masterclass", img: "/assets/images/studio_demo_namda.jpg", desc: "Layout, wetting, and pressing raw wool layers into felt rugs.", featured: false, craft: "Others", level: "Intermediate", artisan: "Bashir Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Anantnag" },
    { slug: "demo-chain-stitch", title: "Chain Stitch Rug Making", type: "Demonstration", dur: "32 Min", tag: "Masterclass", img: "/assets/images/karkhan-interview-video.jpg", desc: "Creating chain stitches on wool-backed rugs with traditional hooks.", featured: false, craft: "Others", level: "Intermediate", artisan: "Tariq Ahmad", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Anantnag" },
    { slug: "demo-quality-assess", title: "Craft Quality Assessment", type: "Demonstration", dur: "18 Min", tag: "Masterclass", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop", desc: "Testing shawl thread counts and verification parameters for GI labeling.", featured: false, craft: "Others", level: "Advanced", artisan: "Abdul Rashid", artisanImage: "/assets/images/artisan-portrait.jpg", district: "Srinagar" },

    { slug: "dyes-earth", title: "Dyes of the Earth", type: "Documentary", dur: "36 Min", tag: "Technique Study", img: "/assets/images/antique-qalamdan.jpg", desc: "An exploration of natural vegetable and mineral dye preparation passed down through workshop lineages.", featured: false },
    { slug: "paper-lacquer", title: "The Paper & The Lacquer", type: "Documentary", dur: "48 Min", tag: "Heritage Film", img: "/assets/images/studio_demo_papier.jpg", desc: "Tracing the historical roots of Kashmiri Papier-Mâché from Central Asian routes to modern lacquer workshops.", featured: false },
    { slug: "namda-revival", title: "The Namda Revival", type: "Documentary", dur: "30 Min", tag: "Revival Project", img: "/assets/images/studio_demo_namda.jpg", desc: "A documentary on modern design interventions breathing new life into traditional pressed-felt Namda rugs.", featured: false },
    { slug: "rhythms-samovar", title: "Rhythms of the Samovar", type: "Documentary", dur: "40 Min", tag: "Social History", img: "/assets/images/master_artisans_intro.jpg", desc: "Exploring the social role of the copper samovar and metalware craft in the traditional homes of the valley.", featured: false },
    { slug: "carpet-kings", title: "The Carpet of Kings", type: "Documentary", dur: "60 Min", tag: "Featured Film", img: "/assets/images/safavid-carpet.jpg", desc: "An exhaustive documentary chronicling the recreation of a lost 16th-century Safavid carpet on a massive Srinagar loom.", featured: false }
  ];
  for (const vid of allVids) {
    const slug = `video-${vid.slug}`;
    await prisma.canonicalEntity.upsert({
      where: { slug },
      update: {
        title: vid.title,
        summary: vid.desc,
        isFeatured: vid.featured,
        metadata: {
          kind: 'STUDIO_MEDIA',
          type: vid.type,
          dur: vid.dur,
          tag: vid.tag,
          img: vid.img,
          desc: vid.desc,
          craft: (vid as any).craft,
          level: (vid as any).level,
          artisan: (vid as any).artisan,
          artisanImage: (vid as any).artisanImage
        }
      },
      create: {
        slug,
        title: vid.title,
        summary: vid.desc,
        entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
        lifecycle: LifecycleStatus.PUBLISHED,
        visibility: VisibilityStatus.PUBLIC,
        isDemo: true,
        isSeedData: true,
        isFeatured: vid.featured,
        metadata: {
          kind: 'STUDIO_MEDIA',
          type: vid.type,
          dur: vid.dur,
          tag: vid.tag,
          img: vid.img,
          desc: vid.desc,
          craft: (vid as any).craft,
          level: (vid as any).level,
          artisan: (vid as any).artisan,
          artisanImage: (vid as any).artisanImage
        }
      }
    });
    console.log(`Upserted video demo: ${vid.title}`);
  }

  // 4. Seed Collections
  const allItems = [
    { slug: "k-2018-04", title: "The Shah-e-Hamadan Kani Shawl", category: "Signature Masterpiece", craft: "Pashmina Weaving", year: "2018", artisan: "Master Ali Mohammad", loc: "Srinagar", img: "/assets/images/talim-code.jpg", accession: "K-2018-04", material: "Pure Pashm" },
    { slug: "w-1950-01", title: "Original Waguv (River Reed Mat)", category: "Rare Object", craft: "Waguv Weaving", year: "1950s", artisan: "Unknown", loc: "Dal Lake", img: "/assets/images/antique-qalamdan.jpg", accession: "W-1950-01", material: "River Reed" },
    { slug: "c-1890-12", title: "Ceremonial Samovar", category: "Museum Archive", craft: "Copperware", year: "Late 19th C.", artisan: "Ustad Ghulam", loc: "Zaina Kadal", img: "/assets/images/copper-smiths-video.jpg", accession: "C-1890-12", material: "Copper & Tin" },
    { slug: "w-2024-02", title: "Minimalist Khatam-band Table", category: "Contemporary", craft: "Woodwork", year: "2024", artisan: "Tariq Ahmad", loc: "Safa Kadal", img: "/assets/images/artisan-portrait.jpg", accession: "W-2024-02", material: "Walnut Wood" },
    { slug: "p-1820-05", title: "Mughal-era Qalamdan", category: "Museum Archive", craft: "Papier-Mâché", year: "1820s", artisan: "Sayyid Dynasty", loc: "Downtown Srinagar", img: "/assets/images/antique-qalamdan.jpg", accession: "P-1820-05", material: "Paper Pulp, Gold Leaf" },
    { slug: "k-2015-09", title: "Double-sided Silk Carpet", category: "Signature Masterpiece", craft: "Carpet Weaving", year: "2015", artisan: "Ghulam Hassan", loc: "Srinagar", img: "/assets/images/safavid-carpet.jpg", accession: "K-2015-09", material: "Silk on Silk" },
    { slug: "t-1920-03", title: "Antique Shahtoosh", category: "Rare Object", craft: "Textiles", year: "1920s", artisan: "Unknown", loc: "Kashmir Valley", img: "/assets/images/master-artisans-hero.jpg", accession: "T-1920-03", material: "Shahtoosh Wool" },
    { slug: "c-2023-11", title: "Oxidized Traam Bowl", category: "Contemporary", craft: "Copperware", year: "2023", artisan: "Abdul Ahad", loc: "Zaina Kadal", img: "/assets/images/copper-smiths-video.jpg", accession: "C-2023-11", material: "Oxidized Copper" }
  ];
  for (const item of allItems) {
    const slug = `collection-${item.slug}`;
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.canonicalEntity.create({
        data: {
          slug,
          title: item.title,
          entityType: CanonicalEntityType.HERITAGE_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          metadata: {
            kind: 'COLLECTION_ITEM',
            category: item.category,
            craft: item.craft,
            year: item.year,
            artisan: item.artisan,
            loc: item.loc,
            img: item.img,
            accession: item.accession,
            material: item.material
          }
        }
      });
      console.log(`Created collection demo: ${item.title}`);
    }
  }

  // 5. Seed Techniques
  const allTechs = [
    { slug: "vatta-chikan", title: 'Undercut Relief (Vatta Chikan)', craft: 'Woodwork', desc: 'Carving multiple layers of depth into a single block of wood without breaking the grain.' },
    { slug: "talim-reading", title: 'Talim Reading (Kani Weaving)', craft: 'Weaving', desc: 'Deciphering the coded shorthand script that dictates the exact color pattern of a shawl.' },
    { slug: "sakhta-making", title: 'Papier-Mâché Sakhta Making', craft: 'Papier-Mâché', desc: 'Pounding waste paper and rice glue into a highly durable mold.' },
    { slug: "sozni-double-stitch-tech", title: 'Sozni Double Stitch', craft: 'Embroidery', desc: 'A microscopic stitch that creates identical patterns on both sides of a Pashmina.' },
    { slug: "copper-engraving", title: 'Copper Engraving (Naqash)', craft: 'Metalwork', desc: 'Hammering and chiseling intricate floral motifs into oxidized copper.' },
    { slug: "namda-felting", title: 'Namda Felting', craft: 'Textiles', desc: 'Friction-pressing raw wool fibers into a dense, un-woven rug.' },
    { slug: "khatam-band-geometry", title: 'Khatam-band Geometry', craft: 'Woodwork', desc: 'Interlocking faceted wood pieces for ceilings without using a single nail.' },
    { slug: "crewel-chain", title: 'Crewel Chain Stitch', craft: 'Embroidery', desc: 'Using an awl (aari) to create continuous raised chain stitches on thick wool.' }
  ];
  for (const tech of allTechs) {
    const slug = `tech-${tech.slug}`;
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.canonicalEntity.create({
        data: {
          slug,
          title: tech.title,
          summary: tech.desc,
          entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          metadata: {
            kind: 'TECHNIQUE',
            craft: tech.craft,
            desc: tech.desc
          }
        }
      });
      console.log(`Created technique demo: ${tech.title}`);
    }
  }

  // 6. Seed Tools
  const allTools = [
    { slug: "yander", title: 'The Yander (Spinning Wheel)', craft: 'Pashmina', desc: 'The delicate wooden wheel used to spin raw Pashm into ultra-fine yarn.' },
    { slug: "aari", title: 'The Aari (Awl)', craft: 'Embroidery', desc: 'A specialized needle with a hooked end used for rapid chain stitching in Crewel work.' },
    { slug: "vatta-chisel", title: 'Vatta Chisel Set', craft: 'Woodwork', desc: 'A curated set of 20+ specialized chisels forged by local blacksmiths.' },
    { slug: "raw-pashm", title: 'Raw Pashm Wool', craft: 'Textiles', desc: 'The raw, unspun undercoat of the Changthangi goat from Ladakh.' },
    { slug: "traam", title: 'Traam (Copper Plates)', craft: 'Metalwork', desc: 'Thick sheets of pure copper ready to be shaped and oxidized.' },
    { slug: "kani-bobbins", title: 'Kani Bobbins (Tojis)', craft: 'Weaving', desc: 'Small wooden eye-less bobbins wrapped with colorful silk threads.' }
  ];
  for (const tool of allTools) {
    const slug = `tool-${tool.slug}`;
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.canonicalEntity.create({
        data: {
          slug,
          title: tool.title,
          summary: tool.desc,
          entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          metadata: {
            kind: 'TOOL',
            craft: tool.craft,
            desc: tool.desc
          }
        }
      });
      console.log(`Created tool demo: ${tool.title}`);
    }
  }

  // 7. Seed Motifs
  const allMotifs = [
    { slug: "badam", title: 'The Badam (Paisley)', origin: 'Persian / Central Asian', desc: 'The most iconic motif in Kashmiri craft, representing the cypress tree bent by the wind, symbolizing life and eternity.' },
    { slug: "chinar", title: 'Chinar Leaf (Boen)', origin: 'Indigenous Kashmiri', desc: 'The five-pointed leaf of the majestic Oriental Plane tree, deeply rooted in Kashmir\'s landscape and poetry.' },
    { slug: "pamposh", title: 'Pamposh (Lotus)', origin: 'Indigenous Kashmiri', desc: 'A symbol of purity and rebirth, often used in both Hindu and Sufi iconography within the valley.' },
    { slug: "gul-e-hazara", title: 'Gul-e-Hazara (Thousand Flowers)', origin: 'Mughal Influence', desc: 'A dense, intricate floral pattern that covers the entire surface, popular in Papier-Mâché.' },
    { slug: "mihrab", title: 'Mihrab (Arch)', origin: 'Islamic Architecture', desc: 'Inspired by the prayer niches in mosques, widely used as the border design in carpets and prayer rugs.' },
    { slug: "yander-motif", title: 'Yander (Spinning Wheel)', origin: 'Domestic Tool', desc: 'A rarer motif that honors the spinners, occasionally found in contemporary Sozni work.' }
  ];
  for (const motif of allMotifs) {
    const slug = `motif-${motif.slug}`;
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.canonicalEntity.create({
        data: {
          slug,
          title: motif.title,
          summary: motif.desc,
          entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          metadata: {
            kind: 'MOTIF',
            origin: motif.origin,
            desc: motif.desc
          }
        }
      });
      console.log(`Created motif demo: ${motif.title}`);
    }
  }
  // 8. Seed Editorial Series
  const allEditorials = [
    {
      slug: "economics-of-pashmina",
      title: "The Economics of Pashmina: Fair Wages & Transparent Value Chains",
      tag: "Market Analysis",
      desc: "An in-depth analysis of wage structures, supply chain markup, and direct-to-weaver initiatives in the Pashmina craft sector.",
      articles: ["The Spinner's Share", "Deconstructing Middleman Markups", "Direct Trade and Cooperative Loom Models"]
    },
    {
      slug: "silent-looms-history",
      title: "Silent Looms: A History of Women Artisans in Downtown Srinagar",
      tag: "Social History",
      desc: "Uncovering the hidden labor and domestic contributions of Kashmiri women spinners and washers throughout the 19th and 20th centuries.",
      articles: ["The Domestic Karkhana", "Invisible Spinners of Zaina Kadal", "Archival Traces and Oral Testimony"]
    },
    {
      slug: "chasing-the-indigo",
      title: "Chasing the Indigo: Natural Dye Revival in the Valley",
      tag: "Conservation",
      desc: "Exploring the botanical science, chemical-free vat preparation, and conservation efforts to restore natural dyes to mainstream production.",
      articles: ["Chemistry of the Indigo Vat", "Madder Root and Walnut Hulls", "Documenting Rare Dyeing Manuscripts"]
    },
    {
      slug: "interlocking-geometries",
      title: "Interlocking Geometries: Sufi Architecture & Khatamband Ceilings",
      tag: "History",
      desc: "A structural study of the complex wooden ceilings of Kashmir's historic shrines and their mathematical construction without nails.",
      articles: ["Central Asian Origins", "The Math of Interlocking Joints", "Restoration Challenges in Downtown Srinagar"]
    },
    {
      slug: "new-canvas-papier-mache",
      title: "New Canvas: Papier-Mâché Naqashi in Contemporary Design",
      tag: "Contemporary",
      desc: "How modern Kashmiri designers are adapting traditional floral painting (Naqashi) to clean, minimalist products and surfaces.",
      articles: ["Beyond the Pen Box", "Minimalist Naqashi Collaborations", "Sustainable Sakhta bases"]
    }
  ];

  for (const ed of allEditorials) {
    const slug = `editorial-${ed.slug}`;
    const existing = await prisma.canonicalEntity.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.canonicalEntity.create({
        data: {
          slug,
          title: ed.title,
          summary: ed.desc,
          entityType: CanonicalEntityType.KNOWLEDGE_OBJECT,
          lifecycle: LifecycleStatus.PUBLISHED,
          visibility: VisibilityStatus.PUBLIC,
          isDemo: true,
          isSeedData: true,
          metadata: {
            kind: 'EDITORIAL',
            category: ed.tag,
            tag: ed.tag,
            desc: ed.desc,
            articles: ed.articles
          }
        }
      });
      console.log(`Created editorial demo: ${ed.title}`);
    }
  }

  console.log('All Demo data seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
