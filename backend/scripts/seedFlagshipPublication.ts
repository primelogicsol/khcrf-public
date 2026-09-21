import { prisma } from '../src/config/db.js';

async function seed() {
  const slug = 'premium-pricing-trends-in-authentic-kashmiri-luxury-crafts';
  
  const pub = await prisma.publication.upsert({
    where: { slug },
    update: {
      title: 'Premium Pricing Trends in Authentic Kashmiri Luxury Crafts',
      subtitle: 'How provenance documentation adds premium value to Kashmiri woolens.',
      author: 'Dr. Aisha Mir',
      published: '2026',
      category: 'Pricing Intelligence Series',
      price: 150.0,
      pages: 120,
      description: `Authentic Kashmiri luxury crafts occupy a distinctive position within the global premium and heritage-goods market. Their commercial value originates not merely from material quality or ornamental beauty, but from the convergence of specialized craftsmanship, geographic provenance, inherited knowledge, cultural continuity, limited production capacity, and the time-intensive nature of handmade work.

Despite these inherent strengths, the market frequently fails to translate authenticity into appropriate pricing. Genuine handmade products are often placed alongside machine-made, chemically processed, mass-produced, or falsely labelled substitutes. This weakens buyer confidence, compresses artisan margins, distorts market comparisons, and prevents authentic Kashmiri crafts from realizing their full premium-market potential.

This Market Intelligence publication examines the principal forces influencing premium pricing across authentic Kashmiri luxury crafts. These include provenance, craftsmanship intensity, raw-material quality, production time, artisan reputation, design distinction, rarity, certification, geographical indication protection, documentation, distribution channels, buyer education, and access to international luxury markets.

The assessment emphasizes that premium pricing cannot be sustained through branding language alone. A credible premium must be supported by verifiable evidence. Buyers, collectors, retailers, designers, museums, and institutional purchasers increasingly expect clear information concerning the origin of materials, artisan identity, production methods, authenticity, chain of custody, cultural context, and ethical value distribution.

The publication also identifies a persistent gap between the cultural value of Kashmiri crafts and the prices received by many artisans. While final retail prices may rise substantially in international markets, the originating artisan may receive only a limited proportion of that value. Greater transparency, traceable procurement, fair contracting, verified product documentation, and stronger artisan participation in market positioning are therefore essential.

Premium market development requires differentiated pricing rather than generalized pricing. A museum-quality carpet, a hand-spun and handwoven pashmina, a master-carved walnut object, or a rare papier-mâché work cannot be evaluated using the same criteria as ordinary commercial merchandise. Each craft requires its own pricing architecture based on skill, material, labor, rarity, condition, provenance, and artistic significance.

The report concludes that authentic Kashmiri luxury crafts can command stronger and more stable premium prices when authenticity is documented, quality standards are consistently communicated, counterfeit substitution is reduced, and artisans are positioned as recognized creators rather than anonymous production units. The future of premium pricing lies in connecting heritage value with measurable evidence, informed buyers, ethical market access, and institutional trust.`,
      publicationType: 'Market Intelligence',
      isPublic: true,
      publishedStatus: 'PUBLISHED',
      seoTitle: 'Premium Pricing Trends in Kashmiri Luxury Crafts | Market Intelligence',
      seoDescription: 'Comprehensive market intelligence on pricing strategies and premiumization of authentic Kashmiri luxury crafts in global markets.',
      metadata: {
        subtitle: 'Market Intelligence Report | 2026',
        estimatedReadingTimeMinutes: 45,
        isbn: null,
        publicationCode: 'HCRF-MI-2026-0005',
        publicationSeries: '4651 | ISBN | 2025 | P',
        doi: '10.1234/kashmir.crafts.2026',
        publisher: 'HCRF Publishing',
      },
      imagePath: '/assets/images/book_cover_final_approval.png'
    },
    create: {
      slug,
      title: 'Premium Pricing Trends in Authentic Kashmiri Luxury Crafts',
      subtitle: 'How provenance documentation adds premium value to Kashmiri woolens.',
      author: 'Dr. Aisha Mir',
      published: '2026',
      category: 'Pricing Intelligence Series',
      price: 150.0,
      pages: 120,
      description: `Authentic Kashmiri luxury crafts occupy a distinctive position within the global premium and heritage-goods market. Their commercial value originates not merely from material quality or ornamental beauty, but from the convergence of specialized craftsmanship, geographic provenance, inherited knowledge, cultural continuity, limited production capacity, and the time-intensive nature of handmade work.

Despite these inherent strengths, the market frequently fails to translate authenticity into appropriate pricing. Genuine handmade products are often placed alongside machine-made, chemically processed, mass-produced, or falsely labelled substitutes. This weakens buyer confidence, compresses artisan margins, distorts market comparisons, and prevents authentic Kashmiri crafts from realizing their full premium-market potential.

This Market Intelligence publication examines the principal forces influencing premium pricing across authentic Kashmiri luxury crafts. These include provenance, craftsmanship intensity, raw-material quality, production time, artisan reputation, design distinction, rarity, certification, geographical indication protection, documentation, distribution channels, buyer education, and access to international luxury markets.

The assessment emphasizes that premium pricing cannot be sustained through branding language alone. A credible premium must be supported by verifiable evidence. Buyers, collectors, retailers, designers, museums, and institutional purchasers increasingly expect clear information concerning the origin of materials, artisan identity, production methods, authenticity, chain of custody, cultural context, and ethical value distribution.

The publication also identifies a persistent gap between the cultural value of Kashmiri crafts and the prices received by many artisans. While final retail prices may rise substantially in international markets, the originating artisan may receive only a limited proportion of that value. Greater transparency, traceable procurement, fair contracting, verified product documentation, and stronger artisan participation in market positioning are therefore essential.

Premium market development requires differentiated pricing rather than generalized pricing. A museum-quality carpet, a hand-spun and handwoven pashmina, a master-carved walnut object, or a rare papier-mâché work cannot be evaluated using the same criteria as ordinary commercial merchandise. Each craft requires its own pricing architecture based on skill, material, labor, rarity, condition, provenance, and artistic significance.

The report concludes that authentic Kashmiri luxury crafts can command stronger and more stable premium prices when authenticity is documented, quality standards are consistently communicated, counterfeit substitution is reduced, and artisans are positioned as recognized creators rather than anonymous production units. The future of premium pricing lies in connecting heritage value with measurable evidence, informed buyers, ethical market access, and institutional trust.`,
      publicationType: 'Market Intelligence',
      isPublic: true,
      publishedStatus: 'PUBLISHED',
      seoTitle: 'Premium Pricing Trends in Kashmiri Luxury Crafts | Market Intelligence',
      seoDescription: 'Comprehensive market intelligence on pricing strategies and premiumization of authentic Kashmiri luxury crafts in global markets.',
      metadata: {
        subtitle: 'Market Intelligence Report | 2026',
        estimatedReadingTimeMinutes: 45,
        isbn: null,
        publicationCode: 'HCRF-MI-2026-0005',
        publicationSeries: '4651 | ISBN | 2025 | P',
        doi: '10.1234/kashmir.crafts.2026',
        publisher: 'HCRF Publishing',
      },
      imagePath: '/assets/images/book_cover_final_approval.png'
    }
  });

  // Create an initial Published Edition to satisfy the canonical visibility rules
  const existingEditions = await prisma.publicationEdition.findMany({ where: { publicationId: pub.id }});
  if (existingEditions.length === 0) {
    await prisma.publicationEdition.create({
      data: {
        publicationId: pub.id,
        version: '1.0.0',
        edition: '1st Edition',
        publicationDate: new Date('2026-01-01T00:00:00Z'),
        status: 'PUBLISHED'
      }
    });
  } else {
    await prisma.publicationEdition.update({
      where: { id: existingEditions[0].id },
      data: { edition: '1st Edition' }
    });
  }

  // Clear existing chapters so we can seed the correct TOC
  await prisma.chapter.deleteMany({
    where: { publicationId: pub.id }
  });

  const toc = [
    { title: '1. Introduction', sectionType: 'part' },
    { title: '1.1 Purpose of the Publication', sectionType: 'chapter' },
    { title: '1.2 Scope of the Market Intelligence Assessment', sectionType: 'chapter' },
    { title: '1.3 Definition of Authentic Kashmiri Luxury Crafts', sectionType: 'chapter' },
    { title: '1.4 Understanding Premium, Luxury, Heritage, and Collectible Value', sectionType: 'chapter' },
    { title: '1.5 Intended Users of This Publication', sectionType: 'chapter' },
    { title: '2. The Premium Position of Kashmiri Crafts', sectionType: 'part' },
    { title: '2.1 Cultural and Historical Value', sectionType: 'chapter' },
    { title: '2.2 Geographic Provenance', sectionType: 'chapter' },
    { title: '2.3 Intergenerational Knowledge and Craft Lineages', sectionType: 'chapter' },
    { title: '2.4 Handmade Production and Limited Output', sectionType: 'chapter' },
    { title: '2.5 Kashmiri Crafts within the Global Luxury Market', sectionType: 'chapter' },
    { title: '3. Foundations of Premium Pricing', sectionType: 'part' },
    { title: '3.1 Material Quality', sectionType: 'chapter' },
    { title: '3.2 Craftsmanship and Skill Intensity', sectionType: 'chapter' },
    { title: '3.3 Production Time', sectionType: 'chapter' },
    { title: '3.4 Design Complexity', sectionType: 'chapter' },
    { title: '3.5 Rarity and Limited Availability', sectionType: 'chapter' },
    { title: '3.6 Artisan Reputation and Mastery', sectionType: 'chapter' },
    { title: '3.7 Provenance and Documentation', sectionType: 'chapter' },
    { title: '3.8 Condition, Preservation, and Longevity', sectionType: 'chapter' },
    { title: '4. Craft-Specific Pricing Factors', sectionType: 'part' },
    { title: '4.1 Hand-Knotted Kashmiri Carpets', sectionType: 'chapter' },
    { title: '4.2 Pashmina and Fine Shawls', sectionType: 'chapter' },
    { title: '4.3 Kani Weaving', sectionType: 'chapter' },
    { title: '4.4 Sozni Embroidery', sectionType: 'chapter' },
    { title: '4.5 Walnut Wood Carving', sectionType: 'chapter' },
    { title: '4.6 Papier-Mâché', sectionType: 'chapter' },
    { title: '4.7 Crewel and Chain-Stitch Embroidery', sectionType: 'chapter' },
    { title: '4.8 Namdah and Felted Craft Traditions', sectionType: 'chapter' },
    { title: '4.9 Other Specialized Heritage Crafts', sectionType: 'chapter' },
    { title: '5. Market Segmentation', sectionType: 'part' },
    { title: '5.1 Domestic Premium Buyers', sectionType: 'chapter' },
    { title: '5.2 International Retail Buyers', sectionType: 'chapter' },
    { title: '5.3 Luxury and Heritage Retailers', sectionType: 'chapter' },
    { title: '5.4 Interior Designers and Architects', sectionType: 'chapter' },
    { title: '5.5 Museums and Cultural Institutions', sectionType: 'chapter' },
    { title: '5.6 Private Collectors', sectionType: 'chapter' },
    { title: '5.7 Hospitality and Institutional Procurement', sectionType: 'chapter' },
    { title: '5.8 Diaspora and Cultural Buyers', sectionType: 'chapter' },
    { title: '5.9 Digital and Online Luxury Markets', sectionType: 'chapter' },
    { title: '6. Authenticity and Price Realization', sectionType: 'part' },
    { title: '6.1 The Commercial Value of Authenticity', sectionType: 'chapter' },
    { title: '6.2 Geographical Indication Protection', sectionType: 'chapter' },
    { title: '6.3 Certification and Verification', sectionType: 'chapter' },
    { title: '6.4 Artisan Identification', sectionType: 'chapter' },
    { title: '6.5 Material and Process Disclosure', sectionType: 'chapter' },
    { title: '6.6 Product Documentation and Digital Provenance', sectionType: 'chapter' },
    { title: '6.7 Counterfeit and Mislabelled Products', sectionType: 'chapter' },
    { title: '6.8 Buyer Trust and Price Confidence', sectionType: 'chapter' },
    { title: '7. Price Formation Across the Value Chain', sectionType: 'part' },
    { title: '7.1 Artisan-Level Pricing', sectionType: 'chapter' },
    { title: '7.2 Manufacturer and Aggregator Margins', sectionType: 'chapter' },
    { title: '7.3 Export and Distribution Costs', sectionType: 'chapter' },
    { title: '7.4 Wholesale Pricing', sectionType: 'chapter' },
    { title: '7.5 Retail Markups', sectionType: 'chapter' },
    { title: '7.6 International Luxury-Market Premiums', sectionType: 'chapter' },
    { title: '7.7 Commissions, Logistics, and Platform Fees', sectionType: 'chapter' },
    { title: '7.8 The Artisan’s Share of Final Retail Value', sectionType: 'chapter' },
    { title: '8. Barriers to Premium Pricing', sectionType: 'part' },
    { title: '8.1 Weak Market Differentiation', sectionType: 'chapter' },
    { title: '8.2 Inconsistent Quality Classification', sectionType: 'chapter' },
    { title: '8.3 Limited Traceability', sectionType: 'chapter' },
    { title: '8.4 Counterfeit Competition', sectionType: 'chapter' },
    { title: '8.5 Fragmented Supply Chains', sectionType: 'chapter' },
    { title: '8.6 Poor Product Presentation', sectionType: 'chapter' },
    { title: '8.7 Limited Buyer Awareness', sectionType: 'chapter' },
    { title: '8.8 Unverified Luxury Claims', sectionType: 'chapter' },
    { title: '8.9 Dependence on Intermediaries', sectionType: 'chapter' },
    { title: '9. Building a Credible Premium', sectionType: 'part' },
    { title: '9.1 Evidence-Based Product Positioning', sectionType: 'chapter' },
    { title: '9.2 Craft-Specific Quality Standards', sectionType: 'chapter' },
    { title: '9.3 Transparent Price Justification', sectionType: 'chapter' },
    { title: '9.4 Provenance Records', sectionType: 'chapter' },
    { title: '9.5 Artisan Profiles and Attribution', sectionType: 'chapter' },
    { title: '9.6 Storytelling Supported by Verification', sectionType: 'chapter' },
    { title: '9.7 Packaging and Presentation', sectionType: 'chapter' },
    { title: '9.8 After-Sales Documentation and Care Guidance', sectionType: 'chapter' },
    { title: '10. Premium Pricing Framework', sectionType: 'part' },
    { title: '10.1 Base Production Cost', sectionType: 'chapter' },
    { title: '10.2 Skilled Labor Value', sectionType: 'chapter' },
    { title: '10.3 Material Premium', sectionType: 'chapter' },
    { title: '10.4 Complexity Multiplier', sectionType: 'chapter' },
    { title: '10.5 Rarity Multiplier', sectionType: 'chapter' },
    { title: '10.6 Provenance Premium', sectionType: 'chapter' },
    { title: '10.7 Master Artisan Premium', sectionType: 'chapter' },
    { title: '10.8 Certification and Verification Value', sectionType: 'chapter' },
    { title: '10.9 Market and Channel Adjustment', sectionType: 'chapter' },
    { title: '10.10 Final Premium Price Assessment', sectionType: 'chapter' },
    { title: '11. Strategic Market Opportunities', sectionType: 'part' },
    { title: '11.1 Verified Luxury Collections', sectionType: 'chapter' },
    { title: '11.2 Limited Editions', sectionType: 'chapter' },
    { title: '11.3 Master Artisan Collections', sectionType: 'chapter' },
    { title: '11.4 Museum and Institutional Partnerships', sectionType: 'chapter' },
    { title: '11.5 Designer Collaborations', sectionType: 'chapter' },
    { title: '11.6 Heritage Hospitality Markets', sectionType: 'chapter' },
    { title: '11.7 Ethical Luxury Retail', sectionType: 'chapter' },
    { title: '11.8 Digital Traceability and Global Commerce', sectionType: 'chapter' },
    { title: '11.9 Collector Education and Long-Term Value', sectionType: 'chapter' },
    { title: '12. Recommendations', sectionType: 'part' },
    { title: '12.1 Recommendations for Artisans', sectionType: 'chapter' },
    { title: '12.2 Recommendations for Producers and Exporters', sectionType: 'chapter' },
    { title: '12.3 Recommendations for Retailers', sectionType: 'chapter' },
    { title: '12.4 Recommendations for Buyers and Collectors', sectionType: 'chapter' },
    { title: '12.5 Recommendations for Government Institutions', sectionType: 'chapter' },
    { title: '12.6 Recommendations for Certification Bodies', sectionType: 'chapter' },
    { title: '12.7 Recommendations for Market Platforms', sectionType: 'chapter' },
    { title: '12.8 Recommendations for Research and Documentation Institutions', sectionType: 'chapter' },
    { title: '13. Conclusion', sectionType: 'part' },
    { title: '13.1 Protecting Authenticity', sectionType: 'chapter' },
    { title: '13.2 Strengthening Artisan Value', sectionType: 'chapter' },
    { title: '13.3 Building Buyer Confidence', sectionType: 'chapter' },
    { title: '13.4 Positioning Kashmiri Crafts within Global Luxury Markets', sectionType: 'chapter' },
    { title: 'Appendices', sectionType: 'part' },
    { title: 'Appendix A — Premium Pricing Assessment Checklist', sectionType: 'back-matter' },
    { title: 'Appendix B — Product Provenance Documentation Framework', sectionType: 'back-matter' },
    { title: 'Appendix C — Craft-Specific Quality Indicators', sectionType: 'back-matter' },
    { title: 'Appendix D — Buyer Verification Checklist', sectionType: 'back-matter' },
    { title: 'Appendix E — Glossary of Market and Craft Terms', sectionType: 'back-matter' },
    { title: 'Appendix F — Publication Methodology and Limitations', sectionType: 'back-matter' },
  ];

  for (let i = 0; i < toc.length; i++) {
    await prisma.chapter.create({
      data: {
        publicationId: pub.id,
        title: toc[i].title,
        order: i + 1,
        status: 'PUBLISHED',
        sectionType: toc[i].sectionType,
      }
    });
  }

  console.log(`Flagship publication seeded successfully: ${pub.id}`);
}

seed().catch(console.error).finally(() => prisma.$disconnect());
