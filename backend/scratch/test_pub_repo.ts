import { PublicationModule } from '../src/domain/publication/module';

async function main() {
  try {
    console.log("Initializing PublicationModule...");
    const pubModule = PublicationModule.getInstance();
    console.log("Calling findPublicationCards...");
    const aggregates = await pubModule.repository.findPublicationCards({
      visibility: 'PUBLIC'
    });
    console.log("Success! Found:", aggregates.length);
    console.log("Projecting public cards...");
    const dtos = pubModule.projectionService.projectPublicCards(aggregates);
    console.log("Success! Projected:", dtos.length);
    console.log(JSON.stringify(dtos.slice(0, 2), null, 2));
  } catch (err: any) {
    console.error("Error during execution:", err);
  }
}

main().catch(console.error);
