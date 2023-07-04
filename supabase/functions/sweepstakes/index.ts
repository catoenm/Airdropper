import { Application, Router } from "oak";
import { getEnvKeypair } from "../utils/keypair.ts";
import { getCollectiblesByWallet } from "../utils/collectibles.ts";

const COLLECTION_ID = "BSSKxxsMXEFozV4kQoqNqhfvjpQxJBCf2jB7mR2Bqx4p";

const router = new Router();
router.get("/sweepstakes", async (context) => {
  const keypair = getEnvKeypair();
  const pubkey = context.params.pubkey;

  // Fetch all collectibles
  const collectibles = await getCollectiblesByWallet(keypair.publicKey);
  const filteredCollectibles = collectibles.filter(
    (c: any) => c?.collection?.id === COLLECTION_ID
  );

  // Pick a random collectible
  const sweepstakes =
    filteredCollectibles[
      Math.floor(Math.random() * filteredCollectibles.length)
    ];

  // Find expiration date
  const currentDate = new Date();
  const expiresAt = new Date(currentDate.getTime() + 20 * 60000);

  context.response.body = {
    num: filteredCollectibles.length,
    name: sweepstakes.name,
    image: sweepstakes.media.image.url,
    expiresAt,
  };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
