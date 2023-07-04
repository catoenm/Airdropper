import { Application, Router } from "oak";
import { getEnvKeypair } from "../utils/keypair.ts";
import { getCollectiblesByWallet } from "../utils/collectibles.ts";

const router = new Router();
router.get("/sweepstakes", async (context) => {
  const keypair = getEnvKeypair();

  const pubkey = context.params.pubkey;
  const nfts = await getCollectiblesByWallet(keypair.publicKey);
  const sweepstakes = nfts[Math.floor(Math.random() * nfts.length)];

  context.response.body = {
    playerPubkey: pubkey,
    name: sweepstakes.name,
    image: sweepstakes.media.image,
  };
});

router.get("/reward/sweepstakes", (context) => {
  context.response.body = { data: "These are the sweepstakes" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
